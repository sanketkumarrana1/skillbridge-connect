// ==============================================================================
// AcadIn Unit Test Suite: Mentorship Scheduling & Institutional Analytics
// Description: Validates mentor booking conflict detection, availability windows,
//              and institutional placement metrics calculation formulas.
// ==============================================================================

export interface MentorshipSessionFixture {
  id: string;
  mentorId: string;
  studentId: string;
  startTime: Date;
  endTime: Date;
  status: "scheduled" | "completed" | "cancelled";
}

export function detectSessionConflict(
  existingSessions: MentorshipSessionFixture[],
  newMentorId: string,
  newStart: Date,
  newEnd: Date
): { hasConflict: boolean; conflictingSessionId?: string } {
  for (const session of existingSessions) {
    if (session.mentorId !== newMentorId || session.status === "cancelled") {
      continue;
    }
    // Overlap: (StartA < EndB) and (EndA > StartB)
    const isOverlapping = session.startTime < newEnd && session.endTime > newStart;
    if (isOverlapping) {
      return { hasConflict: true, conflictingSessionId: session.id };
    }
  }
  return { hasConflict: false };
}

export function calculateInstitutionPlacementMetrics(data: {
  totalEligibleStudents: number;
  placedStudentsCount: number;
  offersByDepartment: Record<string, number>;
  studentsByDepartment: Record<string, number>;
}): {
  overallPlacementRatePct: number;
  departmentPlacementRates: Record<string, number>;
} {
  const overallPlacementRatePct = data.totalEligibleStudents > 0
    ? Math.round((data.placedStudentsCount / data.totalEligibleStudents) * 1000) / 10
    : 0;

  const departmentPlacementRates: Record<string, number> = {};
  for (const [dept, totalDeptStudents] of Object.entries(data.studentsByDepartment)) {
    const deptOffers = data.offersByDepartment[dept] || 0;
    departmentPlacementRates[dept] = totalDeptStudents > 0
      ? Math.round((deptOffers / totalDeptStudents) * 1000) / 10
      : 0;
  }

  return {
    overallPlacementRatePct,
    departmentPlacementRates,
  };
}

export async function runMentorshipAndAnalyticsTests(): Promise<{ passed: number; failed: number; tests: { name: string; passed: boolean }[] }> {
  const tests: { name: string; passed: boolean }[] = [];
  let passed = 0;

  // Test 1: Mentor Conflict Detection (Overlapping booking detected)
  {
    const existing: MentorshipSessionFixture[] = [
      {
        id: "sess-1",
        mentorId: "mentor-1",
        studentId: "stu-1",
        startTime: new Date("2026-09-01T10:00:00Z"),
        endTime: new Date("2026-09-01T11:00:00Z"),
        status: "scheduled",
      },
    ];
    const newStart = new Date("2026-09-01T10:30:00Z");
    const newEnd = new Date("2026-09-01T11:30:00Z");
    const res = detectSessionConflict(existing, "mentor-1", newStart, newEnd);
    const ok = res.hasConflict && res.conflictingSessionId === "sess-1";
    tests.push({ name: "Mentorship: Overlapping time slot with same mentor triggers conflict rejection", passed: ok });
    if (ok) passed++;
  }

  // Test 2: Non-overlapping Booking Allowed
  {
    const existing: MentorshipSessionFixture[] = [
      {
        id: "sess-1",
        mentorId: "mentor-1",
        studentId: "stu-1",
        startTime: new Date("2026-09-01T10:00:00Z"),
        endTime: new Date("2026-09-01T11:00:00Z"),
        status: "scheduled",
      },
    ];
    const newStart = new Date("2026-09-01T11:00:00Z");
    const newEnd = new Date("2026-09-01T12:00:00Z");
    const res = detectSessionConflict(existing, "mentor-1", newStart, newEnd);
    const ok = !res.hasConflict;
    tests.push({ name: "Mentorship: Consecutive non-overlapping slot is permitted", passed: ok });
    if (ok) passed++;
  }

  // Test 3: Cancelled Session Slot Re-use Allowed
  {
    const existing: MentorshipSessionFixture[] = [
      {
        id: "sess-cancelled",
        mentorId: "mentor-1",
        studentId: "stu-1",
        startTime: new Date("2026-09-01T14:00:00Z"),
        endTime: new Date("2026-09-01T15:00:00Z"),
        status: "cancelled",
      },
    ];
    const newStart = new Date("2026-09-01T14:00:00Z");
    const newEnd = new Date("2026-09-01T15:00:00Z");
    const res = detectSessionConflict(existing, "mentor-1", newStart, newEnd);
    const ok = !res.hasConflict;
    tests.push({ name: "Mentorship: Cancelled session releases slot for new booking", passed: ok });
    if (ok) passed++;
  }

  // Test 4: Institution Placement Analytics Precision
  {
    const metricsData = {
      totalEligibleStudents: 250,
      placedStudentsCount: 215,
      studentsByDepartment: {
        CSE: 120,
        ECE: 80,
        ME: 50,
      } as Record<string, number>,
      offersByDepartment: {
        CSE: 114,
        ECE: 68,
        ME: 33,
      } as Record<string, number>,
    };
    const res = calculateInstitutionPlacementMetrics(metricsData);
    const ok = res.overallPlacementRatePct === 86.0 && res.departmentPlacementRates["CSE"] === 95.0 && res.departmentPlacementRates["ECE"] === 85.0;
    tests.push({ name: "Analytics: Aggregated institutional placement rates computed accurately with 1-decimal precision", passed: ok });
    if (ok) passed++;
  }

  return {
    passed,
    failed: tests.length - passed,
    tests,
  };
}

