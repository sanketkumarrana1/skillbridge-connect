import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { MockAssessmentGenerator } from "@/services/assessment/mock-generator";
import { ScoringEngine } from "@/services/assessment/scoring-engine";
import type {
  AssessmentAttempt,
  AssessmentDifficulty,
  AssessmentQuestion,
  AssessmentSetupConfig,
  ConfidenceLevel,
  GapStatus,
  SkillAssessmentResult,
} from "@/types/assessment";
import type { SkillCategory, SkillProficiency, StudentProfile } from "@/types";

const mockGenerator = new MockAssessmentGenerator();
const scoringEngine = new ScoringEngine();

export class AssessmentService {
  /**
   * Start a new assessment attempt and fetch assigned questions.
   */
  static async createAssessment(
    studentId: string,
    config: AssessmentSetupConfig,
    profileFallback: StudentProfile,
  ): Promise<{ attemptId: string; questions: AssessmentQuestion[] }> {
    if (!isSupabaseConfigured) {
      const mockQuestions = mockGenerator.generateAssessment(profileFallback, config);
      const attemptId = `att-mock-${Date.now()}`;
      return { attemptId, questions: mockQuestions };
    }

    try {
      // 1. Call create_personalized_assessment RPC
      const { data: createRes, error: createErr } = await (supabase.rpc as any)(
        "create_personalized_assessment",
        {
          p_student_id: studentId,
          p_config: {
            question_count: config.questionCount,
            duration_minutes: config.timeLimitMinutes,
            mode: config.mode,
            selected_skills: config.selectedSkillNames,
            target_roles: config.targetRoles,
          },
        },
      );

      if (createErr || !createRes || !createRes.attempt_id) {
        console.warn("[AssessmentService] RPC create failed, falling back to mock generator:", createErr);
        const mockQuestions = mockGenerator.generateAssessment(profileFallback, config);
        return { attemptId: `att-mock-${Date.now()}`, questions: mockQuestions };
      }

      const attemptId: string = createRes.attempt_id;

      // 2. Fetch assigned question definitions (without correct answers)
      const { data: questionsRes, error: qErr } = await (supabase.rpc as any)(
        "get_assessment_attempt_questions",
        {
          p_attempt_id: attemptId,
        },
      );

      if (qErr || !questionsRes || questionsRes.length === 0) {
        console.warn("[AssessmentService] RPC get questions failed, falling back:", qErr);
        const mockQuestions = mockGenerator.generateAssessment(profileFallback, config);
        return { attemptId, questions: mockQuestions };
      }

      const formattedQuestions: AssessmentQuestion[] = questionsRes.map((q: any) => {
        const optionList = (q.options || []).map((opt: any) => opt.option_text);
        const optionsTuple: [string, string, string, string] = [
          optionList[0] || "Option A",
          optionList[1] || "Option B",
          optionList[2] || "Option C",
          optionList[3] || "Option D",
        ];

        return {
          id: q.question_id,
          skillId: q.skill_id,
          skillName: q.skill_name,
          category: q.category_name as SkillCategory,
          topic: q.topic,
          difficulty: q.difficulty as AssessmentDifficulty,
          question: q.question_text,
          options: optionsTuple,
          correctAnswer: -1, // Server-side secured; client does not see correct answer
          explanation: "", // Released only after submit
          score: q.score_value || 10,
        };
      });

      return {
        attemptId,
        questions: formattedQuestions,
      };
    } catch (err) {
      console.error("[AssessmentService] Exception starting assessment:", err);
      const mockQuestions = mockGenerator.generateAssessment(profileFallback, config);
      return { attemptId: `att-mock-${Date.now()}`, questions: mockQuestions };
    }
  }

  /**
   * Submit an assessment attempt and receive server-side calculated scores and skill results.
   */
  static async submitAttempt(
    attemptId: string,
    answers: Record<string, number>,
    profile: StudentProfile,
    questions: AssessmentQuestion[],
    timeUsedSeconds: number,
    config: AssessmentSetupConfig,
  ): Promise<AssessmentAttempt> {
    if (!isSupabaseConfigured || attemptId.startsWith("att-mock-")) {
      return scoringEngine.calculateResult(
        questions,
        answers,
        profile,
        timeUsedSeconds,
        config.timeLimitMinutes,
        config.mode,
      );
    }

    try {
      // 1. Submit answers to secure scoring RPC
      const { data: submitRes, error: submitErr } = await (supabase.rpc as any)(
        "submit_assessment_attempt",
        {
          p_attempt_id: attemptId,
          p_answers: answers,
          p_time_used_seconds: timeUsedSeconds,
        },
      );

      if (submitErr || !submitRes) {
        console.warn("[AssessmentService] RPC submission warning, falling back to local scoring:", submitErr);
        return scoringEngine.calculateResult(
          questions,
          answers,
          profile,
          timeUsedSeconds,
          config.timeLimitMinutes,
          config.mode,
        );
      }

      // 2. Fetch full persisted skill results
      const { data: skillResultsData } = await supabase
        .from("assessment_skill_results")
        .select(`
          skill_id,
          questions_count,
          attempted_count,
          correct_count,
          score,
          assessed_level,
          confidence,
          result_status,
          skills ( name, skill_categories ( name ) )
        `)
        .eq("attempt_id", attemptId);

      const declaredSkills = profile.declaredSkills ?? [];
      const skillSelfRatingMap = new Map<string, SkillProficiency>();
      declaredSkills.forEach((s) => skillSelfRatingMap.set(s.name.toLowerCase(), s.proficiency));

      const strengths: string[] = [];
      const weaknesses: string[] = [];
      const detectedGaps: string[] = [];

      const skillResults: SkillAssessmentResult[] = (skillResultsData || []).map((row: any) => {
        const sName = row.skills?.name || "Skill";
        const cat = (row.skills?.skill_categories?.name || "Programming Languages") as SkillCategory;
        const selfRated: SkillProficiency = skillSelfRatingMap.get(sName.toLowerCase()) ?? "intermediate";
        const assessedLevel: SkillProficiency = row.assessed_level;
        const accuracy = row.attempted_count > 0 ? Math.round((row.correct_count / row.attempted_count) * 100) : 0;
        const confidence: ConfidenceLevel = row.confidence as ConfidenceLevel;

        let gapStatus: GapStatus = "Confirmed";
        const levelRank: Record<SkillProficiency, number> = { beginner: 1, intermediate: 2, advanced: 3 };
        if (row.attempted_count <= 1) {
          gapStatus = "Needs More Evidence";
        } else if (levelRank[assessedLevel] > levelRank[selfRated]) {
          gapStatus = "Above Self-Assessment";
        } else if (levelRank[assessedLevel] < levelRank[selfRated]) {
          gapStatus = "Below Self-Assessment";
        }

        if (row.score >= 80) strengths.push(sName);
        if (row.score < 55) weaknesses.push(sName);
        if (gapStatus === "Below Self-Assessment") detectedGaps.push(sName);

        return {
          skillName: sName,
          category: cat,
          selfRatedLevel: selfRated,
          assessedLevel,
          score: row.score,
          accuracy,
          questionsAttempted: row.attempted_count,
          correctCount: row.correct_count,
          confidence,
          gapStatus,
        };
      });

      // Category scores
      const categoryScores: Record<string, number> = {};
      skillResults.forEach((sr) => {
        categoryScores[sr.category] = sr.score;
      });

      return {
        id: attemptId,
        studentId: profile.email || "student",
        completedAt: new Date().toISOString(),
        mode: config.mode,
        questionCount: submitRes.total_questions || questions.length,
        durationMinutes: config.timeLimitMinutes,
        timeUsedSeconds,
        overallScore: submitRes.overall_score || 0,
        accuracy: submitRes.accuracy_percentage || 0,
        skillsAssessed: skillResults.map((s) => s.skillName),
        categoryScores,
        skillResults,
        strengths,
        weaknesses,
        detectedGaps,
        answers,
        questions,
      };
    } catch (err) {
      console.error("[AssessmentService] Error submitting attempt:", err);
      return scoringEngine.calculateResult(
        questions,
        answers,
        profile,
        timeUsedSeconds,
        config.timeLimitMinutes,
        config.mode,
      );
    }
  }

  /**
   * Fetch assessment history for a student from Supabase.
   */
  static async getAssessmentHistory(studentId: string): Promise<AssessmentAttempt[]> {
    if (!isSupabaseConfigured) return [];

    try {
      const { data: attempts, error } = await supabase
        .from("assessment_attempts")
        .select(`
          id,
          student_id,
          status,
          started_at,
          submitted_at,
          duration_seconds,
          question_count,
          overall_score,
          accuracy_percentage,
          assessment_configs (
            duration_minutes
          ),
          assessment_skill_results (
            score,
            assessed_level,
            confidence,
            result_status,
            questions_count,
            attempted_count,
            correct_count,
            skills (
              name,
              skill_categories ( name )
            )
          )
        `)
        .eq("student_id", studentId)
        .in("status", ["submitted", "auto_submitted"])
        .order("submitted_at", { ascending: false });

      if (error || !attempts) {
        return [];
      }

      return attempts.map((att: any) => {
        const skillResults: SkillAssessmentResult[] = (att.assessment_skill_results || []).map(
          (sr: any) => {
            const skillName = sr.skills?.name || "Skill";
            const category = (sr.skills?.skill_categories?.name || "General") as SkillCategory;
            const accuracy =
              sr.attempted_count > 0
                ? Math.round((sr.correct_count / sr.attempted_count) * 100)
                : 0;

            return {
              skillName,
              category,
              selfRatedLevel: "intermediate" as SkillProficiency,
              assessedLevel: sr.assessed_level as SkillProficiency,
              score: sr.score,
              accuracy,
              questionsAttempted: sr.attempted_count,
              correctCount: sr.correct_count,
              confidence: sr.confidence as ConfidenceLevel,
              gapStatus: "Confirmed" as GapStatus,
            };
          },
        );

        const categoryScores: Record<string, number> = {};
        skillResults.forEach((s) => {
          categoryScores[s.category] = s.score;
        });

        return {
          id: att.id,
          studentId: att.student_id,
          completedAt: att.submitted_at || att.started_at,
          mode: "skill_verification",
          questionCount: att.question_count,
          durationMinutes: att.assessment_configs?.duration_minutes || 15,
          timeUsedSeconds: att.duration_seconds || 0,
          overallScore: Number(att.overall_score) || 0,
          accuracy: Number(att.accuracy_percentage) || 0,
          skillsAssessed: skillResults.map((s) => s.skillName),
          categoryScores,
          skillResults,
          strengths: skillResults.filter((s) => s.score >= 80).map((s) => s.skillName),
          weaknesses: skillResults.filter((s) => s.score < 55).map((s) => s.skillName),
          detectedGaps: [],
          answers: {},
          questions: [],
        };
      });
    } catch (err) {
      console.error("[AssessmentService] Error fetching history:", err);
      return [];
    }
  }
}

