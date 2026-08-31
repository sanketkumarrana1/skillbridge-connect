import type { ApplicationStatus } from "@/types";

/**
 * Valid progressive lifecycle paths:
 * Applied -> Under Review -> Shortlisted -> Interview / Interview Scheduled -> Interview Completed -> Offered -> Selected -> Hired
 * Any non-terminal state -> Rejected
 */
const VALID_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  Applied: ["Under Review", "Shortlisted", "Rejected"],
  "Under Review": ["Shortlisted", "Interview Scheduled", "Interview", "Rejected"],
  Shortlisted: ["Interview Scheduled", "Interview", "Offered", "Rejected"],
  "Interview Scheduled": ["Interview Completed", "Interview", "Offered", "Rejected"],
  Interview: ["Interview Completed", "Interview Scheduled", "Offered", "Selected", "Rejected"],
  "Interview Completed": ["Offered", "Selected", "Shortlisted", "Rejected"],
  Offered: ["Selected", "Hired", "Rejected"],
  Selected: ["Hired", "Offered", "Rejected"],
  Hired: [], // Terminal success state
  Rejected: ["Under Review"], // Allow recruiter reconsiderations
};

export class ApplicationLifecycleService {
  /**
   * Validate if a transition from currentStatus to targetStatus is logically allowed.
   */
  public static canTransition(
    currentStatus: ApplicationStatus,
    targetStatus: ApplicationStatus,
  ): boolean {
    if (currentStatus === targetStatus) return true;
    const allowed = VALID_TRANSITIONS[currentStatus] || [];
    return allowed.includes(targetStatus);
  }

  /**
   * Safe transition handler that validates and returns the resolved status or throws a descriptive error.
   */
  public static transition(
    currentStatus: ApplicationStatus,
    targetStatus: ApplicationStatus,
  ): { success: boolean; status: ApplicationStatus; reason?: string } {
    if (this.canTransition(currentStatus, targetStatus)) {
      return { success: true, status: targetStatus };
    }
    return {
      success: false,
      status: currentStatus,
      reason: `Cannot transition application from "${currentStatus}" to "${targetStatus}".`,
    };
  }

  /**
   * Get all allowed next stages from a given status.
   */
  public static getNextAllowedStages(currentStatus: ApplicationStatus): ApplicationStatus[] {
    return VALID_TRANSITIONS[currentStatus] || [];
  }

  /**
   * Determine if the application status is in an active/reviewable state.
   */
  public static isActive(status: ApplicationStatus): boolean {
    return status !== "Hired" && status !== "Rejected";
  }
}

export const applicationLifecycle = ApplicationLifecycleService;

