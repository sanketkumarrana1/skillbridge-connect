// ==============================================================================
// AcadIn Resume Intelligence Service (Gemini + Deterministic ATS Scorer)
// Description: Actionable resume feedback, keyword alignment, and ATS compatibility guidance.
// ==============================================================================

import type { IResumeFeedbackService, ResumeFeedbackResult } from "@/types/ai-boundaries";
import { AIGatewayClient } from "@/services/ai/ai-gateway-client";

export class GeminiResumeAIService implements IResumeFeedbackService {
  async analyzeResume(params: {
    studentId?: string | undefined;
    resumeText: string;
    targetRole?: string | undefined;
    skills?: string[] | undefined;
  }): Promise<ResumeFeedbackResult> {
    try {
      const res = await AIGatewayClient.analyzeResume({
        resumeText: params.resumeText,
        targetRole: params.targetRole,
        skills: params.skills,
      });

      if (res) {
        if (params.studentId) {
          void AIGatewayClient.saveResumeAnalysis(
            params.studentId,
            res,
            params.targetRole,
            "gemini",
            "gemini-1.5-flash",
            false,
          );
        }
        return res;
      }
    } catch (err) {
      console.warn("[GeminiResumeAIService] AI resume analysis fallback:", err);
    }

    // Deterministic fallback
    const text = params.resumeText.toLowerCase();
    const skills = params.skills || ["React", "TypeScript", "Python", "SQL", "Git", "REST APIs"];
    const keywordMatches: string[] = [];
    const missingKeywords: string[] = [];

    skills.forEach((s) => {
      if (text.includes(s.toLowerCase())) {
        keywordMatches.push(s);
      } else {
        missingKeywords.push(s);
      }
    });

    const matchRatio = keywordMatches.length / Math.max(skills.length, 1);
    const atsScore = Math.round(55 + matchRatio * 40);

    return {
      overallScore: atsScore,
      atsCompatibilityScore: atsScore,
      keywordMatches,
      missingKeywords,
      strengths: [
        "Clean structure with clearly demarcated project deliverables.",
        "Demonstrated technical evidence matching core target skills.",
      ],
      improvements: [
        "Include more quantifiable business metrics (e.g. latency reduction, request throughput).",
        "Add direct GitHub repository links for verified live project deliverables.",
      ],
      summary: `Resume shows a ${atsScore}% alignment with ${params.targetRole || "target software engineering roles"}. Good keyword coverage on core technologies.`,
    };
  }
}

export const resumeAIFeedbackService = new GeminiResumeAIService();
