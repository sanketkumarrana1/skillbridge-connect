// ==============================================================================
// AcadIn Assessment AI Generator (Gemini + Local Question Bank Fallback)
// Description: Dynamic question generation utilizing Gemini with local fallback.
// ==============================================================================

import type { IAssessmentGenerator } from "@/types/ai-boundaries";
import type { MCQAssessmentQuestion } from "@/types";
import { mcqAssessmentQuestions } from "@/data/mock";
import { AIGatewayClient } from "@/services/ai/ai-gateway-client";

export class GeminiAssessmentAIGenerator implements IAssessmentGenerator {
  async generateAdaptiveQuestions(params: {
    domain: string;
    declaredSkills: string[];
    difficulty: "beginner" | "intermediate" | "advanced";
    count?: number | undefined;
  }): Promise<MCQAssessmentQuestion[]> {
    const targetCount = params.count || 6;

    try {
      // 1. Invoke Gemini-backed AI Gateway
      const res = await AIGatewayClient.generateAssessmentQuestions({
        domain: params.domain,
        declaredSkills: params.declaredSkills,
        difficulty: params.difficulty,
        count: targetCount,
      });

      if (res && Array.isArray(res.questions) && res.questions.length > 0) {
        // Validate question structure
        const validQuestions = res.questions.filter(
          (q) => q && q.question && Array.isArray(q.options) && q.options.length >= 2,
        );

        if (validQuestions.length >= targetCount) {
          return validQuestions.slice(0, targetCount);
        } else if (validQuestions.length > 0) {
          // Supplement with curated questions if batch was partial
          const localFallback = this.getLocalFallback(params.declaredSkills, targetCount - validQuestions.length);
          return [...validQuestions, ...localFallback].slice(0, targetCount);
        }
      }
    } catch (err) {
      console.warn("[GeminiAssessmentAIGenerator] AI generation fallback:", err);
    }

    // 2. Deterministic curated bank fallback
    return this.getLocalFallback(params.declaredSkills, targetCount);
  }

  private getLocalFallback(declaredSkills: string[], count: number): MCQAssessmentQuestion[] {
    const declaredLower = (declaredSkills || []).map((s) => s.toLowerCase());

    const matched = (mcqAssessmentQuestions as MCQAssessmentQuestion[]).filter((q) => {
      return declaredLower.some(
        (s) =>
          q.category.toLowerCase().includes(s) ||
          q.question.toLowerCase().includes(s),
      );
    });

    const pool = matched.length >= count ? matched : (mcqAssessmentQuestions as MCQAssessmentQuestion[]);
    return pool.slice(0, count);
  }
}

export const assessmentAIGenerator = new GeminiAssessmentAIGenerator();
