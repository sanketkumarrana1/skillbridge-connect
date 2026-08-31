// ==============================================================================
// AcadIn Learning Recommendations AI Service (Gemini + Local Roadmap)
// Description: Curated personalized learning roadmap generation using Gemini AI.
// ==============================================================================

import type { LearningRecommendationResult, ILearningAIService } from "@/services/ai/ai-service-contracts";
import { AIGatewayClient } from "@/services/ai/ai-gateway-client";

export class GeminiLearningAIService implements ILearningAIService {
  async recommendLearningPlan(params: {
    studentId?: string | undefined;
    currentSkills: string[];
    targetRole: string;
  }): Promise<LearningRecommendationResult> {
    try {
      const res = await AIGatewayClient.recommendLearning({
        currentSkills: params.currentSkills,
        targetRole: params.targetRole,
      });

      if (res && Array.isArray(res.milestones) && res.milestones.length > 0) {
        if (params.studentId) {
          void AIGatewayClient.saveLearningRecommendations(
            params.studentId,
            params.targetRole,
            res,
            "gemini",
            "gemini-1.5-flash",
            false,
          );
        }
        return res;
      }
    } catch (err) {
      console.warn("[GeminiLearningAIService] AI learning recommendation fallback:", err);
    }

    // Deterministic fallback
    return {
      milestones: [
        {
          title: `Core Fundamentals for ${params.targetRole}`,
          estimatedWeeks: 2,
          topics: ["Architecture Foundations", "Best Practices", "Unit Testing"],
          projectIdea: `Build a production-grade prototype demonstrating ${params.targetRole} competencies.`,
        },
      ],
    };
  }
}

export const learningAIService = new GeminiLearningAIService();

