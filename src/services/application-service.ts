import { supabase } from "@/lib/supabase";
import type { ApplicationSnapshot, ApplicationStatus } from "@/types";
import type { ApplicationTimelineEvent } from "@/repositories/types";

export interface ScheduleInterviewParams {
  roundName: string;
  interviewType: "Technical" | "Behavioral" | "System Design" | "HR" | "Leadership";
  scheduledStart: string;
  scheduledEnd: string;
  timezone?: string;
  mode?: "Google Meet" | "Zoom" | "In-Person" | "Phone";
  meetingUrl?: string;
  interviewerName?: string;
  interviewerId?: string;
  instructions?: string;
  internalNotes?: string;
}

export interface SubmitFeedbackParams {
  interviewerId: string;
  technicalScore?: number;
  problemSolvingScore?: number;
  communicationScore?: number;
  teamworkScore?: number;
  roleFitScore?: number;
  overallRating?: number;
  strengths?: string;
  concerns?: string;
  recommendation: "strong_hire" | "hire" | "hold" | "no_hire";
  notes?: string;
}

export interface CreateOfferParams {
  positionTitle: string;
  joiningDate: string;
  compensationFormatted: string;
  workMode?: string;
  location: string;
  termsAndConditions?: string;
  expiresAt?: string;
}

export class ApplicationService {
  /**
   * Submit an application for an opportunity via Supabase RPC
   */
  public static async submitApplication(
    studentId: string,
    opportunityId: string,
    answers: Record<string, any> = {}
  ): Promise<{ success: boolean; applicationId?: string; matchScore?: number; error?: string }> {
    try {
      const { data, error } = await supabase.rpc("submit_application", {
        p_student_id: studentId,
        p_opportunity_id: opportunityId,
        p_answers: answers as any,
      });

      if (error) {
        console.warn("[ApplicationService.submitApplication] RPC error:", error.message);
        return { success: false, error: error.message };
      }

      const res = data as any;
      if (res && res.success === false) {
        return { success: false, error: res.error || "Application submission rejected." };
      }

      return {
        success: true,
        applicationId: res?.application_id,
        matchScore: res?.match_score,
      };
    } catch (err: any) {
      console.warn("[ApplicationService.submitApplication] Exception:", err);
      return { success: false, error: err.message || "Failed to submit application." };
    }
  }

  /**
   * Transition application status via server-enforced state machine
   */
  public static async transitionStatus(
    applicationId: string,
    toStatus: ApplicationStatus,
    reason?: string,
    metadata?: Record<string, any>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const dbStatus = this.mapAppStatusToDbStatus(toStatus);
      const { data, error } = await supabase.rpc("transition_application_status", {
        p_application_id: applicationId,
        p_to_status: dbStatus,
        p_reason: reason || null,
        p_metadata: metadata ? (metadata as any) : null,
      });

      if (error) {
        console.warn("[ApplicationService.transitionStatus] RPC error:", error.message);
        return { success: false, error: error.message };
      }

      const res = data as any;
      if (res && res.success === false) {
        return { success: false, error: res.error || "Status transition rejected by server." };
      }

      return { success: true };
    } catch (err: any) {
      console.warn("[ApplicationService.transitionStatus] Exception:", err);
      return { success: false, error: err.message || "Failed to transition status." };
    }
  }

  /**
   * Withdraw an application
   */
  public static async withdrawApplication(
    applicationId: string,
    reason?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.rpc("withdraw_application", {
        p_application_id: applicationId,
        p_reason: reason || null,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      const res = data as any;
      return { success: res?.success ?? true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to withdraw application." };
    }
  }

  /**
   * Schedule an interview
   */
  public static async scheduleInterview(
    applicationId: string,
    params: ScheduleInterviewParams
  ): Promise<{ success: boolean; interviewId?: string; error?: string }> {
    try {
      const payload = {
        round_name: params.roundName,
        interview_type: params.interviewType.toLowerCase(),
        scheduled_start: params.scheduledStart,
        scheduled_end: params.scheduledEnd,
        timezone: params.timezone || "Asia/Kolkata",
        mode: params.mode || "Google Meet",
        meeting_url: params.meetingUrl || null,
        interviewer_name: params.interviewerName || null,
        interviewer_id: params.interviewerId || null,
        instructions: params.instructions || null,
        internal_notes: params.internalNotes || null,
      };

      const { data, error } = await supabase.rpc("schedule_interview", {
        p_application_id: applicationId,
        p_data: payload as any,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      const res = data as any;
      return { success: res?.success ?? true, interviewId: res?.interview_id };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to schedule interview." };
    }
  }

  /**
   * Submit recruiter feedback for an interview
   */
  public static async submitInterviewFeedback(
    interviewId: string,
    params: SubmitFeedbackParams
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const payload = {
        interviewer_id: params.interviewerId,
        technical_score: params.technicalScore,
        problem_solving_score: params.problemSolvingScore,
        communication_score: params.communicationScore,
        teamwork_score: params.teamworkScore,
        role_fit_score: params.roleFitScore,
        overall_rating: params.overallRating,
        strengths: params.strengths || null,
        concerns: params.concerns || null,
        recommendation: params.recommendation,
        notes: params.notes || null,
      };

      const { data, error } = await supabase.rpc("submit_interview_feedback", {
        p_interview_id: interviewId,
        p_data: payload as any,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      const res = data as any;
      return { success: res?.success ?? true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to submit feedback." };
    }
  }

  /**
   * Create and issue a formal corporate offer
   */
  public static async createAndSendOffer(
    applicationId: string,
    params: CreateOfferParams
  ): Promise<{ success: boolean; offerId?: string; error?: string }> {
    try {
      const payload = {
        position_title: params.positionTitle,
        joining_date: params.joiningDate,
        compensation_formatted: params.compensationFormatted,
        work_mode: params.workMode || "Hybrid",
        location: params.location,
        terms_and_conditions: params.termsAndConditions || null,
        expires_at: params.expiresAt || null,
      };

      const { data, error } = await supabase.rpc("create_and_send_offer", {
        p_application_id: applicationId,
        p_data: payload as any,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      const res = data as any;
      return { success: res?.success ?? true, offerId: res?.offer_id };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to issue offer." };
    }
  }

  /**
   * Student response to corporate offer
   */
  public static async respondToOffer(
    offerId: string,
    response: "accepted" | "declined",
    reason?: string
  ): Promise<{ success: boolean; placementId?: string; error?: string }> {
    try {
      const { data, error } = await supabase.rpc("respond_to_offer", {
        p_offer_id: offerId,
        p_response: response,
        p_reason: reason || null,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      const res = data as any;
      return {
        success: res?.success ?? true,
        placementId: res?.placement_id,
      };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to respond to offer." };
    }
  }

  /**
   * Get placement audit timeline
   */
  public static async getPlacementTimeline(applicationId: string): Promise<ApplicationTimelineEvent[]> {
    try {
      const { data, error } = await supabase.rpc("get_placement_timeline", {
        p_application_id: applicationId,
      });

      if (error) {
        console.warn("[ApplicationService.getPlacementTimeline] Failed:", error.message);
        return [];
      }

      return Array.isArray(data) ? (data as unknown as ApplicationTimelineEvent[]) : [];
    } catch (err) {
      console.warn("[ApplicationService.getPlacementTimeline] Error:", err);
      return [];
    }
  }

  /**
   * Get student's submitted applications
   */
  public static async getStudentApplications(studentId: string): Promise<ApplicationSnapshot[]> {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select(`
          *,
          application_match_snapshots (*),
          opportunities (
            id,
            title,
            type,
            company_name,
            company_logo_hue,
            compensation_formatted,
            location
          )
        `)
        .eq("student_id", studentId)
        .order("created_at", { ascending: false });

      if (error || !data) {
        return [];
      }

      return data.map((row: any) => this.mapDatabaseRowToSnapshot(row));
    } catch (err) {
      console.warn("[ApplicationService.getStudentApplications] Error:", err);
      return [];
    }
  }

  /**
   * Get recruiter/company candidate applications for an opportunity
   */
  public static async getOpportunityApplications(opportunityId: string): Promise<ApplicationSnapshot[]> {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select(`
          *,
          application_match_snapshots (*),
          profiles (
            id,
            full_name,
            email,
            avatar_url
          ),
          opportunities (
            id,
            title,
            type,
            company_name,
            company_logo_hue,
            compensation_formatted
          )
        `)
        .eq("opportunity_id", opportunityId)
        .order("created_at", { ascending: false });

      if (error || !data) {
        return [];
      }

      return data.map((row: any) => this.mapDatabaseRowToSnapshot(row));
    } catch (err) {
      console.warn("[ApplicationService.getOpportunityApplications] Error:", err);
      return [];
    }
  }

  /**
   * Get all applications
   */
  public static async getAllApplications(): Promise<ApplicationSnapshot[]> {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select(`
          *,
          application_match_snapshots (*),
          profiles (
            id,
            full_name,
            email,
            avatar_url
          ),
          opportunities (
            id,
            title,
            type,
            company_name,
            company_logo_hue,
            compensation_formatted
          )
        `)
        .order("created_at", { ascending: false });

      if (error || !data) {
        return [];
      }

      return data.map((row: any) => this.mapDatabaseRowToSnapshot(row));
    } catch (err) {
      console.warn("[ApplicationService.getAllApplications] Error:", err);
      return [];
    }
  }

  /**
   * Get single application by ID
   */
  public static async getApplicationById(applicationId: string): Promise<ApplicationSnapshot | null> {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select(`
          *,
          application_match_snapshots (*),
          profiles (
            id,
            full_name,
            email,
            avatar_url
          ),
          opportunities (
            id,
            title,
            type,
            company_name,
            company_logo_hue,
            compensation_formatted
          )
        `)
        .eq("id", applicationId)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return this.mapDatabaseRowToSnapshot(data);
    } catch (err) {
      console.warn("[ApplicationService.getApplicationById] Error:", err);
      return null;
    }
  }

  /**
   * Status conversion helpers
   */
  public static mapAppStatusToDbStatus(status: ApplicationStatus): string {
    switch (status) {
      case "Shortlisted":
        return "shortlisted";
      case "Interview":
      case "Interview Scheduled":
      case "Interview Completed":
        return "interview";
      case "Offered":
        return "offer";
      case "Selected":
      case "Hired":
        return "hired";
      case "Rejected":
        return "rejected";
      case "Under Review":
        return "under_review";
      default:
        return "applied";
    }
  }

  public static mapDbStatusToAppStatus(dbStatus?: string): ApplicationStatus {
    switch (dbStatus?.toLowerCase()) {
      case "shortlisted":
        return "Shortlisted";
      case "interview":
        return "Interview Scheduled";
      case "offer":
        return "Offered";
      case "hired":
        return "Hired";
      case "rejected":
        return "Rejected";
      case "under_review":
        return "Under Review";
      default:
        return "Applied";
    }
  }

  /**
   * Map joined database row to frontend ApplicationSnapshot
   */
  public static mapDatabaseRowToSnapshot(row: any): ApplicationSnapshot {
    const snap = row.application_match_snapshots?.[0] || row.application_match_snapshots || {};
    const prof = snap.profile_snapshot || {};
    const opp = row.opportunities || {};
    const userProf = row.profiles || {};

    const overallMatch = Number(snap.overall_match ?? row.match_score ?? 85);
    const status = this.mapDbStatusToAppStatus(row.status);

    const mapOppType = (t?: string): any => {
      switch (t?.toLowerCase()) {
        case "job":
          return "Job";
        case "live_project":
          return "Live Project";
        case "apprenticeship":
          return "Apprenticeship";
        case "training":
          return "Training Program";
        default:
          return "Internship";
      }
    };

    return {
      id: row.id,
      studentId: row.student_id,
      opportunityId: row.opportunity_id,
      opportunityTitle: opp.title || "Software Engineering Role",
      opportunityType: mapOppType(opp.type),
      company: opp.company_name || "Company",
      companyLogoHue: opp.company_logo_hue || 220,
      submittedAt: row.submitted_at || row.created_at,
      status,
      matchScore: overallMatch,
      skillFit: Number(snap.skill_fit ?? 80),
      eligibilityFit: Number(snap.eligibility_fit ?? 100),
      readinessScore: Number(snap.readiness_fit ?? 80),
      salaryOrStipend: opp.compensation_formatted || "₹35,000 / mo",
      answers: row.answers || {},
      nextStep:
        status === "Applied"
          ? "Awaiting recruiter portfolio screening"
          : status === "Shortlisted"
            ? "Shortlisted for technical evaluation"
            : status === "Interview Scheduled"
              ? "Technical Interview Scheduled"
              : status === "Offered"
                ? "Offer letter extended"
                : status === "Hired"
                  ? "🎉 Placed & Verified"
                  : "Application closed",
      snapshotProfile: {
        name: prof.name || userProf.full_name || "Candidate",
        email: prof.email || userProf.email,
        degree: prof.degree || "B.Tech",
        branch: prof.program || "Computer Science and Engineering",
        college: prof.institution || "National Institute of Technology",
        graduationYear: String(prof.graduation_year || "2026"),
        cgpa: String(prof.grade || "8.5"),
        skillsCount: Array.isArray(snap.matching_skills) ? snap.matching_skills.length : 4,
        assessedSkillsCount: 2,
        projectsCount: 2,
        certificationsCount: 1,
        careerReadinessScore: Number(snap.readiness_fit ?? 80),
      },
    };
  }
}
