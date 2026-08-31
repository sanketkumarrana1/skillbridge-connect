import type { AssessmentQuestion, AssessmentSetupConfig } from "@/types/assessment";
import type { StudentProfile } from "@/types";

export interface IAssessmentGenerator {
  generateAssessment(
    profile: StudentProfile,
    config: AssessmentSetupConfig,
  ): Promise<AssessmentQuestion[]> | AssessmentQuestion[];
}
