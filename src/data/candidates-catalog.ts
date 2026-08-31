import type { Candidate, Application } from "@/types";
import type { OpportunityMatchResult } from "@/types/opportunity";

export interface RecruiterCandidateRecord {
  candidate: Candidate;
  application: Application;
  matchResult: OpportunityMatchResult;
}

export const INITIAL_RECRUITER_CANDIDATES: RecruiterCandidateRecord[] = [];
