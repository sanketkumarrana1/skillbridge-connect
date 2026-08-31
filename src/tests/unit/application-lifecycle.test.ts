// ==============================================================================
// AcadIn Unit Test Suite: Application State Machine Lifecycle
// Description: Validates all permitted forward transitions, terminal states,
//              and enforces strict rejection of illegal state jumps.
// ==============================================================================

export type AppStatus =
  | "draft"
  | "applied"
  | "under_review"
  | "shortlisted"
  | "interview_scheduled"
  | "interview_completed"
  | "offered"
  | "accepted"
  | "declined"
  | "rejected"
  | "withdrawn";

export const PERMITTED_TRANSITIONS: Record<AppStatus, AppStatus[]> = {
  draft: ["applied", "withdrawn"],
  applied: ["under_review", "shortlisted", "rejected", "withdrawn"],
  under_review: ["shortlisted", "interview_scheduled", "rejected", "withdrawn"],
  shortlisted: ["interview_scheduled", "offered", "rejected", "withdrawn"],
  interview_scheduled: ["interview_completed", "rejected", "withdrawn"],
  interview_completed: ["interview_scheduled", "offered", "rejected", "withdrawn"],
  offered: ["accepted", "declined", "withdrawn"],
  accepted: [], // Terminal success
  declined: [], // Terminal
  rejected: [], // Terminal
  withdrawn: [], // Terminal
};

export function validateStatusTransition(
  current: AppStatus,
  next: AppStatus,
  callerRole: "student" | "recruiter" | "admin"
): { isValid: boolean; reason?: string } {
  // Student can ONLY withdraw their own application
  if (callerRole === "student") {
    if (next === "withdrawn" && current !== "accepted" && current !== "rejected") {
      return { isValid: true };
    }
    if (current === "offered" && (next === "accepted" || next === "declined")) {
      return { isValid: true };
    }
    return { isValid: false, reason: "Students can only withdraw application or respond to issued offers." };
  }

  // Recruiters/Admins follow the state machine
  const allowed = PERMITTED_TRANSITIONS[current] || [];
  if (!allowed.includes(next)) {
    return { isValid: false, reason: `Transition from '${current}' to '${next}' is disallowed by recruitment rules.` };
  }

  return { isValid: true };
}

export async function runApplicationLifecycleTests(): Promise<{ passed: number; failed: number; tests: { name: string; passed: boolean }[] }> {
  const tests: { name: string; passed: boolean }[] = [];
  let passed = 0;

  // Test 1: Full Happy Path (Applied -> Under Review -> Shortlisted -> Interview Scheduled -> Interview Completed -> Offered -> Accepted)
  {
    const steps: [AppStatus, AppStatus][] = [
      ["applied", "under_review"],
      ["under_review", "shortlisted"],
      ["shortlisted", "interview_scheduled"],
      ["interview_scheduled", "interview_completed"],
      ["interview_completed", "offered"],
    ];
    let allValid = true;
    for (const [from, to] of steps) {
      const res = validateStatusTransition(from, to, "recruiter");
      if (!res.isValid) allValid = false;
    }
    // Student accepts offer
    const acceptRes = validateStatusTransition("offered", "accepted", "student");
    if (!acceptRes.isValid) allValid = false;

    tests.push({ name: "Application Lifecycle: Standard 6-stage hiring pipeline passes sequentially", passed: allValid });
    if (allValid) passed++;
  }

  // Test 2: Direct Jump Bypasses Rejected (Applied -> Offered directly)
  {
    const res = validateStatusTransition("applied", "offered", "recruiter");
    const ok = !res.isValid;
    tests.push({ name: "Application Lifecycle: Skipping review/shortlist to Offer is rejected", passed: ok });
    if (ok) passed++;
  }

  // Test 3: Terminal State Re-open Prevention (Rejected -> Interview)
  {
    const res = validateStatusTransition("rejected", "interview_scheduled", "recruiter");
    const ok = !res.isValid;
    tests.push({ name: "Application Lifecycle: Modifying terminal 'rejected' candidate is prohibited", passed: ok });
    if (ok) passed++;
  }

  // Test 4: Withdrawn Candidate Offer Prevention
  {
    const res = validateStatusTransition("withdrawn", "offered", "recruiter");
    const ok = !res.isValid;
    tests.push({ name: "Application Lifecycle: Modifying terminal 'withdrawn' candidate is prohibited", passed: ok });
    if (ok) passed++;
  }

  // Test 5: Student Unauthorized State Change Attempt (Student tries to Shortlist themselves)
  {
    const res = validateStatusTransition("applied", "shortlisted", "student");
    const ok = !res.isValid;
    tests.push({ name: "Application Lifecycle: Student cannot self-shortlist or manipulate hiring status", passed: ok });
    if (ok) passed++;
  }

  return {
    passed,
    failed: tests.length - passed,
    tests,
  };
}

