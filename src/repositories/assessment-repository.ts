import type { IAssessmentRepository } from "./types";
import { AssessmentService } from "@/services/assessment-service";
import { MockAssessmentGenerator } from "@/services/assessment/mock-generator";
import { ScoringEngine } from "@/services/assessment/scoring-engine";
import { studentProfile as seedProfile } from "@/data/mock";
import { isSupabaseConfigured } from "@/lib/supabase";
import type {
  AssessmentAttempt,
  AssessmentQuestion,
  AssessmentSetupConfig,
} from "@/types/assessment";

const mockGenerator = new MockAssessmentGenerator();
const scoringEngine = new ScoringEngine();

export class MockAssessmentRepository implements IAssessmentRepository {
  private history: AssessmentAttempt[] = [];

  async createAssessment(
    _studentId: string,
    config: AssessmentSetupConfig,
  ): Promise<{ attemptId: string; questions: AssessmentQuestion[] }> {
    const questions = mockGenerator.generateAssessment(seedProfile, config);
    const attemptId = `att-mock-${Date.now()}`;
    return { attemptId, questions };
  }

  async submitAttempt(
    attemptId: string,
    answers: Record<string, number>,
    timeUsedSeconds: number,
  ): Promise<AssessmentAttempt> {
    const result = scoringEngine.calculateResult(
      [],
      answers,
      seedProfile,
      timeUsedSeconds,
      15,
      "skill_verification",
    );
    result.id = attemptId;
    this.history.unshift(result);
    return result;
  }

  async getHistory(_studentId: string): Promise<AssessmentAttempt[]> {
    return [...this.history];
  }

  async getLatestResult(_studentId: string): Promise<AssessmentAttempt | null> {
    return this.history.length > 0 ? this.history[0]! : null;
  }
}

export class SupabaseAssessmentRepository implements IAssessmentRepository {
  private mockFallback = new MockAssessmentRepository();

  async createAssessment(
    studentId: string,
    config: AssessmentSetupConfig,
  ): Promise<{ attemptId: string; questions: AssessmentQuestion[] }> {
    if (!isSupabaseConfigured || !studentId) {
      return this.mockFallback.createAssessment(studentId, config);
    }
    return AssessmentService.createAssessment(studentId, config, seedProfile);
  }

  async submitAttempt(
    attemptId: string,
    answers: Record<string, number>,
    timeUsedSeconds: number,
  ): Promise<AssessmentAttempt> {
    if (!isSupabaseConfigured || attemptId.startsWith("att-mock-")) {
      return this.mockFallback.submitAttempt(attemptId, answers, timeUsedSeconds);
    }
    return AssessmentService.submitAttempt(
      attemptId,
      answers,
      seedProfile,
      [],
      timeUsedSeconds,
      {
        questionCount: 20,
        mode: "skill_verification",
        timeLimitMinutes: 15,
        selectedSkillNames: [],
        targetRoles: [],
      },
    );
  }

  async getHistory(studentId: string): Promise<AssessmentAttempt[]> {
    if (!isSupabaseConfigured || !studentId) {
      return this.mockFallback.getHistory(studentId);
    }
    return AssessmentService.getAssessmentHistory(studentId);
  }

  async getLatestResult(studentId: string): Promise<AssessmentAttempt | null> {
    const history = await this.getHistory(studentId);
    return history.length > 0 ? history[0]! : null;
  }
}

export const mockAssessmentRepository = new MockAssessmentRepository();
export const assessmentRepository = new SupabaseAssessmentRepository();

