import { TARGET_ROLES } from "@/data/career-catalog";
import type {
  AssessmentAttempt,
  CareerReadinessScore,
  CareerReadinessTier,
  PersonalizedRoadmapItem,
  ReadinessDimensionBreakdown,
  SkillGapDetail,
  SkillPassportItemStatus,
  TargetRoleAnalysis,
} from "@/types";
import type { DeclaredSkill, SkillCategory, StudentProfile } from "@/types";

export class ReadinessEngine {
  /**
   * Evaluates the multi-dimensional Career Readiness score (0-100).
   */
  calculateCareerReadiness(
    profile: StudentProfile,
    latestAttempt: AssessmentAttempt | null,
    roadmapItems: PersonalizedRoadmapItem[] = [],
  ): CareerReadinessScore {
    const declaredSkills = profile.declaredSkills ?? [];
    const assessedSkills = declaredSkills.filter((s) => s.assessedScore !== undefined);
    const projects = profile.projects ?? [];
    const experience = profile.experience ?? [];
    const certs = profile.certifications ?? [];
    const achievements = profile.achievements ?? [];

    // 1. Technical Skills (0-100)
    let techScore = 0;
    if (declaredSkills.length > 0) {
      const avgDeclared =
        declaredSkills.reduce((acc, s) => acc + s.proficiencyLevel, 0) / declaredSkills.length;
      const avgAssessed =
        assessedSkills.length > 0
          ? assessedSkills.reduce((acc, s) => acc + (s.assessedScore ?? 0), 0) /
            assessedSkills.length
          : avgDeclared;
      // 65% assessed weight if available, 35% self-declared
      techScore =
        assessedSkills.length > 0
          ? Math.round(avgAssessed * 0.65 + avgDeclared * 0.35)
          : Math.round(avgDeclared * 0.8);
    }

    // 2. Problem Solving (0-100)
    const dsaSkill = declaredSkills.find(
      (s) =>
        s.name.toLowerCase().includes("data structures") ||
        s.name.toLowerCase().includes("algorithm") ||
        s.name.toLowerCase().includes("problem solving"),
    );
    let problemSolving = dsaSkill ? (dsaSkill.assessedScore ?? dsaSkill.proficiencyLevel) : 60;
    if (latestAttempt) {
      const csQuestions = latestAttempt.questions.filter(
        (q) => q.category === "Computer Science Fundamentals",
      );
      if (csQuestions.length > 0) {
        const correctCount = csQuestions.filter(
          (q) => latestAttempt.answers[q.id] === q.correctAnswer,
        ).length;
        problemSolving = Math.round((correctCount / csQuestions.length) * 100);
      }
    }

    // 3. Communication (0-100)
    const hasHeadline = !!profile.headline && profile.headline.length > 10;
    const hasAbout = !!profile.about && profile.about.length > 30;
    const softSkillsCount = declaredSkills.filter(
      (s) =>
        s.category === "Software Engineering Practices" ||
        s.category === "UI / UX & Product Design",
    ).length;
    let communication = 55;
    if (hasHeadline) communication += 15;
    if (hasAbout) communication += 15;
    if (softSkillsCount > 0) communication += 15;
    communication = Math.min(100, communication);

    // 4. Teamwork (0-100)
    let teamwork = 50;
    if (experience.length > 0) teamwork += 25;
    const hasCollaborativeProject = projects.some(
      (p) =>
        (p.description && p.description.toLowerCase().includes("team")) ||
        (p.tech && p.tech.some((t: string) => t.toLowerCase().includes("git"))),
    );
    if (hasCollaborativeProject) teamwork += 15;
    const hasGit = declaredSkills.some((s) => s.name.toLowerCase().includes("git"));
    if (hasGit) teamwork += 10;
    teamwork = Math.min(100, teamwork);

    // 5. Leadership (0-100)
    let leadership = 45;
    if (achievements.length > 0) leadership += Math.min(30, achievements.length * 15);
    if (experience.length > 1) leadership += 15;
    if (certs.length > 2) leadership += 10;
    leadership = Math.min(100, leadership);

    // 6. Evidence Quality (0-100)
    const totalEvidence = declaredSkills.reduce((acc, s) => acc + s.evidence.length, 0);
    const evidenceWithUrl = declaredSkills.reduce(
      (acc, s) => acc + s.evidence.filter((e) => !!e.url).length,
      0,
    );
    let evidenceQuality = Math.min(100, totalEvidence * 15 + evidenceWithUrl * 10);
    if (totalEvidence === 0 && declaredSkills.length > 0) evidenceQuality = 35;

    // 7. Portfolio Strength (0-100)
    const projectsWithUrl = projects.filter((p) => !!p.liveUrl || !!p.githubUrl).length;
    let portfolioStrength = Math.min(100, projects.length * 20 + projectsWithUrl * 15);
    if (projects.length === 0) portfolioStrength = 30;

    // 8. Assessment Performance (0-100)
    let assessmentPerformance = 50;
    if (latestAttempt) {
      assessmentPerformance = Math.round(
        latestAttempt.overallScore * 0.7 + latestAttempt.accuracy * 0.3,
      );
    }

    // Roadmap Completion Bonus
    const completedRoadmapCount = roadmapItems.filter((r) => r.status === "completed").length;
    const roadmapBonus = Math.min(10, completedRoadmapCount * 3);

    const dimensions: ReadinessDimensionBreakdown = {
      technicalSkills: Math.min(100, Math.max(0, techScore)),
      problemSolving: Math.min(100, Math.max(0, problemSolving)),
      communication: Math.min(100, Math.max(0, communication)),
      teamwork: Math.min(100, Math.max(0, teamwork)),
      leadership: Math.min(100, Math.max(0, leadership)),
      evidenceQuality: Math.min(100, Math.max(0, evidenceQuality)),
      portfolioStrength: Math.min(100, Math.max(0, portfolioStrength)),
      assessmentPerformance: Math.min(100, Math.max(0, assessmentPerformance)),
    };

    // Weighted Overall Score
    // Tech: 25%, Assessment: 20%, ProblemSolving: 15%, Portfolio: 15%, Evidence: 10%, Communication: 5%, Teamwork: 5%, Leadership: 5%
    const rawWeighted =
      dimensions.technicalSkills * 0.25 +
      dimensions.assessmentPerformance * 0.2 +
      dimensions.problemSolving * 0.15 +
      dimensions.portfolioStrength * 0.15 +
      dimensions.evidenceQuality * 0.1 +
      dimensions.communication * 0.05 +
      dimensions.teamwork * 0.05 +
      dimensions.leadership * 0.05;

    const overallScore = Math.min(100, Math.round(rawWeighted + roadmapBonus));

    // Determine Tier
    let tier: CareerReadinessTier = "Developing";
    if (overallScore >= 85) tier = "Distinction Ready";
    else if (overallScore >= 75) tier = "Job Ready";
    else if (overallScore >= 60) tier = "Proficient";
    else if (overallScore >= 45) tier = "Developing";
    else tier = "Emerging";

    // Strengths and Gaps
    const topStrengths: string[] = [];
    const criticalGaps: string[] = [];

    if (dimensions.technicalSkills >= 75) topStrengths.push("High Technical Proficiency");
    if (dimensions.assessmentPerformance >= 80)
      topStrengths.push("Exceptional Test Accuracy & Consistency");
    if (dimensions.portfolioStrength >= 70) topStrengths.push("Robust Verified Project Portfolio");
    if (dimensions.evidenceQuality >= 70) topStrengths.push("Strong Evidence Verification Trail");

    if (dimensions.evidenceQuality < 50)
      criticalGaps.push(
        "Low Evidence Ratio — Link GitHub repos or certificates to declared skills",
      );
    if (dimensions.assessmentPerformance < 60)
      criticalGaps.push("Assessment Score Needs Calibration — Re-test foundational topics");
    if (dimensions.problemSolving < 60)
      criticalGaps.push("DSA / Algorithmic Problem Solving requires practice");
    if (dimensions.portfolioStrength < 50)
      criticalGaps.push("Portfolio lacks live deployed projects or interactive demos");

    return {
      overallScore,
      tier,
      dimensions,
      topStrengths: topStrengths.length > 0 ? topStrengths : ["Consistent baseline progress"],
      criticalGaps: criticalGaps.length > 0 ? criticalGaps : ["Continue advancing roadmap goals"],
      readinessDelta: latestAttempt ? 6 : 0,
    };
  }

  /**
   * Analyzes student fit and readiness for target roles.
   */
  analyzeTargetRoles(
    profile: StudentProfile,
    declaredSkills: DeclaredSkill[],
    latestAttempt: AssessmentAttempt | null,
  ): TargetRoleAnalysis[] {
    const studentTargetRoleNames = profile.careerPreferences?.targetRoles ?? [
      "Full Stack Developer",
      "Frontend Developer",
      "Backend Developer",
    ];

    // Map declared skill names for case-insensitive lookup
    const declaredMap = new Map<string, DeclaredSkill>();
    declaredSkills.forEach((s) => declaredMap.set(s.name.toLowerCase(), s));

    const roleAnalyses: TargetRoleAnalysis[] = [];

    // Find all target roles in catalog (or matching student target roles)
    const rolesToAnalyze = TARGET_ROLES.filter(
      (tr) =>
        studentTargetRoleNames.some(
          (str) =>
            str.toLowerCase() === tr.title.toLowerCase() ||
            tr.title.toLowerCase().includes(str.toLowerCase()),
        ) ||
        // Always include top standard engineering roles if list is small
        studentTargetRoleNames.length < 3,
    );

    const activeRoles = rolesToAnalyze.length > 0 ? rolesToAnalyze : TARGET_ROLES.slice(0, 5);

    for (const role of activeRoles) {
      const recommended = role.recommendedSkills;
      const matchingSkills: string[] = [];
      const missingSkills: string[] = [];

      let matchingScoreSum = 0;

      for (const skillReq of recommended) {
        const found = declaredMap.get(skillReq.toLowerCase());
        if (found) {
          matchingSkills.push(found.name);
          const score = found.assessedScore ?? found.proficiencyLevel;
          matchingScoreSum += score;
        } else {
          // Check partial match
          const partial = Array.from(declaredMap.values()).find(
            (s) =>
              s.name.toLowerCase().includes(skillReq.toLowerCase()) ||
              skillReq.toLowerCase().includes(s.name.toLowerCase()),
          );
          if (partial) {
            matchingSkills.push(partial.name);
            matchingScoreSum += (partial.assessedScore ?? partial.proficiencyLevel) * 0.8;
          } else {
            missingSkills.push(skillReq);
          }
        }
      }

      const matchPercentage =
        recommended.length > 0 ? Math.round((matchingSkills.length / recommended.length) * 100) : 0;

      // Readiness combines match percentage with score quality on matched skills
      const avgMatchedQuality =
        matchingSkills.length > 0 ? matchingScoreSum / matchingSkills.length : 0;
      const readinessPercentage = Math.min(
        100,
        Math.round(matchPercentage * 0.6 + avgMatchedQuality * 0.4),
      );

      // Priority skills: top 2-3 missing skills
      const prioritySkills = missingSkills.slice(0, 3);

      // Difficulty level based on role requirements
      const difficultyLevel =
        recommended.length > 7
          ? "Senior Track"
          : recommended.length > 5
            ? "Mid Level"
            : "Entry Level";

      // Suitability rationale
      let suitabilityReason = `You currently demonstrate ${matchingSkills.length} of ${recommended.length} core competencies for ${role.title}.`;
      if (matchingSkills.length > 0) {
        suitabilityReason += ` Strong match in ${matchingSkills.slice(0, 3).join(", ")}.`;
      }
      if (missingSkills.length > 0) {
        suitabilityReason += ` Mastering ${missingSkills.slice(0, 2).join(" & ")} will bridge the remaining gap.`;
      }

      const estimatedImpact =
        missingSkills.length > 0
          ? `+${Math.min(25, missingSkills.length * 7)}% Readiness on mastering ${prioritySkills[0] || "core tools"}`
          : "Role requirements fully satisfied";

      roleAnalyses.push({
        roleId: role.id,
        title: role.title,
        category: role.category,
        matchPercentage,
        readinessPercentage,
        matchingSkills,
        missingSkills,
        prioritySkills,
        difficultyLevel,
        suitabilityReason,
        estimatedReadinessImpact: estimatedImpact,
      });
    }

    // Sort roles strictly from highest readiness to lowest
    return roleAnalyses.sort((a, b) => b.readinessPercentage - a.readinessPercentage);
  }

  /**
   * Extracts prioritized concrete skill gaps from target role analyses.
   */
  extractSkillGaps(
    roleAnalyses: TargetRoleAnalysis[],
    declaredSkills: DeclaredSkill[],
    latestAttempt: AssessmentAttempt | null,
  ): SkillGapDetail[] {
    const gapsMap = new Map<
      string,
      {
        roles: string[];
        isUnderperforming: boolean;
        assessedScore?: number;
      }
    >();

    // Collect missing skills across target roles
    roleAnalyses.forEach((ra) => {
      ra.missingSkills.forEach((skill) => {
        const existing = gapsMap.get(skill) ?? { roles: [], isUnderperforming: false };
        if (!existing.roles.includes(ra.title)) {
          existing.roles.push(ra.title);
        }
        gapsMap.set(skill, existing);
      });
    });

    // Also flag skills with low assessment scores (< 60% or Below Self-Assessment)
    declaredSkills.forEach((ds) => {
      if (
        (ds.assessedScore !== undefined && ds.assessedScore < 60) ||
        ds.gapStatus === "Below Self-Assessment"
      ) {
        const existing = gapsMap.get(ds.name) ?? { roles: [], isUnderperforming: true };
        existing.isUnderperforming = true;
        if (ds.assessedScore !== undefined) {
          existing.assessedScore = ds.assessedScore;
        }
        gapsMap.set(ds.name, existing);
      }
    });

    const gapDetails: SkillGapDetail[] = [];
    const topRoleTitle = roleAnalyses[0]?.title ?? "";

    gapsMap.forEach((info, skillName) => {
      const priority: "high" | "medium" | "low" =
        info.roles.length >= 2 || info.isUnderperforming
          ? "high"
          : info.roles.length === 1
            ? "medium"
            : "low";

      let category: SkillCategory = "Programming Languages";
      if (
        skillName.includes("React") ||
        skillName.includes("HTML") ||
        skillName.includes("CSS") ||
        skillName.includes("Tailwind") ||
        skillName.includes("Next")
      ) {
        category = "Web & Frontend";
      } else if (
        skillName.includes("Node") ||
        skillName.includes("API") ||
        skillName.includes("Express")
      ) {
        category = "Backend & APIs";
      } else if (
        skillName.includes("Docker") ||
        skillName.includes("AWS") ||
        skillName.includes("Cloud")
      ) {
        category = "Cloud Computing";
      } else if (
        skillName.includes("SQL") ||
        skillName.includes("Postgres") ||
        skillName.includes("Mongo")
      ) {
        category = "Databases & Storage";
      } else if (
        skillName.includes("Structure") ||
        skillName.includes("Algorithm") ||
        skillName.includes("Design")
      ) {
        category = "Computer Science Fundamentals";
      }

      let currentStatus = "Missing from profile";
      let recommendedAction = `Add ${skillName} to your learning roadmap and complete guided modules.`;
      if (info.isUnderperforming) {
        currentStatus = `Diagnostic Score: ${info.assessedScore ?? 45}% (Needs Calibration)`;
        recommendedAction = `Revisit core concepts in ${skillName} and retake adaptive assessment.`;
      }

      gapDetails.push({
        skillName,
        category,
        targetRolesAffected: info.roles,
        priority,
        currentStatus,
        requiredForTopRole: info.roles.includes(topRoleTitle),
        recommendedAction,
        readinessBoost: priority === "high" ? 8 : priority === "medium" ? 5 : 3,
      });
    });

    // Sort by priority (high first)
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    return gapDetails.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }

  /**
   * Generates dynamic roadmap items strictly derived from detected skill gaps.
   */
  generatePersonalizedRoadmap(
    profile: StudentProfile,
    gaps: SkillGapDetail[],
    existingRoadmap: PersonalizedRoadmapItem[] = [],
  ): PersonalizedRoadmapItem[] {
    const existingMap = new Map<string, PersonalizedRoadmapItem>();
    existingRoadmap.forEach((item) => existingMap.set(item.skillName.toLowerCase(), item));

    const roadmapItems: PersonalizedRoadmapItem[] = [];

    // Prioritize top gaps
    for (const gap of gaps.slice(0, 6)) {
      const existing = existingMap.get(gap.skillName.toLowerCase());
      if (existing) {
        // Preserve student's progress and module completion
        roadmapItems.push(existing);
      } else {
        // Generate new personalized roadmap milestone
        const difficulty =
          gap.priority === "high"
            ? "Intermediate"
            : gap.priority === "medium"
              ? "Beginner"
              : "Advanced";
        const estimatedDuration = gap.priority === "high" ? "2-3 weeks" : "1-2 weeks";

        const modules = [
          {
            id: `mod-${gap.skillName.toLowerCase()}-1`,
            title: `Core Fundamentals & Syntax in ${gap.skillName}`,
            completed: false,
          },
          {
            id: `mod-${gap.skillName.toLowerCase()}-2`,
            title: `Practical Architecture & Best Practices`,
            completed: false,
          },
          {
            id: `mod-${gap.skillName.toLowerCase()}-3`,
            title: `Real-World Capstone Implementation & Verification`,
            completed: false,
          },
        ];

        roadmapItems.push({
          id: `roadmap-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          skillName: gap.skillName,
          category: gap.category,
          whyItMatters:
            gap.targetRolesAffected.length > 0
              ? `Essential prerequisite for ${gap.targetRolesAffected.join(", ")}.`
              : `Critical engineering competency to elevate your overall readiness.`,
          difficulty,
          estimatedDuration,
          progress: 0,
          status: "not_started",
          modules,
          associatedTargetRoles: gap.targetRolesAffected,
          readinessImpact: gap.readinessBoost,
        });
      }
    }

    return roadmapItems;
  }

  /**
   * Computes the granular passport item status badge.
   */
  evaluateSkillPassportStatus(skill: DeclaredSkill): SkillPassportItemStatus {
    if (skill.assessedScore === undefined) {
      return "Unassessed";
    }

    if (skill.assessedScore >= 80 && skill.evidence.length >= 2) {
      return "High Confidence";
    }

    if (skill.assessedScore >= 75) {
      return "Strong";
    }

    if (skill.assessedScore >= 55) {
      return "Developing";
    }

    return "Needs Improvement";
  }
}

export const readinessEngine = new ReadinessEngine();
