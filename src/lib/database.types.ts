export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AppRole = "student" | "industry" | "academician" | "institution" | "admin";
export type OrganizationType = "institution" | "company";
export type OrganizationStatus = "active" | "pending_verification" | "suspended";
export type MembershipRole =
  | "owner"
  | "admin"
  | "member"
  | "recruiter"
  | "faculty"
  | "placement_officer";

export type SkillRelationType =
  | "related"
  | "prerequisite"
  | "commonly_used_with"
  | "specialization_of";

export type SkillSelfLevel = "beginner" | "intermediate" | "advanced";

export type EvidenceVerificationStatus =
  | "self_declared"
  | "evidence_added"
  | "pending_verification"
  | "verified";

export type AssessmentType = "skill_verification" | "career_readiness" | "comprehensive";
export type AssessmentModeEnum = "personalized" | "standard";
export type QuestionDifficulty = "beginner" | "intermediate" | "advanced";
export type QuestionStatus = "active" | "inactive" | "retired";
export type AttemptStatus =
  | "not_started"
  | "in_progress"
  | "submitted"
  | "auto_submitted"
  | "expired"
  | "cancelled";
export type AssessedSkillStatus = "insufficient_data" | "developing" | "competent" | "strong";

export type OpportunityTypeEnum =
  | "internship"
  | "job"
  | "live_project"
  | "apprenticeship"
  | "training";

export type OpportunityStatusEnum =
  | "draft"
  | "pending_review"
  | "published"
  | "closed"
  | "rejected"
  | "archived";

export type OpportunityWorkModeEnum = "remote" | "hybrid" | "onsite";

export type OpportunityExperienceLevelEnum = "fresher" | "0-1 yr" | "1-2 yr" | "2+ yr" | "any";

export type OpportunitySkillRequirementType = "required" | "preferred";

export type EligibilityRuleType =
  | "degree"
  | "program"
  | "department"
  | "graduation_year"
  | "minimum_cgpa"
  | "experience"
  | "location";

export type OpportunityMatchCategoryEnum =
  | "best_match"
  | "quick_win"
  | "skill_building"
  | "general_match"
  | "not_eligible";

export type CompanyVerificationStatusEnum =
  | "unverified"
  | "pending"
  | "verified"
  | "rejected"
  | "suspended";

export type RecruiterRoleEnum =
  | "owner"
  | "admin"
  | "recruiter"
  | "hiring_manager"
  | "interviewer";

export type RecruiterPermissionEnum =
  | "manage_company_profile"
  | "manage_recruiters"
  | "create_opportunity"
  | "edit_opportunity"
  | "publish_opportunity"
  | "close_opportunity"
  | "view_applications"
  | "shortlist_candidates"
  | "schedule_interviews"
  | "submit_interview_feedback"
  | "create_offer"
  | "view_analytics";

export type OpportunityAssignmentRoleEnum =
  | "lead_recruiter"
  | "recruiter"
  | "hiring_manager"
  | "interviewer";

export type AIOperationEnum =
  | "assessment_generate"
  | "skill_analysis"
  | "career_recommendation"
  | "learning_recommendation"
  | "opportunity_explanation"
  | "candidate_summary"
  | "candidate_comparison"
  | "resume_feedback"
  | "resume_analysis"
  | "portfolio_feedback"
  | "interview_preparation"
  | "interview_practice";

export type AIRequestStatusEnum =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "rejected"
  | "rate_limited";

export type AIProviderTypeEnum = "gemini" | "openai" | "mock";

export type AIPromptStatusEnum = "draft" | "active" | "archived";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          avatar_url: string | null;
          city: string | null;
          state: string | null;
          country: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          phone?: string | null;
          avatar_url?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone?: string | null;
          avatar_url?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: AppRole;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: AppRole;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: AppRole;
          is_primary?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          organization_type: OrganizationType;
          status: OrganizationStatus;
          legal_name: string | null;
          display_name: string | null;
          industry: string | null;
          company_size: string | null;
          founded_year: string | null;
          description: string | null;
          headquarters_location: string | null;
          logo_hue: number | null;
          verification_status: CompanyVerificationStatusEnum;
          verification_submitted_at: string | null;
          verified_by: string | null;
          rejection_reason: string | null;
          verification_notes: string | null;
          website: string | null;
          logo_url: string | null;
          city: string | null;
          state: string | null;
          country: string;
          verified_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          organization_type: OrganizationType;
          status?: OrganizationStatus;
          legal_name?: string | null;
          display_name?: string | null;
          industry?: string | null;
          company_size?: string | null;
          founded_year?: string | null;
          description?: string | null;
          headquarters_location?: string | null;
          logo_hue?: number | null;
          verification_status?: CompanyVerificationStatusEnum;
          verification_submitted_at?: string | null;
          verified_by?: string | null;
          rejection_reason?: string | null;
          verification_notes?: string | null;
          website?: string | null;
          logo_url?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string;
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          organization_type?: OrganizationType;
          status?: OrganizationStatus;
          legal_name?: string | null;
          display_name?: string | null;
          industry?: string | null;
          company_size?: string | null;
          founded_year?: string | null;
          description?: string | null;
          headquarters_location?: string | null;
          logo_hue?: number | null;
          verification_status?: CompanyVerificationStatusEnum;
          verification_submitted_at?: string | null;
          verified_by?: string | null;
          rejection_reason?: string | null;
          verification_notes?: string | null;
          website?: string | null;
          logo_url?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string;
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      departments: {
        Row: {
          id: string;
          institution_id: string;
          name: string;
          code: string | null;
          description: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          institution_id: string;
          name: string;
          code?: string | null;
          description?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          institution_id?: string;
          name?: string;
          code?: string | null;
          description?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      organization_memberships: {
        Row: {
          id: string;
          organization_id: string;
          user_id: string;
          membership_role: MembershipRole;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          user_id: string;
          membership_role?: MembershipRole;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          user_id?: string;
          membership_role?: MembershipRole;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      student_profiles: {
        Row: {
          user_id: string;
          institution_id: string | null;
          department_id: string | null;
          roll_number: string | null;
          degree: string | null;
          program: string | null;
          academic_year: string | null;
          graduation_year: number | null;
          academic_status: string;
          grade: string | null;
          headline: string | null;
          about: string | null;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          institution_id?: string | null;
          department_id?: string | null;
          roll_number?: string | null;
          degree?: string | null;
          program?: string | null;
          academic_year?: string | null;
          graduation_year?: number | null;
          academic_status?: string;
          grade?: string | null;
          headline?: string | null;
          about?: string | null;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          institution_id?: string | null;
          department_id?: string | null;
          roll_number?: string | null;
          degree?: string | null;
          program?: string | null;
          academic_year?: string | null;
          graduation_year?: number | null;
          academic_status?: string;
          grade?: string | null;
          headline?: string | null;
          about?: string | null;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      career_interests: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          icon?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          icon?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      target_roles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          category: string;
          description: string | null;
          demand_level: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          category: string;
          description?: string | null;
          demand_level?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          category?: string;
          description?: string | null;
          demand_level?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      student_career_interests: {
        Row: {
          id: string;
          student_id: string;
          career_interest_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          career_interest_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          career_interest_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      student_target_roles: {
        Row: {
          id: string;
          student_id: string;
          target_role_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          target_role_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          target_role_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      student_opportunity_preferences: {
        Row: {
          id: string;
          student_id: string;
          preferred_work_types: string[];
          preferred_work_modes: string[];
          preferred_cities: string[];
          availability: string | null;
          preferred_opportunity_types: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          preferred_work_types?: string[];
          preferred_work_modes?: string[];
          preferred_cities?: string[];
          availability?: string | null;
          preferred_opportunity_types?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          preferred_work_types?: string[];
          preferred_work_modes?: string[];
          preferred_cities?: string[];
          availability?: string | null;
          preferred_opportunity_types?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      skill_categories: {
        Row: {
          id: string;
          parent_id: string | null;
          name: string;
          slug: string;
          description: string | null;
          status: string;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          parent_id?: string | null;
          name: string;
          slug: string;
          description?: string | null;
          status?: string;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          parent_id?: string | null;
          name?: string;
          slug?: string;
          description?: string | null;
          status?: string;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      skills: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          slug: string;
          description: string | null;
          status: string;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          name: string;
          slug: string;
          description?: string | null;
          status?: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          status?: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      skill_aliases: {
        Row: {
          id: string;
          skill_id: string;
          alias: string;
          normalized_alias: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          skill_id: string;
          alias: string;
          normalized_alias: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          skill_id?: string;
          alias?: string;
          normalized_alias?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      skill_relations: {
        Row: {
          id: string;
          skill_id: string;
          related_skill_id: string;
          relation_type: SkillRelationType;
          created_at: string;
        };
        Insert: {
          id?: string;
          skill_id: string;
          related_skill_id: string;
          relation_type?: SkillRelationType;
          created_at?: string;
        };
        Update: {
          id?: string;
          skill_id?: string;
          related_skill_id?: string;
          relation_type?: SkillRelationType;
          created_at?: string;
        };
        Relationships: [];
      };
      student_skills: {
        Row: {
          id: string;
          student_id: string;
          skill_id: string;
          self_level: SkillSelfLevel;
          self_score: number;
          source: string;
          status: string;
          first_declared_at: string;
          last_updated_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          skill_id: string;
          self_level?: SkillSelfLevel;
          self_score?: number;
          source?: string;
          status?: string;
          first_declared_at?: string;
          last_updated_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          skill_id?: string;
          self_level?: SkillSelfLevel;
          self_score?: number;
          source?: string;
          status?: string;
          first_declared_at?: string;
          last_updated_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      skill_evidence: {
        Row: {
          id: string;
          student_skill_id: string;
          student_id: string;
          evidence_type: string;
          title: string;
          description: string | null;
          url: string | null;
          linked_entity_id: string | null;
          linked_entity_type: string | null;
          document_id: string | null;
          evidence_date: string | null;
          verification_status: EvidenceVerificationStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_skill_id: string;
          student_id: string;
          evidence_type: string;
          title: string;
          description?: string | null;
          url?: string | null;
          linked_entity_id?: string | null;
          linked_entity_type?: string | null;
          document_id?: string | null;
          evidence_date?: string | null;
          verification_status?: EvidenceVerificationStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_skill_id?: string;
          student_id?: string;
          evidence_type?: string;
          title?: string;
          description?: string | null;
          url?: string | null;
          linked_entity_id?: string | null;
          linked_entity_type?: string | null;
          document_id?: string | null;
          evidence_date?: string | null;
          verification_status?: EvidenceVerificationStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      assessments: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          assessment_type: AssessmentType;
          mode: AssessmentModeEnum;
          question_count: number;
          duration_minutes: number;
          status: string;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          assessment_type?: AssessmentType;
          mode?: AssessmentModeEnum;
          question_count?: number;
          duration_minutes?: number;
          status?: string;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          assessment_type?: AssessmentType;
          mode?: AssessmentModeEnum;
          question_count?: number;
          duration_minutes?: number;
          status?: string;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      assessment_questions: {
        Row: {
          id: string;
          skill_id: string;
          category_id: string | null;
          topic: string;
          question_text: string;
          explanation: string | null;
          difficulty: QuestionDifficulty;
          question_type: string;
          score_value: number;
          status: QuestionStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          skill_id: string;
          category_id?: string | null;
          topic: string;
          question_text: string;
          explanation?: string | null;
          difficulty?: QuestionDifficulty;
          question_type?: string;
          score_value?: number;
          status?: QuestionStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          skill_id?: string;
          category_id?: string | null;
          topic?: string;
          question_text?: string;
          explanation?: string | null;
          difficulty?: QuestionDifficulty;
          question_type?: string;
          score_value?: number;
          status?: QuestionStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      assessment_question_options: {
        Row: {
          id: string;
          question_id: string;
          option_key: string;
          option_text: string;
          is_correct: boolean;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          question_id: string;
          option_key: string;
          option_text: string;
          is_correct?: boolean;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          question_id?: string;
          option_key?: string;
          option_text?: string;
          is_correct?: boolean;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      assessment_configs: {
        Row: {
          id: string;
          student_id: string;
          assessment_id: string | null;
          question_count: number;
          duration_minutes: number;
          selected_skills_snapshot: Json;
          target_roles_snapshot: Json;
          difficulty_policy: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          assessment_id?: string | null;
          question_count?: number;
          duration_minutes?: number;
          selected_skills_snapshot?: Json;
          target_roles_snapshot?: Json;
          difficulty_policy?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          assessment_id?: string | null;
          question_count?: number;
          duration_minutes?: number;
          selected_skills_snapshot?: Json;
          target_roles_snapshot?: Json;
          difficulty_policy?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      assessment_attempts: {
        Row: {
          id: string;
          config_id: string;
          student_id: string;
          status: AttemptStatus;
          started_at: string;
          submitted_at: string | null;
          expires_at: string;
          duration_seconds: number | null;
          question_count: number;
          overall_score: number | null;
          accuracy_percentage: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          config_id: string;
          student_id: string;
          status?: AttemptStatus;
          started_at?: string;
          submitted_at?: string | null;
          expires_at: string;
          duration_seconds?: number | null;
          question_count?: number;
          overall_score?: number | null;
          accuracy_percentage?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          config_id?: string;
          student_id?: string;
          status?: AttemptStatus;
          started_at?: string;
          submitted_at?: string | null;
          expires_at?: string;
          duration_seconds?: number | null;
          question_count?: number;
          overall_score?: number | null;
          accuracy_percentage?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      assessment_attempt_questions: {
        Row: {
          id: string;
          attempt_id: string;
          question_id: string;
          skill_id: string;
          difficulty: QuestionDifficulty;
          sequence_number: number;
          selected_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          attempt_id: string;
          question_id: string;
          skill_id: string;
          difficulty?: QuestionDifficulty;
          sequence_number: number;
          selected_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          attempt_id?: string;
          question_id?: string;
          skill_id?: string;
          difficulty?: QuestionDifficulty;
          sequence_number?: number;
          selected_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      assessment_answers: {
        Row: {
          id: string;
          attempt_id: string;
          attempt_question_id: string;
          selected_option_id: string | null;
          answered_at: string;
          is_correct: boolean | null;
          score_awarded: number;
        };
        Insert: {
          id?: string;
          attempt_id: string;
          attempt_question_id: string;
          selected_option_id?: string | null;
          answered_at?: string;
          is_correct?: boolean | null;
          score_awarded?: number;
        };
        Update: {
          id?: string;
          attempt_id?: string;
          attempt_question_id?: string;
          selected_option_id?: string | null;
          answered_at?: string;
          is_correct?: boolean | null;
          score_awarded?: number;
        };
        Relationships: [];
      };
      assessment_skill_results: {
        Row: {
          id: string;
          attempt_id: string;
          student_id: string;
          skill_id: string;
          questions_count: number;
          attempted_count: number;
          correct_count: number;
          score: number;
          assessed_level: SkillSelfLevel;
          confidence: string;
          result_status: AssessedSkillStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          attempt_id: string;
          student_id: string;
          skill_id: string;
          questions_count?: number;
          attempted_count?: number;
          correct_count?: number;
          score?: number;
          assessed_level?: SkillSelfLevel;
          confidence?: string;
          result_status?: AssessedSkillStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          attempt_id?: string;
          student_id?: string;
          skill_id?: string;
          questions_count?: number;
          attempted_count?: number;
          correct_count?: number;
          score?: number;
          assessed_level?: SkillSelfLevel;
          confidence?: string;
          result_status?: AssessedSkillStatus;
          created_at?: string;
        };
        Relationships: [];
      };
      assessment_events: {
        Row: {
          id: string;
          attempt_id: string;
          event_type: string;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          attempt_id: string;
          event_type: string;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          attempt_id?: string;
          event_type?: string;
          metadata?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
      opportunities: {
        Row: {
          id: string;
          company_id: string;
          created_by: string | null;
          type: OpportunityTypeEnum;
          title: string;
          slug: string;
          short_description: string | null;
          description: string;
          responsibilities: string[];
          domain: string | null;
          category_id: string | null;
          status: OpportunityStatusEnum;
          location: string | null;
          work_mode: OpportunityWorkModeEnum;
          experience_level: OpportunityExperienceLevelEnum;
          duration_value: number | null;
          duration_unit: string | null;
          duration_text: string | null;
          compensation_type: string;
          compensation_min: number | null;
          compensation_max: number | null;
          compensation_currency: string;
          compensation_formatted: string | null;
          openings: number;
          hiring_process: string[];
          application_deadline: string;
          featured: boolean;
          live_project_details: Json | null;
          training_details: Json | null;
          posted_at: string | null;
          published_at: string | null;
          closed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          created_by?: string | null;
          type?: OpportunityTypeEnum;
          title: string;
          slug: string;
          short_description?: string | null;
          description: string;
          responsibilities?: string[];
          domain?: string | null;
          category_id?: string | null;
          status?: OpportunityStatusEnum;
          location?: string | null;
          work_mode?: OpportunityWorkModeEnum;
          experience_level?: OpportunityExperienceLevelEnum;
          duration_value?: number | null;
          duration_unit?: string | null;
          duration_text?: string | null;
          compensation_type?: string;
          compensation_min?: number | null;
          compensation_max?: number | null;
          compensation_currency?: string;
          compensation_formatted?: string | null;
          openings?: number;
          hiring_process?: string[];
          application_deadline: string;
          featured?: boolean;
          live_project_details?: Json | null;
          training_details?: Json | null;
          posted_at?: string | null;
          published_at?: string | null;
          closed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          created_by?: string | null;
          type?: OpportunityTypeEnum;
          title?: string;
          slug?: string;
          short_description?: string | null;
          description?: string;
          responsibilities?: string[];
          domain?: string | null;
          category_id?: string | null;
          status?: OpportunityStatusEnum;
          location?: string | null;
          work_mode?: OpportunityWorkModeEnum;
          experience_level?: OpportunityExperienceLevelEnum;
          duration_value?: number | null;
          duration_unit?: string | null;
          duration_text?: string | null;
          compensation_type?: string;
          compensation_min?: number | null;
          compensation_max?: number | null;
          compensation_currency?: string;
          compensation_formatted?: string | null;
          openings?: number;
          hiring_process?: string[];
          application_deadline?: string;
          featured?: boolean;
          live_project_details?: Json | null;
          training_details?: Json | null;
          posted_at?: string | null;
          published_at?: string | null;
          closed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      opportunity_skills: {
        Row: {
          id: string;
          opportunity_id: string;
          skill_id: string;
          requirement_type: OpportunitySkillRequirementType;
          minimum_level: SkillSelfLevel | null;
          weight: number;
          mandatory: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          opportunity_id: string;
          skill_id: string;
          requirement_type?: OpportunitySkillRequirementType;
          minimum_level?: SkillSelfLevel | null;
          weight?: number;
          mandatory?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          opportunity_id?: string;
          skill_id?: string;
          requirement_type?: OpportunitySkillRequirementType;
          minimum_level?: SkillSelfLevel | null;
          weight?: number;
          mandatory?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      opportunity_eligibility_rules: {
        Row: {
          id: string;
          opportunity_id: string;
          rule_type: EligibilityRuleType;
          operator: string;
          value: Json;
          is_mandatory: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          opportunity_id: string;
          rule_type: EligibilityRuleType;
          operator?: string;
          value: Json;
          is_mandatory?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          opportunity_id?: string;
          rule_type?: EligibilityRuleType;
          operator?: string;
          value?: Json;
          is_mandatory?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      opportunity_target_roles: {
        Row: {
          id: string;
          opportunity_id: string;
          target_role_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          opportunity_id: string;
          target_role_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          opportunity_id?: string;
          target_role_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      saved_opportunities: {
        Row: {
          id: string;
          student_id: string;
          opportunity_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          opportunity_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          opportunity_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      opportunity_match_results: {
        Row: {
          id: string;
          student_id: string;
          opportunity_id: string;
          overall_match: number;
          category_tag: OpportunityMatchCategoryEnum;
          skill_fit: number;
          eligibility_fit: number;
          career_fit: number;
          readiness_fit: number;
          evidence_fit: number;
          preference_fit: number;
          matching_skills: Json;
          missing_skills: Json;
          strengths: Json;
          concerns: Json;
          why_you_match: Json;
          what_is_missing: Json;
          what_would_improve: Json;
          eligibility_result: Json;
          engine_version: string;
          calculated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          opportunity_id: string;
          overall_match?: number;
          category_tag?: OpportunityMatchCategoryEnum;
          skill_fit?: number;
          eligibility_fit?: number;
          career_fit?: number;
          readiness_fit?: number;
          evidence_fit?: number;
          preference_fit?: number;
          matching_skills?: Json;
          missing_skills?: Json;
          strengths?: Json;
          concerns?: Json;
          why_you_match?: Json;
          what_is_missing?: Json;
          what_would_improve?: Json;
          eligibility_result?: Json;
          engine_version?: string;
          calculated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          opportunity_id?: string;
          overall_match?: number;
          category_tag?: OpportunityMatchCategoryEnum;
          skill_fit?: number;
          eligibility_fit?: number;
          career_fit?: number;
          readiness_fit?: number;
          evidence_fit?: number;
          preference_fit?: number;
          matching_skills?: Json;
          missing_skills?: Json;
          strengths?: Json;
          concerns?: Json;
          why_you_match?: Json;
          what_is_missing?: Json;
          what_would_improve?: Json;
          eligibility_result?: Json;
          engine_version?: string;
          calculated_at?: string;
        };
        Relationships: [];
      };
      industry_profiles: {
        Row: {
          user_id: string;
          company_id: string | null;
          designation: string | null;
          department: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          company_id?: string | null;
          designation?: string | null;
          department?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          company_id?: string | null;
          designation?: string | null;
          department?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      academician_profiles: {
        Row: {
          user_id: string;
          institution_id: string | null;
          department_id: string | null;
          designation: string | null;
          faculty_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          institution_id?: string | null;
          department_id?: string | null;
          designation?: string | null;
          faculty_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          institution_id?: string | null;
          department_id?: string | null;
          designation?: string | null;
          faculty_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      institution_profiles: {
        Row: {
          user_id: string;
          institution_id: string | null;
          designation: string | null;
          office_role: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          institution_id?: string | null;
          designation?: string | null;
          office_role?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          institution_id?: string | null;
          designation?: string | null;
          office_role?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      applications: {
        Row: {
          id: string;
          student_id: string;
          opportunity_id: string;
          status: string;
          match_score: number;
          answers: Json;
          submitted_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          opportunity_id: string;
          status?: string;
          match_score?: number;
          answers?: Json;
          submitted_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          opportunity_id?: string;
          status?: string;
          match_score?: number;
          answers?: Json;
          submitted_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      application_match_snapshots: {
        Row: {
          id: string;
          application_id: string;
          student_id: string;
          opportunity_id: string;
          overall_match: number;
          skill_fit: number;
          eligibility_fit: number;
          career_fit: number;
          readiness_fit: number;
          evidence_fit: number;
          preference_fit: number;
          matching_skills: Json;
          missing_skills: Json;
          profile_snapshot: Json;
          explanation: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          student_id: string;
          opportunity_id: string;
          overall_match: number;
          skill_fit: number;
          eligibility_fit: number;
          career_fit: number;
          readiness_fit: number;
          evidence_fit: number;
          preference_fit: number;
          matching_skills?: Json;
          missing_skills?: Json;
          profile_snapshot?: Json;
          explanation?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          student_id?: string;
          opportunity_id?: string;
          overall_match?: number;
          skill_fit?: number;
          eligibility_fit?: number;
          career_fit?: number;
          readiness_fit?: number;
          evidence_fit?: number;
          preference_fit?: number;
          matching_skills?: Json;
          missing_skills?: Json;
          profile_snapshot?: Json;
          explanation?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      application_status_history: {
        Row: {
          id: string;
          application_id: string;
          from_status: string | null;
          to_status: string;
          changed_by: string | null;
          reason: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          from_status?: string | null;
          to_status: string;
          changed_by?: string | null;
          reason?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          from_status?: string | null;
          to_status?: string;
          changed_by?: string | null;
          reason?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
      interviews: {
        Row: {
          id: string;
          application_id: string;
          student_id: string;
          opportunity_id: string;
          round_name: string;
          interview_type: string;
          scheduled_start: string;
          scheduled_end: string;
          timezone: string;
          mode: string;
          meeting_url: string | null;
          interviewer_name: string | null;
          interviewer_id: string | null;
          instructions: string | null;
          internal_notes: string | null;
          status: string;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          student_id: string;
          opportunity_id: string;
          round_name?: string;
          interview_type?: string;
          scheduled_start: string;
          scheduled_end: string;
          timezone?: string;
          mode?: string;
          meeting_url?: string | null;
          interviewer_name?: string | null;
          interviewer_id?: string | null;
          instructions?: string | null;
          internal_notes?: string | null;
          status?: string;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          student_id?: string;
          opportunity_id?: string;
          round_name?: string;
          interview_type?: string;
          scheduled_start?: string;
          scheduled_end?: string;
          timezone?: string;
          mode?: string;
          meeting_url?: string | null;
          interviewer_name?: string | null;
          interviewer_id?: string | null;
          instructions?: string | null;
          internal_notes?: string | null;
          status?: string;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      interview_feedback: {
        Row: {
          id: string;
          interview_id: string;
          interviewer_id: string;
          technical_score: number | null;
          problem_solving_score: number | null;
          communication_score: number | null;
          teamwork_score: number | null;
          role_fit_score: number | null;
          overall_rating: number | null;
          strengths: string | null;
          concerns: string | null;
          recommendation: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          interview_id: string;
          interviewer_id: string;
          technical_score?: number | null;
          problem_solving_score?: number | null;
          communication_score?: number | null;
          teamwork_score?: number | null;
          role_fit_score?: number | null;
          overall_rating?: number | null;
          strengths?: string | null;
          concerns?: string | null;
          recommendation?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          interview_id?: string;
          interviewer_id?: string;
          technical_score?: number | null;
          problem_solving_score?: number | null;
          communication_score?: number | null;
          teamwork_score?: number | null;
          role_fit_score?: number | null;
          overall_rating?: number | null;
          strengths?: string | null;
          concerns?: string | null;
          recommendation?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      offers: {
        Row: {
          id: string;
          application_id: string;
          student_id: string;
          opportunity_id: string;
          position_title: string;
          joining_date: string;
          compensation_formatted: string;
          work_mode: string;
          location: string;
          terms_and_conditions: string | null;
          status: string;
          issued_at: string;
          expires_at: string | null;
          responded_at: string | null;
          response_reason: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          student_id: string;
          opportunity_id: string;
          position_title: string;
          joining_date: string;
          compensation_formatted: string;
          work_mode?: string;
          location: string;
          terms_and_conditions?: string | null;
          status?: string;
          issued_at?: string;
          expires_at?: string | null;
          responded_at?: string | null;
          response_reason?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          student_id?: string;
          opportunity_id?: string;
          position_title?: string;
          joining_date?: string;
          compensation_formatted?: string;
          work_mode?: string;
          location?: string;
          terms_and_conditions?: string | null;
          status?: string;
          issued_at?: string;
          expires_at?: string | null;
          responded_at?: string | null;
          response_reason?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      placements: {
        Row: {
          id: string;
          application_id: string;
          student_id: string;
          company_id: string;
          opportunity_id: string;
          offer_id: string | null;
          placement_cycle: string;
          position_title: string;
          compensation_formatted: string;
          joining_date: string;
          status: string;
          verified_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          student_id: string;
          company_id: string;
          opportunity_id: string;
          offer_id?: string | null;
          placement_cycle?: string;
          position_title: string;
          compensation_formatted: string;
          joining_date: string;
          status?: string;
          verified_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          student_id?: string;
          company_id?: string;
          opportunity_id?: string;
          offer_id?: string | null;
          placement_cycle?: string;
          position_title?: string;
          compensation_formatted?: string;
          joining_date?: string;
          status?: string;
          verified_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      recruiter_role_permissions: {
        Row: {
          role: RecruiterRoleEnum;
          permission: RecruiterPermissionEnum;
        };
        Insert: {
          role: RecruiterRoleEnum;
          permission: RecruiterPermissionEnum;
        };
        Update: {
          role?: RecruiterRoleEnum;
          permission?: RecruiterPermissionEnum;
        };
        Relationships: [];
      };
      opportunity_recruiters: {
        Row: {
          id: string;
          opportunity_id: string;
          user_id: string;
          assignment_role: OpportunityAssignmentRoleEnum;
          assigned_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          opportunity_id: string;
          user_id: string;
          assignment_role?: OpportunityAssignmentRoleEnum;
          assigned_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          opportunity_id?: string;
          user_id?: string;
          assignment_role?: OpportunityAssignmentRoleEnum;
          assigned_by?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      company_audit_logs: {
        Row: {
          id: string;
          company_id: string;
          actor_id: string | null;
          action: string;
          target_type: string;
          target_id: string | null;
          details: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          actor_id?: string | null;
          action: string;
          target_type: string;
          target_id?: string | null;
          details?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          actor_id?: string | null;
          action?: string;
          target_type?: string;
          target_id?: string | null;
          details?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
      ai_prompt_templates: {
        Row: {
          id: string;
          operation: AIOperationEnum;
          version: number;
          system_prompt: string;
          user_prompt_template: string;
          schema_version: string;
          status: AIPromptStatusEnum;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          operation: AIOperationEnum;
          version?: number;
          system_prompt: string;
          user_prompt_template: string;
          schema_version?: string;
          status?: AIPromptStatusEnum;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          operation?: AIOperationEnum;
          version?: number;
          system_prompt?: string;
          user_prompt_template?: string;
          schema_version?: string;
          status?: AIPromptStatusEnum;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ai_requests: {
        Row: {
          id: string;
          request_id: string;
          user_id: string | null;
          operation: AIOperationEnum;
          status: AIRequestStatusEnum;
          model: string;
          prompt_version: number;
          schema_version: string;
          latency_ms: number | null;
          error_message: string | null;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          request_id: string;
          user_id?: string | null;
          operation: AIOperationEnum;
          status?: AIRequestStatusEnum;
          model: string;
          prompt_version?: number;
          schema_version?: string;
          latency_ms?: number | null;
          error_message?: string | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          request_id?: string;
          user_id?: string | null;
          operation?: AIOperationEnum;
          status?: AIRequestStatusEnum;
          model?: string;
          prompt_version?: number;
          schema_version?: string;
          latency_ms?: number | null;
          error_message?: string | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Relationships: [];
      };
      ai_usage_logs: {
        Row: {
          id: string;
          request_id: string;
          user_id: string | null;
          operation: AIOperationEnum;
          model: string;
          status: AIRequestStatusEnum;
          latency_ms: number | null;
          input_tokens: number | null;
          output_tokens: number | null;
          estimated_cost: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          request_id: string;
          user_id?: string | null;
          operation: AIOperationEnum;
          model: string;
          status: AIRequestStatusEnum;
          latency_ms?: number | null;
          input_tokens?: number | null;
          output_tokens?: number | null;
          estimated_cost?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          request_id?: string;
          user_id?: string | null;
          operation?: AIOperationEnum;
          model?: string;
          status?: AIRequestStatusEnum;
          latency_ms?: number | null;
          input_tokens?: number | null;
          output_tokens?: number | null;
          estimated_cost?: number | null;
          created_at?: string;
        };
        Relationships: [];
      };
      ai_skill_gap_results: {
        Row: {
          id: string;
          student_id: string;
          attempt_id: string | null;
          target_role_id: string | null;
          target_role_title: string;
          provider: AIProviderTypeEnum;
          model: string;
          overall_score: number | null;
          strengths: Json;
          weaknesses: Json;
          skill_scores: Json;
          priority_skills: Json;
          diagnostic_summary: string;
          recommended_actions: Json;
          is_fallback: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          attempt_id?: string | null;
          target_role_id?: string | null;
          target_role_title: string;
          provider?: AIProviderTypeEnum;
          model: string;
          overall_score?: number | null;
          strengths?: Json;
          weaknesses?: Json;
          skill_scores?: Json;
          priority_skills?: Json;
          diagnostic_summary: string;
          recommended_actions?: Json;
          is_fallback?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          attempt_id?: string | null;
          target_role_id?: string | null;
          target_role_title?: string;
          provider?: AIProviderTypeEnum;
          model?: string;
          overall_score?: number | null;
          strengths?: Json;
          weaknesses?: Json;
          skill_scores?: Json;
          priority_skills?: Json;
          diagnostic_summary?: string;
          recommended_actions?: Json;
          is_fallback?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      ai_career_recommendations: {
        Row: {
          id: string;
          student_id: string;
          provider: AIProviderTypeEnum;
          model: string;
          recommended_roles: Json;
          is_fallback: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          provider?: AIProviderTypeEnum;
          model: string;
          recommended_roles?: Json;
          is_fallback?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          provider?: AIProviderTypeEnum;
          model?: string;
          recommended_roles?: Json;
          is_fallback?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      ai_learning_recommendations: {
        Row: {
          id: string;
          student_id: string;
          target_role_title: string;
          provider: AIProviderTypeEnum;
          model: string;
          milestones: Json;
          is_fallback: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          target_role_title: string;
          provider?: AIProviderTypeEnum;
          model: string;
          milestones?: Json;
          is_fallback?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          target_role_title?: string;
          provider?: AIProviderTypeEnum;
          model?: string;
          milestones?: Json;
          is_fallback?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      ai_opportunity_explanations: {
        Row: {
          id: string;
          student_id: string;
          opportunity_id: string;
          provider: AIProviderTypeEnum;
          model: string;
          overall_match_percentage: number;
          readiness_category: string;
          why_you_match: Json;
          missing_requirements: Json;
          recommended_actions: Json;
          application_advice: string | null;
          is_fallback: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          opportunity_id: string;
          provider?: AIProviderTypeEnum;
          model: string;
          overall_match_percentage: number;
          readiness_category: string;
          why_you_match?: Json;
          missing_requirements?: Json;
          recommended_actions?: Json;
          application_advice?: string | null;
          is_fallback?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          opportunity_id?: string;
          provider?: AIProviderTypeEnum;
          model?: string;
          overall_match_percentage?: number;
          readiness_category?: string;
          why_you_match?: Json;
          missing_requirements?: Json;
          recommended_actions?: Json;
          application_advice?: string | null;
          is_fallback?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      ai_candidate_summaries: {
        Row: {
          id: string;
          application_id: string;
          recruiter_id: string;
          provider: AIProviderTypeEnum;
          model: string;
          summary: string;
          strongest_evidence: Json;
          matching_skills: Json;
          missing_skills: Json;
          concerns: Json;
          interview_focus: Json;
          fit_recommendation: string;
          confidence: string;
          is_fallback: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          recruiter_id: string;
          provider?: AIProviderTypeEnum;
          model: string;
          summary: string;
          strongest_evidence?: Json;
          matching_skills?: Json;
          missing_skills?: Json;
          concerns?: Json;
          interview_focus?: Json;
          fit_recommendation: string;
          confidence?: string;
          is_fallback?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          recruiter_id?: string;
          provider?: AIProviderTypeEnum;
          model?: string;
          summary?: string;
          strongest_evidence?: Json;
          matching_skills?: Json;
          missing_skills?: Json;
          concerns?: Json;
          interview_focus?: Json;
          fit_recommendation?: string;
          confidence?: string;
          is_fallback?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      ai_resume_analyses: {
        Row: {
          id: string;
          student_id: string;
          target_role_title: string | null;
          provider: AIProviderTypeEnum;
          model: string;
          overall_score: number;
          ats_compatibility_score: number;
          strengths: Json;
          improvements: Json;
          keyword_matches: Json;
          missing_keywords: Json;
          summary: string;
          is_fallback: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          target_role_title?: string | null;
          provider?: AIProviderTypeEnum;
          model: string;
          overall_score?: number;
          ats_compatibility_score?: number;
          strengths?: Json;
          improvements?: Json;
          keyword_matches?: Json;
          missing_keywords?: Json;
          summary: string;
          is_fallback?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          target_role_title?: string | null;
          provider?: AIProviderTypeEnum;
          model?: string;
          overall_score?: number;
          ats_compatibility_score?: number;
          strengths?: Json;
          improvements?: Json;
          keyword_matches?: Json;
          missing_keywords?: Json;
          summary?: string;
          is_fallback?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      ai_portfolio_feedbacks: {
        Row: {
          id: string;
          student_id: string;
          provider: AIProviderTypeEnum;
          model: string;
          strengths: Json;
          weak_project_descriptions: Json;
          missing_evidence: Json;
          recommended_improvements: Json;
          project_evaluations: Json;
          summary: string;
          is_fallback: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          provider?: AIProviderTypeEnum;
          model: string;
          strengths?: Json;
          weak_project_descriptions?: Json;
          missing_evidence?: Json;
          recommended_improvements?: Json;
          project_evaluations?: Json;
          summary: string;
          is_fallback?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          provider?: AIProviderTypeEnum;
          model?: string;
          strengths?: Json;
          weak_project_descriptions?: Json;
          missing_evidence?: Json;
          recommended_improvements?: Json;
          project_evaluations?: Json;
          summary?: string;
          is_fallback?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      ai_interview_preparations: {
        Row: {
          id: string;
          student_id: string;
          target_role_title: string;
          opportunity_id: string | null;
          provider: AIProviderTypeEnum;
          model: string;
          focus_areas: Json;
          suggested_questions: Json;
          preparation_checklist: Json;
          practice_feedback: Json;
          is_fallback: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          target_role_title: string;
          opportunity_id?: string | null;
          provider?: AIProviderTypeEnum;
          model: string;
          focus_areas?: Json;
          suggested_questions?: Json;
          preparation_checklist?: Json;
          practice_feedback?: Json;
          is_fallback?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          target_role_title?: string;
          opportunity_id?: string | null;
          provider?: AIProviderTypeEnum;
          model?: string;
          focus_areas?: Json;
          suggested_questions?: Json;
          preparation_checklist?: Json;
          practice_feedback?: Json;
          is_fallback?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      ai_user_feedback: {
        Row: {
          id: string;
          user_id: string;
          request_id: string;
          operation: AIOperationEnum;
          is_helpful: boolean;
          reason: string | null;
          comments: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          request_id: string;
          operation: AIOperationEnum;
          is_helpful: boolean;
          reason?: string | null;
          comments?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          request_id?: string;
          operation?: AIOperationEnum;
          is_helpful?: boolean;
          reason?: string | null;
          comments?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: {
          check_user_id: string;
        };
        Returns: boolean;
      };
      save_student_onboarding: {
        Args: {
          payload: Json;
        };
        Returns: Json;
      };
      create_personalized_assessment: {
        Args: {
          p_student_id: string;
          p_config?: Json;
        };
        Returns: Json;
      };
      get_assessment_attempt_questions: {
        Args: {
          p_attempt_id: string;
        };
        Returns: Json;
      };
      submit_assessment_attempt: {
        Args: {
          p_attempt_id: string;
          p_answers?: Json;
          p_time_used_seconds?: number | null;
        };
        Returns: Json;
      };
      check_opportunity_eligibility: {
        Args: {
          p_student_id: string;
          p_opportunity_id: string;
        };
        Returns: Json;
      };
      calculate_opportunity_match: {
        Args: {
          p_student_id: string;
          p_opportunity_id: string;
        };
        Returns: Json;
      };
      publish_opportunity: {
        Args: {
          p_opportunity_id: string;
        };
        Returns: Json;
      };
      close_opportunity: {
        Args: {
          p_opportunity_id: string;
        };
        Returns: Json;
      };
      submit_application: {
        Args: {
          p_student_id: string;
          p_opportunity_id: string;
          p_answers?: Json;
        };
        Returns: Json;
      };
      transition_application_status: {
        Args: {
          p_application_id: string;
          p_to_status: string;
          p_reason?: string | null;
          p_metadata?: Json;
        };
        Returns: Json;
      };
      withdraw_application: {
        Args: {
          p_application_id: string;
          p_reason?: string | null;
        };
        Returns: Json;
      };
      schedule_interview: {
        Args: {
          p_application_id: string;
          p_data: Json;
        };
        Returns: Json;
      };
      submit_interview_feedback: {
        Args: {
          p_interview_id: string;
          p_data: Json;
        };
        Returns: Json;
      };
      create_and_send_offer: {
        Args: {
          p_application_id: string;
          p_data: Json;
        };
        Returns: Json;
      };
      respond_to_offer: {
        Args: {
          p_offer_id: string;
          p_response: string;
          p_reason?: string | null;
        };
        Returns: Json;
      };
      get_placement_timeline: {
        Args: {
          p_application_id: string;
        };
        Returns: Json;
      };
      is_company_member: {
        Args: {
          p_company_id: string;
          p_user_id: string;
        };
        Returns: boolean;
      };
      is_company_admin: {
        Args: {
          p_company_id: string;
          p_user_id: string;
        };
        Returns: boolean;
      };
      has_company_permission: {
        Args: {
          p_company_id: string;
          p_user_id: string;
          p_permission: string;
        };
        Returns: boolean;
      };
      get_company_profile: {
        Args: {
          p_company_id: string;
        };
        Returns: Json;
      };
      update_company_profile: {
        Args: {
          p_company_id: string;
          p_data: Json;
        };
        Returns: Json;
      };
      submit_company_verification: {
        Args: {
          p_company_id: string;
          p_notes?: string | null;
        };
        Returns: Json;
      };
      add_company_recruiter: {
        Args: {
          p_company_id: string;
          p_user_id: string;
          p_role?: string;
        };
        Returns: Json;
      };
      assign_opportunity_recruiter: {
        Args: {
          p_opportunity_id: string;
          p_user_id: string;
          p_role?: string;
        };
        Returns: Json;
      };
      get_company_recruitment_metrics: {
        Args: {
          p_company_id: string;
        };
        Returns: Json;
      };
      get_opportunity_performance: {
        Args: {
          p_opportunity_id: string;
        };
        Returns: Json;
      };
      record_ai_request_start: {
        Args: {
          p_request_id: string;
          p_user_id: string;
          p_operation: string;
          p_model: string;
          p_prompt_version?: number;
          p_schema_version?: string;
        };
        Returns: Json;
      };
      record_ai_request_complete: {
        Args: {
          p_request_id: string;
          p_status: string;
          p_latency_ms?: number | null;
          p_input_tokens?: number | null;
          p_output_tokens?: number | null;
          p_cost?: number | null;
          p_error_message?: string | null;
        };
        Returns: Json;
      };
      get_active_ai_prompt: {
        Args: {
          p_operation: string;
        };
        Returns: Json;
      };
      check_ai_rate_limit: {
        Args: {
          p_user_id: string;
          p_operation: string;
          p_max_requests_per_hour?: number;
        };
        Returns: Json;
      };
      get_user_ai_usage_summary: {
        Args: {
          p_user_id: string;
        };
        Returns: Json;
      };
      save_ai_skill_gap_result: {
        Args: {
          p_student_id: string;
          p_target_role_title: string;
          p_data: Json;
          p_attempt_id?: string | null;
          p_provider?: string;
          p_model?: string;
          p_is_fallback?: boolean;
        };
        Returns: Json;
      };
      get_latest_ai_skill_gap_result: {
        Args: {
          p_student_id: string;
        };
        Returns: Json;
      };
      save_ai_career_recommendations: {
        Args: {
          p_student_id: string;
          p_data: Json;
          p_provider?: string;
          p_model?: string;
          p_is_fallback?: boolean;
        };
        Returns: Json;
      };
      get_latest_ai_career_recommendations: {
        Args: {
          p_student_id: string;
        };
        Returns: Json;
      };
      save_ai_learning_recommendations: {
        Args: {
          p_student_id: string;
          p_target_role_title: string;
          p_data: Json;
          p_provider?: string;
          p_model?: string;
          p_is_fallback?: boolean;
        };
        Returns: Json;
      };
      get_latest_ai_learning_recommendations: {
        Args: {
          p_student_id: string;
        };
        Returns: Json;
      };
      save_ai_opportunity_explanation: {
        Args: {
          p_student_id: string;
          p_opportunity_id: string;
          p_data: Json;
          p_provider?: string;
          p_model?: string;
          p_is_fallback?: boolean;
        };
        Returns: Json;
      };
      get_latest_ai_opportunity_explanation: {
        Args: {
          p_student_id: string;
          p_opportunity_id: string;
        };
        Returns: Json;
      };
      save_ai_candidate_summary: {
        Args: {
          p_application_id: string;
          p_recruiter_id: string;
          p_data: Json;
          p_provider?: string;
          p_model?: string;
          p_is_fallback?: boolean;
        };
        Returns: Json;
      };
      get_latest_ai_candidate_summary: {
        Args: {
          p_application_id: string;
        };
        Returns: Json;
      };
      save_ai_resume_analysis: {
        Args: {
          p_student_id: string;
          p_data: Json;
          p_target_role_title?: string | null;
          p_provider?: string;
          p_model?: string;
          p_is_fallback?: boolean;
        };
        Returns: Json;
      };
      get_latest_ai_resume_analysis: {
        Args: {
          p_student_id: string;
        };
        Returns: Json;
      };
      save_ai_portfolio_feedback: {
        Args: {
          p_student_id: string;
          p_data: Json;
          p_provider?: string;
          p_model?: string;
          p_is_fallback?: boolean;
        };
        Returns: Json;
      };
      get_latest_ai_portfolio_feedback: {
        Args: {
          p_student_id: string;
        };
        Returns: Json;
      };
      save_ai_interview_preparation: {
        Args: {
          p_student_id: string;
          p_target_role_title: string;
          p_data: Json;
          p_opportunity_id?: string | null;
          p_provider?: string;
          p_model?: string;
          p_is_fallback?: boolean;
        };
        Returns: Json;
      };
      get_latest_ai_interview_preparation: {
        Args: {
          p_student_id: string;
          p_target_role_title: string;
        };
        Returns: Json;
      };
      submit_ai_user_feedback: {
        Args: {
          p_user_id: string;
          p_request_id: string;
          p_operation: string;
          p_is_helpful: boolean;
          p_reason?: string | null;
          p_comments?: string | null;
        };
        Returns: Json;
      };
      get_admin_ai_telemetry: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
    };
    Enums: {
      app_role: AppRole;
      organization_type: OrganizationType;
      organization_status: OrganizationStatus;
      membership_role: MembershipRole;
      skill_relation_type: SkillRelationType;
      skill_self_level: SkillSelfLevel;
      evidence_verification_status: EvidenceVerificationStatus;
      assessment_type: AssessmentType;
      assessment_mode: AssessmentModeEnum;
      question_difficulty: QuestionDifficulty;
      question_status: QuestionStatus;
      attempt_status: AttemptStatus;
      assessed_skill_status: AssessedSkillStatus;
      opportunity_type: OpportunityTypeEnum;
      opportunity_status: OpportunityStatusEnum;
      opportunity_work_mode: OpportunityWorkModeEnum;
      opportunity_experience_level: OpportunityExperienceLevelEnum;
      opportunity_skill_requirement_type: OpportunitySkillRequirementType;
      eligibility_rule_type: EligibilityRuleType;
      opportunity_match_category: OpportunityMatchCategoryEnum;
      company_verification_status: CompanyVerificationStatusEnum;
      recruiter_role: RecruiterRoleEnum;
      recruiter_permission: RecruiterPermissionEnum;
      opportunity_assignment_role: OpportunityAssignmentRoleEnum;
      ai_operation: AIOperationEnum;
      ai_request_status: AIRequestStatusEnum;
      ai_provider_type: AIProviderTypeEnum;
      ai_prompt_status: AIPromptStatusEnum;
    };
  };
}
