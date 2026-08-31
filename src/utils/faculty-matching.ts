import type { FacultyProfile } from "@/types/academician";

export interface FacultyMatchResult {
  matchScore: number; // 0 - 100
  matchingSkills: string[];
  relevanceReason: string;
  isHighFit: boolean;
}

export function matchFacultyToOpportunity(
  faculty: FacultyProfile,
  opportunity: {
    title: string;
    requiredSkills?: string[];
    domain?: string;
    description?: string;
    type?: string;
  },
): FacultyMatchResult {
  const oppSkills = (opportunity.requiredSkills || []).map((s) => s.toLowerCase().trim());
  const oppDomain = (opportunity.domain || "").toLowerCase().trim();
  const oppTitle = (opportunity.title || "").toLowerCase().trim();
  const oppDesc = (opportunity.description || "").toLowerCase().trim();

  // Combine faculty keywords
  const facultyExpertise = faculty.areasOfExpertise.map((e) => e.toLowerCase().trim());
  const facultyTech = faculty.technicalSkills.map((t) => t.toLowerCase().trim());
  const facultyResearch = faculty.researchInterests.map((r) => r.toLowerCase().trim());

  const matchingSkills: string[] = [];

  // Check required skills overlap
  for (const skill of faculty.technicalSkills) {
    const sLower = skill.toLowerCase();
    if (
      oppSkills.some((os) => os.includes(sLower) || sLower.includes(os)) ||
      oppTitle.includes(sLower) ||
      oppDesc.includes(sLower)
    ) {
      if (!matchingSkills.includes(skill)) {
        matchingSkills.push(skill);
      }
    }
  }

  // Check expertise & research overlap
  for (const exp of faculty.areasOfExpertise) {
    const eLower = exp.toLowerCase();
    if (
      oppDomain.includes(eLower) ||
      eLower.includes(oppDomain) ||
      oppTitle.includes(eLower) ||
      oppDesc.includes(eLower)
    ) {
      if (!matchingSkills.includes(exp)) {
        matchingSkills.push(exp);
      }
    }
  }

  for (const res of faculty.researchInterests) {
    const rLower = res.toLowerCase();
    if (oppTitle.includes(rLower) || oppDesc.includes(rLower) || oppDomain.includes(rLower)) {
      if (!matchingSkills.includes(res)) {
        matchingSkills.push(res);
      }
    }
  }

  // Score Calculation
  let baseScore = 60;

  // Domain alignment bonus
  if (
    facultyExpertise.some((e) => oppDomain.includes(e) || e.includes(oppDomain)) ||
    facultyResearch.some((r) => oppDomain.includes(r) || r.includes(oppDomain))
  ) {
    baseScore += 20;
  }

  // Skill matches bonus
  if (oppSkills.length > 0) {
    const matchRatio = matchingSkills.length / Math.max(oppSkills.length, 1);
    baseScore += Math.round(matchRatio * 20);
  } else {
    baseScore += Math.min(matchingSkills.length * 8, 20);
  }

  const matchScore = Math.min(Math.max(baseScore, 50), 98);
  const isHighFit = matchScore >= 80;

  // Generate Grounded Rationale
  let relevanceReason = "";
  if (matchingSkills.length > 0) {
    relevanceReason = `Strong alignment with your core expertise in ${matchingSkills.slice(0, 3).join(", ")}.`;
  } else if (oppDomain) {
    relevanceReason = `Domain synergy with ${opportunity.domain} and department curriculum.`;
  } else {
    relevanceReason = "Recommended academic collaboration opportunity based on department focus.";
  }

  return {
    matchScore,
    matchingSkills,
    relevanceReason,
    isHighFit,
  };
}

