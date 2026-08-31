// ==============================================================================
// AcadIn Interview Intelligence Service (Gemini + Role Grounding)
// Description: Tailored interview preparation guides, question sets, and practice answer evaluations.
// ==============================================================================

import type { IInterviewIntelligenceService } from "@/types/ai-boundaries";
import type { InterviewPreparationResult, InterviewPracticeResult } from "@/services/ai/ai-service-contracts";
import { AIGatewayClient } from "@/services/ai/ai-gateway-client";

export class GeminiInterviewAIService implements IInterviewIntelligenceService {
  async prepareInterview(params: {
    studentId?: string | undefined;
    targetRole: string;
    opportunityId?: string | undefined;
    skillGaps?: string[] | undefined;
  }): Promise<InterviewPreparationResult> {
    try {
      const res = await AIGatewayClient.prepareInterview({
        targetRole: params.targetRole,
        opportunityId: params.opportunityId,
        skillGaps: params.skillGaps,
      });

      if (res) {
        if (params.studentId) {
          void AIGatewayClient.saveInterviewPreparation(
            params.studentId,
            params.targetRole,
            res,
            params.opportunityId,
            "gemini",
            "gemini-1.5-flash",
            false,
          );
        }
        return res;
      }
    } catch (err) {
      console.warn("[GeminiInterviewAIService] AI interview preparation fallback:", err);
    }

    // Deterministic fallback
    return {
      focusAreas: ["System Design", "Core Data Structures", "Concurrency"],
      suggestedQuestions: [
        {
          question: `Explain how you would design a scalable API architecture for a ${params.targetRole} role.`,
          type: "System Design",
          keyPointsToCover: ["Separation of concerns", "Database scaling", "Caching layers", "Error handling"],
        },
      ],
      preparationChecklist: [
        `Review core architectural concepts for ${params.targetRole}`,
        "Practice communicating complex trade-offs using the STAR method",
        "Prepare 2 questions to ask the interviewer regarding team workflows",
      ],
    };
  }

  async evaluatePracticeAnswer(params: {
    question: string;
    type: string;
    answer: string;
  }): Promise<InterviewPracticeResult> {
    try {
      const res = await AIGatewayClient.evaluatePracticeAnswer(params);
      if (res) return res;
    } catch (err) {
      console.warn("[GeminiInterviewAIService] AI practice evaluation fallback:", err);
    }

    // Deterministic fallback
    const wordCount = params.answer.trim().split(/\s+/).length;
    const isAdequate = wordCount >= 30;

    return {
      technicalAccuracy: isAdequate ? 80 : 60,
      communicationClarity: isAdequate ? 85 : 65,
      strengths: ["Addressed key aspects of the prompt with relevant technical context."],
      weaknesses: isAdequate ? ["Could include more specific real-world examples."] : ["Answer was too concise; elaborate further with concrete implementation details."],
      suggestedModelAnswer: `A comprehensive answer for '${params.question}' covers core technical trade-offs, system boundaries, and clear reasoning for chosen architectural decisions.`,
      improvementTips: ["Use the STAR method: Situation, Task, Action, Result."],
    };
  }
}

export const interviewAIService = new GeminiInterviewAIService();

