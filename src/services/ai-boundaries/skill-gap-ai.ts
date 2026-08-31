// ==============================================================================
// AcadIn Skill Gap AI Diagnostic Service (Gemini + Deterministic Authority)
// Description: Combines quantitative readiness calculations with Gemini qualitative interpretation.
// ==============================================================================

import type { ISkillGapService } from "@/types/ai-boundaries";
import type { StudentProfile, SkillGapDetail } from "@/types";
import { readinessEngine } from "@/services/readiness/readiness-engine";
import { AIGatewayClient } from "@/services/ai/ai-gateway-client";

export class GeminiSkillGapAIService implements ISkillGapService {
  async diagnoseGaps(params: {
    profile: StudentProfile;
    targetRoleTitle: string;
  }): Promise<SkillGapDetail[]> {
    // 1. Authoritative deterministic baseline calculation
    const analyses = readinessEngine.analyzeTargetRoles(
      params.profile,
      params.profile.declaredSkills || [],
      params.profile.assessmentAttempts?.[0] || null,
    );

    const deterministicGaps = readinessEngine.extractSkillGaps(
      analyses,
      params.profile.declaredSkills || [],
      params.profile.assessmentAttempts?.[0] || null,
    );

    // 2. Asynchronously enrich & cache with Gemini
    void (async () => {
      try {
        const aiAnalysis = await AIGatewayClient.analyzeSkills({
          profile: {
            id: params.profile.id,
            name: params.profile.name,
            education: params.profile.education,
          },
          targetRoleTitle: params.targetRoleTitle,
        });

        if (aiAnalysis && params.profile.id) {
          await AIGatewayClient.saveSkillGapResult(
            params.profile.id,
            params.targetRoleTitle,
            aiAnalysis,
            params.profile.assessmentAttempts?.[0]?.id,
            "gemini",
            "gemini-1.5-flash",
            false,
          );
        }
      } catch (err) {
        console.warn("[GeminiSkillGapAIService] Non-blocking AI analysis fallback:", err);
      }
    })();

    return deterministicGaps;
  }
}

export const skillGapAIService = new GeminiSkillGapAIService();
