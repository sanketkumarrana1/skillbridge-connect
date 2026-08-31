// ==============================================================================
// AcadIn Unit Test Suite: Opportunity Matching & Eligibility Engine
// Description: Validates deterministic skill matching, required vs preferred gaps,
//              academic eligibility rules (degree, CGPA, batch year), and readiness status.
// ==============================================================================

export interface StudentProfileFixture {
  id: string;
  degree: string;
  branch: string;
  graduationYear: number;
  cgpa: number;
  declaredSkills: { name: string; level: "beginner" | "intermediate" | "advanced" }[];
  preferredWorkMode: "remote" | "hybrid" | "onsite" | "any";
}

export interface OpportunityRequirementsFixture {
  id: string;
  title: string;
  workMode: "remote" | "hybrid" | "onsite";
  allowedDegrees: string[];
  allowedBatches: number[];
  minimumCgpa: number;
  requiredSkills: { name: string; weight: number }[];
  preferredSkills: { name: string; weight: number }[];
}

export function computeOpportunityMatchAndEligibility(
  student: StudentProfileFixture,
  opportunity: OpportunityRequirementsFixture
): {
  isEligible: boolean;
  eligibilityReasons: string[];
  skillFitScore: number;
  matchedRequiredSkills: string[];
  missingRequiredSkills: string[];
  matchedPreferredSkills: string[];
  missingPreferredSkills: string[];
  overallMatchScore: number;
  readinessCategory: "ready_to_apply" | "nearly_ready" | "build_skills_first";
} {
  const eligibilityReasons: string[] = [];

  // 1. Degree check
  const degreeMatch = opportunity.allowedDegrees.length === 0 || opportunity.allowedDegrees.includes(student.degree);
  if (!degreeMatch) {
    eligibilityReasons.push(`Degree '${student.degree}' does not meet allowed degrees: [${opportunity.allowedDegrees.join(", ")}]`);
  }

  // 2. Batch check
  const batchMatch = opportunity.allowedBatches.length === 0 || opportunity.allowedBatches.includes(student.graduationYear);
  if (!batchMatch) {
    eligibilityReasons.push(`Graduation year '${student.graduationYear}' not in allowed batches: [${opportunity.allowedBatches.join(", ")}]`);
  }

  // 3. CGPA check
  const cgpaMatch = student.cgpa >= opportunity.minimumCgpa;
  if (!cgpaMatch) {
    eligibilityReasons.push(`CGPA ${student.cgpa} is below the minimum required ${opportunity.minimumCgpa}`);
  }

  const isEligible = degreeMatch && batchMatch && cgpaMatch;

  // 4. Skill Fit
  const studentSkillNames = new Set(student.declaredSkills.map((s) => s.name.toLowerCase()));

  let requiredEarned = 0;
  let requiredPossible = 0;
  const matchedRequiredSkills: string[] = [];
  const missingRequiredSkills: string[] = [];

  for (const req of opportunity.requiredSkills) {
    requiredPossible += req.weight;
    if (studentSkillNames.has(req.name.toLowerCase())) {
      requiredEarned += req.weight;
      matchedRequiredSkills.push(req.name);
    } else {
      missingRequiredSkills.push(req.name);
    }
  }

  let preferredEarned = 0;
  let preferredPossible = 0;
  const matchedPreferredSkills: string[] = [];
  const missingPreferredSkills: string[] = [];

  for (const pref of opportunity.preferredSkills) {
    preferredPossible += pref.weight;
    if (studentSkillNames.has(pref.name.toLowerCase())) {
      preferredEarned += pref.weight;
      matchedPreferredSkills.push(pref.name);
    } else {
      missingPreferredSkills.push(pref.name);
    }
  }

  const reqScore = requiredPossible > 0 ? (requiredEarned / requiredPossible) : 1.0;
  const prefScore = preferredPossible > 0 ? (preferredEarned / preferredPossible) : 1.0;

  // Skill Fit weighted: 75% required + 25% preferred
  const skillFitScore = Math.round((reqScore * 0.75 + prefScore * 0.25) * 100);

  // Overall Match
  const eligibilityMultiplier = isEligible ? 1.0 : 0.6;
  const overallMatchScore = Math.round(skillFitScore * eligibilityMultiplier);

  let readinessCategory: "ready_to_apply" | "nearly_ready" | "build_skills_first" = "ready_to_apply";
  if (!isEligible || overallMatchScore < 50) {
    readinessCategory = "build_skills_first";
  } else if (overallMatchScore < 75 || missingRequiredSkills.length > 0) {
    readinessCategory = "nearly_ready";
  }

  return {
    isEligible,
    eligibilityReasons,
    skillFitScore,
    matchedRequiredSkills,
    missingRequiredSkills,
    matchedPreferredSkills,
    missingPreferredSkills,
    overallMatchScore,
    readinessCategory,
  };
}

export async function runMatchingEngineTests(): Promise<{ passed: number; failed: number; tests: { name: string; passed: boolean }[] }> {
  const tests: { name: string; passed: boolean }[] = [];
  let passed = 0;

  const targetOpp: OpportunityRequirementsFixture = {
    id: "opp-fullstack",
    title: "Full Stack Developer Internship",
    workMode: "hybrid",
    allowedDegrees: ["B.Tech", "MCA"],
    allowedBatches: [2025, 2026],
    minimumCgpa: 7.0,
    requiredSkills: [
      { name: "React", weight: 3 },
      { name: "TypeScript", weight: 3 },
      { name: "Node.js", weight: 2 },
    ],
    preferredSkills: [
      { name: "Docker", weight: 2 },
      { name: "PostgreSQL", weight: 2 },
    ],
  };

  // Test 1: Ideal Match (All required + preferred + eligible)
  {
    const idealStudent: StudentProfileFixture = {
      id: "stu-1",
      degree: "B.Tech",
      branch: "Computer Science",
      graduationYear: 2026,
      cgpa: 8.5,
      declaredSkills: [
        { name: "React", level: "advanced" },
        { name: "TypeScript", level: "advanced" },
        { name: "Node.js", level: "intermediate" },
        { name: "Docker", level: "intermediate" },
        { name: "PostgreSQL", level: "intermediate" },
      ],
      preferredWorkMode: "hybrid",
    };
    const res = computeOpportunityMatchAndEligibility(idealStudent, targetOpp);
    const ok = res.isEligible && res.overallMatchScore === 100 && res.readinessCategory === "ready_to_apply" && res.missingRequiredSkills.length === 0;
    tests.push({ name: "Matching: Perfect skill & academic alignment gives 100% score and ready_to_apply", passed: ok });
    if (ok) passed++;
  }

  // Test 2: Missing 1 Mandatory Skill
  {
    const partialStudent: StudentProfileFixture = {
      id: "stu-2",
      degree: "B.Tech",
      branch: "Information Technology",
      graduationYear: 2026,
      cgpa: 8.0,
      declaredSkills: [
        { name: "React", level: "advanced" },
        { name: "TypeScript", level: "intermediate" },
        // missing Node.js
      ],
      preferredWorkMode: "any",
    };
    const res = computeOpportunityMatchAndEligibility(partialStudent, targetOpp);
    const ok = res.isEligible && res.missingRequiredSkills.includes("Node.js") && res.readinessCategory === "nearly_ready";
    tests.push({ name: "Matching: Missing mandatory skill correctly places candidate in nearly_ready", passed: ok });
    if (ok) passed++;
  }

  // Test 3: Ineligible Degree Fails Eligibility
  {
    const ineligibleDegreeStudent: StudentProfileFixture = {
      id: "stu-3",
      degree: "B.Com",
      branch: "Finance",
      graduationYear: 2026,
      cgpa: 9.0,
      declaredSkills: [
        { name: "React", level: "advanced" },
        { name: "TypeScript", level: "advanced" },
        { name: "Node.js", level: "advanced" },
      ],
      preferredWorkMode: "remote",
    };
    const res = computeOpportunityMatchAndEligibility(ineligibleDegreeStudent, targetOpp);
    const ok = !res.isEligible && res.readinessCategory === "build_skills_first";
    tests.push({ name: "Matching: Ineligible degree triggers eligibility failure and penalty", passed: ok });
    if (ok) passed++;
  }

  // Test 4: CGPA Below Cutoff Fails Eligibility
  {
    const lowCgpaStudent: StudentProfileFixture = {
      id: "stu-4",
      degree: "B.Tech",
      branch: "Mechanical",
      graduationYear: 2025,
      cgpa: 6.4, // cutoff is 7.0
      declaredSkills: [
        { name: "React", level: "intermediate" },
      ],
      preferredWorkMode: "hybrid",
    };
    const res = computeOpportunityMatchAndEligibility(lowCgpaStudent, targetOpp);
    const ok = !res.isEligible && res.eligibilityReasons.some((r) => r.includes("CGPA"));
    tests.push({ name: "Matching: CGPA below threshold records explicit eligibility reason", passed: ok });
    if (ok) passed++;
  }

  return {
    passed,
    failed: tests.length - passed,
    tests,
  };
}

