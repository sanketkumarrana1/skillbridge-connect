// ==============================================================================
// AcadIn AI Feedback & Quality Monitoring Service
// Description: User feedback capturing and admin aggregate telemetry monitoring.
// ==============================================================================

import type { IAIFeedbackService } from "@/types/ai-boundaries";
import type { AIUserFeedbackPayload, AdminAITelemetryResult } from "@/services/ai/ai-service-contracts";
import { AIGatewayClient } from "@/services/ai/ai-gateway-client";

export class GeminiAIFeedbackService implements IAIFeedbackService {
  async submitFeedback(feedback: AIUserFeedbackPayload & { userId: string }): Promise<boolean> {
    return AIGatewayClient.submitUserFeedback(feedback);
  }

  async getTelemetry(): Promise<AdminAITelemetryResult | null> {
    return AIGatewayClient.getAdminTelemetry();
  }
}

export const aiFeedbackService = new GeminiAIFeedbackService();

