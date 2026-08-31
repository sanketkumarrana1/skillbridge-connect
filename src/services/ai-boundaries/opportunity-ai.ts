// ==============================================================================
// AcadIn Opportunity Intelligence Service (Gemini + Deterministic Authority)
// Description: Enrich opportunity matching with qualitative fit explanations and "Should I Apply?" guidance.
// ==============================================================================

import type { IOpportunityIntelligenceService } from "@/types/ai-boundaries";
import type { OpportunityExplanationResult } from "@/services/ai/ai-service-contracts";
import { AIGatewayClient } from "@/services/ai/ai-gateway-client";

export class GeminiOpportunityAIService implements IOpportunityIntelligenceService {
  async explainOpportunityFit(params: {
    studentId?: string | undefined;
    opportunityId: string;
    opportunityTitle: string;
    candidateSkills: string[];
    requiredSkills: string[];
  }): Promise<OpportunityExplanationResult> {
    // 1. Deterministic baseline computation
    const candidateLower = (params.candidateSkills || []).map((s) => s.toLowerCase());
    const matched = (params.requiredSkills || []).filter((s) => candidateLower.includes(s.toLowerCase()));
    const missing = (params.requiredSkills || []).filter((s) => !candidateLower.includes(s.toLowerCase()));
    const matchRatio = params.requiredSkills.length > 0 ? matched.length / params.requiredSkills.length : 1;
    const matchPct = Math.round(matchRatio * 100);

    let category: "ready_to_apply" | "nearly_ready" | "build_skills_first" = "ready_to_apply";
    if (matchPct < 50) {
      category = "build_skills_first";
    } else if (matchPct < 80) {
      category = "nearly_ready";
    }

    // 2. Invoke Gemini AI Gateway for qualitative reasoning
    try {
      const res = await AIGatewayClient.explainOpportunityMatch({
        opportunityId: params.opportunityId,
        opportunityTitle: params.opportunityTitle,
        candidateSkills: params.candidateSkills,
        requiredSkills: params.requiredSkills,
      });

      if (res) {
        if (params.studentId) {
          void AIGatewayClient.saveOpportunityExplanation(
            params.studentId,
            params.opportunityId,
            res,
            "gemini",
            "gemini-1.5-flash",
            false,
          );
        }
        return res;
      }
    } catch (err) {
      console.warn("[GeminiOpportunityAIService] AI explanation fallback:", err);
    }

    // 3. Deterministic Fallback Result
    return {
      overallMatchPercentage: matchPct,
      category,
      whyYouMatch: matched.map((s) => `Demonstrates competency in required skill: ${s}`),
      missingRequirements: missing.map((s) => `Missing demonstrated evidence for: ${s}`),
      recommendedActions: missing.map((s) => `Complete learning milestones and project deliverables for ${s}`),
      applicationAdvice: category === "ready_to_apply"
        ? "You have strong alignment with this role. Highlight your verified project deliverables when applying."
        : "Consider addressing top skill gaps through the Learning Roadmap before submitting your application.",
    };
  }
}

export const opportunityAIService = new GeminiOpportunityAIService();

