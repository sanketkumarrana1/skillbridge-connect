import type { IApplicationRepository, ApplicationTimelineEvent } from "./types";
import type { ApplicationSnapshot, ApplicationStatus } from "@/types";
import { isSupabaseConfigured } from "@/lib/supabase";
import { ApplicationService } from "@/services/application-service";

export class MockApplicationRepository implements IApplicationRepository {
  private applications: ApplicationSnapshot[] = [];
  private timelines: Map<string, ApplicationTimelineEvent[]> = new Map();

  async getAll(): Promise<ApplicationSnapshot[]> {
    return [...this.applications];
  }

  async getById(id: string): Promise<ApplicationSnapshot | null> {
    const found = this.applications.find((a) => a.id === id);
    return found ? { ...found } : null;
  }

  async getByStudentId(studentId: string): Promise<ApplicationSnapshot[]> {
    return this.applications.filter((a) => a.studentId === studentId);
  }

  async getByOpportunityId(opportunityId: string): Promise<ApplicationSnapshot[]> {
    return this.applications.filter((a) => a.opportunityId === opportunityId);
  }

  async submit(
    application: Omit<ApplicationSnapshot, "id" | "submittedAt">,
    _answers?: Record<string, any>,
  ): Promise<ApplicationSnapshot> {
    const newApp: ApplicationSnapshot = {
      ...application,
      id: `app-snap-${application.opportunityId}-${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };
    this.applications.unshift(newApp);

    // Seed initial timeline event
    this.timelines.set(newApp.id, [
      {
        id: `tl-${Date.now()}`,
        from_status: null,
        to_status: "Applied",
        changed_at: new Date().toISOString(),
        reason: "Application submitted by student.",
      },
    ]);

    return { ...newApp };
  }

  async updateStatus(
    id: string,
    status: ApplicationStatus,
    reason?: string,
    metadata?: Record<string, any>,
  ): Promise<ApplicationSnapshot | null> {
    const index = this.applications.findIndex((a) => a.id === id);
    if (index === -1) return null;

    const oldStatus = this.applications[index]!.status;
    this.applications[index] = { ...this.applications[index]!, status };

    const currTimeline = this.timelines.get(id) || [];
    currTimeline.push({
      id: `tl-${Date.now()}`,
      from_status: oldStatus,
      to_status: status,
      changed_at: new Date().toISOString(),
      reason: reason || "Status updated by recruiter.",
      metadata,
    });
    this.timelines.set(id, currTimeline);

    return { ...this.applications[index]! };
  }

  async withdraw(id: string, reason?: string): Promise<boolean> {
    const res = await this.updateStatus(id, "Rejected", reason || "Withdrawn by candidate.");
    return res !== null;
  }

  async scheduleInterview(applicationId: string, interviewData: any): Promise<any> {
    await this.updateStatus(applicationId, "Interview Scheduled", "Interview scheduled.", interviewData);
    return { success: true, interviewId: `intv-${Date.now()}` };
  }

  async submitFeedback(interviewId: string, feedbackData: any): Promise<any> {
    return { success: true, interviewId, feedback: feedbackData };
  }

  async createOffer(applicationId: string, offerData: any): Promise<any> {
    await this.updateStatus(applicationId, "Offered", "Formal offer letter issued.", offerData);
    return { success: true, offerId: `offer-${Date.now()}` };
  }

  async respondToOffer(offerId: string, response: "accepted" | "declined"): Promise<any> {
    return { success: true, offerId, response };
  }

  async getTimeline(applicationId: string): Promise<ApplicationTimelineEvent[]> {
    return this.timelines.get(applicationId) || [
      {
        id: `tl-default`,
        from_status: null,
        to_status: "Applied",
        changed_at: new Date().toISOString(),
        reason: "Application submitted.",
      },
    ];
  }
}

export class SupabaseApplicationRepository implements IApplicationRepository {
  private mockFallback = new MockApplicationRepository();

  async getAll(): Promise<ApplicationSnapshot[]> {
    if (!isSupabaseConfigured) {
      return this.mockFallback.getAll();
    }
    const apps = await ApplicationService.getAllApplications();
    if (apps.length === 0) {
      return this.mockFallback.getAll();
    }
    return apps;
  }

  async getById(id: string): Promise<ApplicationSnapshot | null> {
    if (!isSupabaseConfigured || id.startsWith("app-snap-") || id.startsWith("app-")) {
      return this.mockFallback.getById(id);
    }
    const all = await this.getAll();
    return all.find((a) => a.id === id) || this.mockFallback.getById(id);
  }

  async getByStudentId(studentId: string): Promise<ApplicationSnapshot[]> {
    if (!isSupabaseConfigured || !studentId) {
      return this.mockFallback.getByStudentId(studentId);
    }
    const apps = await ApplicationService.getStudentApplications(studentId);
    return apps.length > 0 ? apps : this.mockFallback.getByStudentId(studentId);
  }

  async getByOpportunityId(opportunityId: string): Promise<ApplicationSnapshot[]> {
    if (!isSupabaseConfigured || !opportunityId || opportunityId.startsWith("opp-")) {
      return this.mockFallback.getByOpportunityId(opportunityId);
    }
    return ApplicationService.getOpportunityApplications(opportunityId);
  }

  async submit(
    application: Omit<ApplicationSnapshot, "id" | "submittedAt">,
    answers?: Record<string, any>,
  ): Promise<ApplicationSnapshot> {
    if (!isSupabaseConfigured || application.opportunityId.startsWith("opp-")) {
      return this.mockFallback.submit(application, answers);
    }

    try {
      const res = await ApplicationService.submitApplication(
        application.studentId,
        application.opportunityId,
        answers || {},
      );

      if (res && res.success) {
        return {
          ...application,
          id: res.applicationId || `app-${Date.now()}`,
          submittedAt: new Date().toISOString(),
          status: "Applied",
          matchScore: res.matchScore || application.matchScore,
        };
      }
    } catch (err) {
      console.warn("[SupabaseApplicationRepository.submit] Falling back to mock:", err);
    }
    return this.mockFallback.submit(application, answers);
  }

  async updateStatus(
    id: string,
    status: ApplicationStatus,
    reason?: string,
    metadata?: Record<string, any>,
  ): Promise<ApplicationSnapshot | null> {
    if (!isSupabaseConfigured || id.startsWith("app-snap-") || id.startsWith("app-")) {
      return this.mockFallback.updateStatus(id, status, reason, metadata);
    }

    const res = await ApplicationService.transitionStatus(id, status, reason, metadata);
    if (!res.success) {
      return this.mockFallback.updateStatus(id, status, reason, metadata);
    }

    return this.getById(id);
  }

  async withdraw(id: string, reason?: string): Promise<boolean> {
    if (!isSupabaseConfigured || id.startsWith("app-snap-") || id.startsWith("app-")) {
      return this.mockFallback.withdraw(id, reason);
    }
    const res = await ApplicationService.withdrawApplication(id, reason);
    return res.success;
  }

  async scheduleInterview(applicationId: string, interviewData: any): Promise<any> {
    if (!isSupabaseConfigured || applicationId.startsWith("app-snap-") || applicationId.startsWith("app-")) {
      return this.mockFallback.scheduleInterview(applicationId, interviewData);
    }
    return ApplicationService.scheduleInterview(applicationId, interviewData);
  }

  async submitFeedback(interviewId: string, feedbackData: any): Promise<any> {
    if (!isSupabaseConfigured || interviewId.startsWith("intv-")) {
      return this.mockFallback.submitFeedback(interviewId, feedbackData);
    }
    return ApplicationService.submitInterviewFeedback(interviewId, feedbackData);
  }

  async createOffer(applicationId: string, offerData: any): Promise<any> {
    if (!isSupabaseConfigured || applicationId.startsWith("app-snap-") || applicationId.startsWith("app-")) {
      return this.mockFallback.createOffer(applicationId, offerData);
    }
    return ApplicationService.createAndSendOffer(applicationId, offerData);
  }

  async respondToOffer(offerId: string, response: "accepted" | "declined"): Promise<any> {
    if (!isSupabaseConfigured || offerId.startsWith("offer-")) {
      return this.mockFallback.respondToOffer(offerId, response);
    }
    return ApplicationService.respondToOffer(offerId, response);
  }

  async getTimeline(applicationId: string): Promise<ApplicationTimelineEvent[]> {
    if (!isSupabaseConfigured || applicationId.startsWith("app-snap-") || applicationId.startsWith("app-")) {
      return this.mockFallback.getTimeline(applicationId);
    }
    const timeline = await ApplicationService.getPlacementTimeline(applicationId);
    return timeline.length > 0 ? timeline : this.mockFallback.getTimeline(applicationId);
  }
}

export const mockApplicationRepository = new MockApplicationRepository();
export const applicationRepository = new SupabaseApplicationRepository();
