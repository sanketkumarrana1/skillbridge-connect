// ==============================================================================
// AcadIn Career Advisory AI Service (Gemini + Deterministic Authority)
// Description: Enrich career pathway recommendations with Gemini qualitative insights.
// ==============================================================================

import type { ICareerRecommendationService } from "@/types/ai-boundaries";
import type { StudentProfile, TargetRoleAnalysis } from "@/types";
import { readinessEngine } from "@/services/readiness/readiness-engine";
import { AIGatewayClient } from "@/services/ai/ai-gateway-client";

export class GeminiCareerAIService implements ICareerRecommendationService {
  async recommendCareerPaths(params: {
    profile: StudentProfile;
    targetRoles?: string[] | undefined;
  }): Promise<TargetRoleAnalysis[]> {
    // 1. Authoritative quantitative baseline
    const deterministicAnalyses = readinessEngine.analyzeTargetRoles(
      params.profile,
      params.profile.declaredSkills || [],
      params.profile.assessmentAttempts?.[0] || null,
    );

    // 2. Asynchronously request & cache Gemini recommendations
    void (async () => {
      try {
        const aiRecs = await AIGatewayClient.recommendCareers({
          profile: {
            id: params.profile.id,
            name: params.profile.name,
            education: params.profile.education,
          },
          targetRoles: params.targetRoles,
        });

        if (aiRecs && params.profile.id) {
          await AIGatewayClient.saveCareerRecommendations(
            params.profile.id,
            aiRecs,
            "gemini",
            "gemini-1.5-flash",
            false,
          );
        }
      } catch (err) {
        console.warn("[GeminiCareerAIService] Non-blocking AI recommendation fallback:", err);
      }
    })();

    return deterministicAnalyses;
  }
}

export const careerAIService = new GeminiCareerAIService();
