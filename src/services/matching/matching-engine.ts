import type { DeclaredSkill, SkillProficiency, StudentProfile } from "@/types";
import type { CareerReadinessScore } from "@/types/career-readiness";
import type {
  EligibilityCheckResult,
  Opportunity,
  OpportunityMatchCategory,
  OpportunityMatchResult,
} from "@/types/opportunity";

export class OpportunityMatchingEngine {
  /**
   * Evaluates hard and soft eligibility criteria for a student against an opportunity.
   */
  checkEligibility(
    student: StudentProfile,
    opportunity: Opportunity,
  ): EligibilityCheckResult {
    const passedCriteria: string[] = [];
    const disqualifyingCriteria: string[] = [];
    const notes: string[] = [];

    const studentDegree = (
      student.academicProfile?.degree ||
      student.degree ||
      ""
    ).toLowerCase();
    const studentBranch = (
      student.academicProfile?.program ||
      student.academicProfile?.department ||
      student.branch ||
      ""
    ).toLowerCase();
    const studentGradYear = String(
      student.academicProfile?.graduationYear ||
        student.academicProfile?.currentYear ||
        student.year ||
        "",
    );
    const studentCgpa = parseFloat(
      String(student.academicProfile?.grade || "8.5"),
    );

    const elig = opportunity.eligibility;

    // 1. Degree Check
    if (elig.degreeRequirements && elig.degreeRequirements.length > 0) {
      const isDegreeAny = elig.degreeRequirements.some(
        (d) => d.toLowerCase() === "any" || d.toLowerCase() === "all",
      );
      const degreeMatches =
        isDegreeAny ||
        elig.degreeRequirements.some((reqDegree) => {
          const req = reqDegree.toLowerCase().replace(/[^a-z0-9]/g, "");
          const actual = studentDegree.replace(/[^a-z0-9]/g, "");
          return actual.includes(req) || req.includes(actual);
        });

      if (degreeMatches) {
        passedCriteria.push(
          `Degree Requirement Met (${elig.degreeRequirements.join(", ")})`,
        );
      } else {
        disqualifyingCriteria.push(
          `Degree Mismatch: Opportunity requires ${elig.degreeRequirements.join(", ")}; profile indicates ${student.academicProfile?.degree || student.degree || "Other"}.`,
        );
      }
    } else {
      passedCriteria.push("Degree: Open to all majors");
    }

    // 2. Department / Discipline Check
    if (elig.departmentRequirements && elig.departmentRequirements.length > 0) {
      const isDeptAny = elig.departmentRequirements.some(
        (d) => d.toLowerCase() === "any" || d.toLowerCase() === "all",
      );
      const deptMatches =
        isDeptAny ||
        elig.departmentRequirements.some((reqDept) => {
          const req = reqDept.toLowerCase();
          return (
            studentBranch.includes(req) ||
            req.includes(studentBranch) ||
            (req.includes("computer") && studentBranch.includes("cse")) ||
            (req.includes("it") && studentBranch.includes("information"))
          );
        });

      if (deptMatches) {
        passedCriteria.push(
          `Discipline Requirement Met (${elig.departmentRequirements.join(", ")})`,
        );
      } else {
        disqualifyingCriteria.push(
          `Department Requirement: Requires ${elig.departmentRequirements.join(", ")}.`,
        );
      }
    } else {
      passedCriteria.push("Department: Open to all disciplines");
    }

    // 3. Graduation Year Check
    if (elig.graduationRequirements && elig.graduationRequirements.length > 0) {
      const isGradAny = elig.graduationRequirements.some(
        (g) => g.toLowerCase() === "any" || g.toLowerCase() === "all",
      );
      const gradMatches =
        isGradAny ||
        elig.graduationRequirements.some((reqGrad) =>
          studentGradYear.includes(reqGrad),
        );

      if (gradMatches) {
        passedCriteria.push(
          `Graduation Batch Met (${elig.graduationRequirements.join(", ")})`,
        );
      } else {
        disqualifyingCriteria.push(
          `Batch Mismatch: Targeted at ${elig.graduationRequirements.join(", ")} batch.`,
        );
      }
    } else {
      passedCriteria.push("Graduation Year: Open to all batches");
    }

    // 4. CGPA Check
    if (elig.minCgpa !== undefined && elig.minCgpa > 0) {
      if (studentCgpa >= elig.minCgpa) {
        passedCriteria.push(`Minimum CGPA Met (≥ ${elig.minCgpa})`);
      } else if (studentCgpa > 0) {
        disqualifyingCriteria.push(
          `CGPA Requirement: Requires min ${elig.minCgpa} CGPA (Profile: ${studentCgpa}).`,
        );
      } else {
        notes.push(`Requires minimum CGPA of ${elig.minCgpa}.`);
      }
    }

    // 5. Mandatory Critical Skills Check
    if (elig.mandatorySkills && elig.mandatorySkills.length > 0) {
      const declaredMap = new Set(
        (student.declaredSkills ?? []).map((s) => s.name.toLowerCase()),
      );
      const missingMandatory = elig.mandatorySkills.filter(
        (ms) => !declaredMap.has(ms.toLowerCase()),
      );

      if (missingMandatory.length === 0) {
        passedCriteria.push(
          `Mandatory Core Skills Present (${elig.mandatorySkills.join(", ")})`,
        );
      } else {
        disqualifyingCriteria.push(
          `Missing Mandatory Prerequisite: ${missingMandatory.join(", ")}.`,
        );
      }
    }

    const totalChecks = passedCriteria.length + disqualifyingCriteria.length;
    const score =
      totalChecks > 0
        ? Math.round((passedCriteria.length / totalChecks) * 100)
        : 100;
    const isEligible = disqualifyingCriteria.length === 0;

    return {
      isEligible,
      score,
      passedCriteria,
      disqualifyingCriteria,
      notes,
    };
  }

  /**
   * Computes a multi-dimensional match score between student and opportunity.
   */
  calculateMatch(
    student: StudentProfile,
    readiness: CareerReadinessScore,
    opportunity: Opportunity,
  ): OpportunityMatchResult {
    const declaredSkills = student.declaredSkills ?? [];
    const skillMap = new Map<string, DeclaredSkill>();
    declaredSkills.forEach((s) => skillMap.set(s.name.toLowerCase(), s));

    // 1. Skill Fit (0-100)
    const required = opportunity.requiredSkills || [];
    const preferred = opportunity.preferredSkills || [];
    const matchingSkillsData: OpportunityMatchResult["matchingSkills"] = [];
    const missingSkills: string[] = [];

    let requiredScoreSum = 0;
    required.forEach((reqSkill) => {
      const declared = skillMap.get(reqSkill.toLowerCase());
      if (declared) {
        const score = declared.assessedScore ?? declared.proficiencyLevel;
        const isAssessed = declared.assessedScore !== undefined;
        const evidenceCount = declared.evidence?.length ?? 0;

        // Assessed skills with evidence get highest weight
        const skillCredit = isAssessed
          ? Math.min(100, Math.round(score * 0.9 + (evidenceCount > 0 ? 10 : 0)))
          : Math.min(80, Math.round(score * 0.75));

        requiredScoreSum += skillCredit;
        matchingSkillsData.push({
          name: declared.name,
          level: declared.proficiency,
          score: declared.assessedScore ?? declared.proficiencyLevel,
          isAssessed,
          evidenceCount,
        });
      } else {
        missingSkills.push(reqSkill);
      }
    });

    let preferredScoreSum = 0;
    preferred.forEach((prefSkill) => {
      const declared = skillMap.get(prefSkill.toLowerCase());
      if (declared) {
        const score = declared.assessedScore ?? declared.proficiencyLevel;
        preferredScoreSum += score;
        if (!matchingSkillsData.some((m) => m.name.toLowerCase() === declared.name.toLowerCase())) {
          matchingSkillsData.push({
            name: declared.name,
            level: declared.proficiency,
            score: declared.assessedScore ?? declared.proficiencyLevel,
            isAssessed: declared.assessedScore !== undefined,
            evidenceCount: declared.evidence?.length ?? 0,
          });
        }
      }
    });

    const requiredFit =
      required.length > 0 ? requiredScoreSum / required.length : 100;
    const preferredFit =
      preferred.length > 0 ? preferredScoreSum / preferred.length : 70;
    const skillFit = Math.min(
      100,
      Math.round(requiredFit * 0.75 + preferredFit * 0.25),
    );

    // 2. Eligibility Fit (0-100)
    const eligibilityResult = this.checkEligibility(student, opportunity);
    const eligibilityFit = eligibilityResult.score;

    // 3. Career Fit (0-100)
    const targetRoles = student.careerPreferences?.targetRoles ?? [];
    let careerFit = 45;
    const oppTitleLower = opportunity.title.toLowerCase();
    const oppDomainLower = (opportunity.domain || "").toLowerCase();

    if (targetRoles.length > 0) {
      const primaryRole = targetRoles[0]?.toLowerCase() ?? "";
      const secondaryRoles = targetRoles.slice(1).map((r) => r.toLowerCase());

      if (
        oppTitleLower.includes(primaryRole) ||
        primaryRole.includes(oppTitleLower) ||
        oppDomainLower.includes(primaryRole)
      ) {
        careerFit = 95;
      } else if (
        secondaryRoles.some(
          (sr) =>
            oppTitleLower.includes(sr) ||
            sr.includes(oppTitleLower) ||
            oppDomainLower.includes(sr),
        )
      ) {
        careerFit = 80;
      } else if (
        (primaryRole.includes("frontend") && oppTitleLower.includes("web")) ||
        (primaryRole.includes("full stack") &&
          (oppTitleLower.includes("frontend") || oppTitleLower.includes("backend"))) ||
        (primaryRole.includes("data") && oppTitleLower.includes("analytics"))
      ) {
        careerFit = 70;
      }
    } else {
      careerFit = 65;
    }

    // 4. Readiness Fit (0-100)
    const overallReadiness = readiness.overallScore;
    const technicalDepth = readiness.dimensions.technicalSkills;
    const assessmentAcc = readiness.dimensions.assessmentPerformance;
    const readinessFit = Math.min(
      100,
      Math.round(overallReadiness * 0.6 + technicalDepth * 0.25 + assessmentAcc * 0.15),
    );

    // 5. Evidence Fit (0-100)
    const matchingAssessedWithEvidence = matchingSkillsData.filter(
      (m) => m.evidenceCount > 0,
    ).length;
    const totalProjects = student.projects?.length ?? 0;
    let evidenceFit = 40;
    if (matchingAssessedWithEvidence >= 2) evidenceFit += 35;
    else if (matchingAssessedWithEvidence === 1) evidenceFit += 20;
    if (totalProjects >= 2) evidenceFit += 25;
    evidenceFit = Math.min(100, evidenceFit);

    // 6. Preference Fit (0-100)
    let preferenceFit = 75;
    const preferredWorkTypes =
      student.careerPreferences?.preferredWorkTypes ?? [];
    const preferredLocations =
      student.careerPreferences?.preferredLocations ?? [];

    if (
      preferredWorkTypes.length > 0 &&
      preferredWorkTypes.some((wt) =>
        opportunity.workMode.toLowerCase().includes(wt.toLowerCase()),
      )
    ) {
      preferenceFit += 15;
    }
    if (
      preferredLocations.length > 0 &&
      preferredLocations.some((loc) =>
        opportunity.location.toLowerCase().includes(loc.toLowerCase()),
      )
    ) {
      preferenceFit += 10;
    }
    preferenceFit = Math.min(100, preferenceFit);

    // Overall Weighted Match
    let overallMatch = Math.round(
      skillFit * 0.35 +
        readinessFit * 0.20 +
        careerFit * 0.20 +
        eligibilityFit * 0.15 +
        evidenceFit * 0.05 +
        preferenceFit * 0.05,
    );

    // Disqualification Penalty
    if (!eligibilityResult.isEligible) {
      overallMatch = Math.min(overallMatch, 55);
    }

    // Determine Category Tag
    let categoryTag: OpportunityMatchCategory = "General Match";
    if (!eligibilityResult.isEligible) {
      categoryTag = "Not Eligible";
    } else if (overallMatch >= 78 && readinessFit >= 70) {
      categoryTag = "Best Match";
    } else if (eligibilityResult.isEligible && overallMatch >= 65) {
      categoryTag = "Quick Win";
    } else if (careerFit >= 60 && missingSkills.length >= 2) {
      categoryTag = "Skill-Building";
    }

    // Generate Grounded Explanations
    const { strengths, concerns, whyYouMatch, whatIsMissing, whatWouldImproveYourMatch } =
      this.generateExplanation(
        student,
        readiness,
        opportunity,
        matchingSkillsData,
        missingSkills,
        eligibilityResult,
        careerFit,
        skillFit,
        readinessFit,
      );

    return {
      opportunityId: opportunity.id,
      overallMatch,
      categoryTag,
      skillFit,
      eligibilityFit,
      careerFit,
      readinessFit,
      evidenceFit,
      preferenceFit,
      matchingSkills: matchingSkillsData,
      missingSkills,
      strengths,
      concerns,
      whyYouMatch,
      whatIsMissing,
      whatWouldImproveYourMatch,
      eligibilityResult,
    };
  }

  /**
   * Generates grounded, transparent match rationale.
   */
  private generateExplanation(
    student: StudentProfile,
    readiness: CareerReadinessScore,
    opportunity: Opportunity,
    matchingSkills: OpportunityMatchResult["matchingSkills"],
    missingSkills: string[],
    eligibility: EligibilityCheckResult,
    careerFit: number,
    skillFit: number,
    readinessFit: number,
  ) {
    const whyYouMatch: string[] = [];
    const whatIsMissing: string[] = [];
    const whatWouldImproveYourMatch: string[] = [];
    const strengths: string[] = [];
    const concerns: string[] = [];

    // Why You Match
    const assessedMatches = matchingSkills.filter((m) => m.isAssessed && (m.score ?? 0) >= 70);
    if (assessedMatches.length > 0) {
      const topSkill = assessedMatches[0]!;
      whyYouMatch.push(
        `Strong verified assessment score in ${topSkill.name} (${topSkill.score}%) demonstrates required competency.`,
      );
      strengths.push(`Verified proficiency in ${topSkill.name}`);
    } else if (matchingSkills.length > 0) {
      whyYouMatch.push(
        `Declared skills cover ${matchingSkills.length} of ${opportunity.requiredSkills.length} required role prerequisites.`,
      );
    }

    if (careerFit >= 80) {
      const topRole = student.careerPreferences?.targetRoles?.[0] || "Target Role";
      whyYouMatch.push(
        `Your primary career target '${topRole}' directly corresponds to this ${opportunity.type.toLowerCase()} role.`,
      );
      strengths.push(`Direct alignment with your career trajectory (${topRole})`);
    }

    if (eligibility.isEligible && eligibility.passedCriteria.length > 0) {
      whyYouMatch.push(
        `All academic and batch eligibility criteria satisfied (${student.academicProfile?.degree || student.degree || "Degree"} · Batch ${student.academicProfile?.graduationYear || student.year || "2026"}).`,
      );
      strengths.push("100% Academic & Batch Eligibility Confirmed");
    }

    const projectsWithEvidence = (student.projects ?? []).length;
    if (projectsWithEvidence > 0) {
      whyYouMatch.push(
        `${projectsWithEvidence} portfolio projects demonstrate practical hands-on software engineering capabilities.`,
      );
    }

    // What Is Missing
    if (missingSkills.length > 0) {
      missingSkills.slice(0, 3).forEach((skill) => {
        whatIsMissing.push(`Missing prerequisite skill: ${skill}`);
        concerns.push(`Skill gap: ${skill}`);
      });
    }

    if (!eligibility.isEligible) {
      eligibility.disqualifyingCriteria.forEach((crit) => {
        whatIsMissing.push(crit);
        concerns.push(crit);
      });
    }

    const unassessedMatches = matchingSkills.filter((m) => !m.isAssessed);
    if (unassessedMatches.length > 0) {
      whatIsMissing.push(
        `${unassessedMatches.length} matching skills (${unassessedMatches.map((s) => s.name).join(", ")}) are self-declared only.`,
      );
    }

    // What Would Improve Your Match
    if (missingSkills.length > 0) {
      const topMissing = missingSkills[0]!;
      whatWouldImproveYourMatch.push(
        `Add '${topMissing}' to your Personalized Roadmap and complete foundational modules (+8% Match Boost).`,
      );
    }

    if (unassessedMatches.length > 0) {
      whatWouldImproveYourMatch.push(
        `Take an Adaptive Skill Assessment in ${unassessedMatches[0]!.name} to establish a verified benchmark.`,
      );
    }

    const skillsWithoutEvidence = matchingSkills.filter((m) => m.evidenceCount === 0);
    if (skillsWithoutEvidence.length > 0) {
      whatWouldImproveYourMatch.push(
        `Link a GitHub repository or project artifact to '${skillsWithoutEvidence[0]!.name}' in your Skill Passport.`,
      );
    }

    if (readiness.overallScore < 75) {
      whatWouldImproveYourMatch.push(
        `Elevate overall Career Readiness from ${readiness.overallScore}% to 80%+ by closing critical gaps.`,
      );
    }

    return {
      strengths,
      concerns,
      whyYouMatch,
      whatIsMissing,
      whatWouldImproveYourMatch,
    };
  }

  /**
   * Ranks opportunities and attaches matching results for a student.
   */
  rankOpportunities(
    student: StudentProfile,
    readiness: CareerReadinessScore,
    opportunities: Opportunity[],
  ): { opportunity: Opportunity; match: OpportunityMatchResult }[] {
    const list = opportunities.map((opp) => ({
      opportunity: opp,
      match: this.calculateMatch(student, readiness, opp),
    }));

    return list.sort((a, b) => b.match.overallMatch - a.match.overallMatch);
  }
}

export const opportunityMatchingEngine = new OpportunityMatchingEngine();
