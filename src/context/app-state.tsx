import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  industryApplications as seedIndustryApplications,
  initialApplications,
  initialCandidates,
  initialConsultancyProjects,
  initialDepartmentReports,
  initialFacultyFDPs,
  initialFacultyInternships,
  initialFacultyTrainings,
  initialGuestLectures,
  initialInstitutionStudents,
  initialInterviews,
  initialRecruiterPartners,
  initialResearchProjects,
  initialStudentMentorships,
  initialTrainingPrograms,
  internships as seedInternships,
  jobs as jobsMock,
  careerRoles,
  mcqAssessmentQuestions,
  roadmapTemplate,
  studentProfile as seedProfile,
} from "@/data/mock";
import type {
  AcademicProfile,
  Achievement,
  Application,
  ApplicationStatus,
  AssessmentAttempt,
  AssessmentCategory,
  AssessmentResult,
  Candidate,
  CareerMatch,
  CareerPreferences,
  CareerReadinessScore,
  CareerRole,
  Certification,
  ConsultancyProject,
  DeclaredSkill,
  DepartmentReport,
  Education,
  FacultyFDP,
  FacultyInternship,
  FacultyTraining,
  GuestLectureSession,
  InstitutionStudent,
  Internship,
  InterviewSchedule,
  Job,
  MCQAssessmentQuestion,
  PersonalizedRoadmapItem,
  PipelineStage,
  Project,
  RecruiterPartner,
  ResearchProject,
  RoadmapItem,
  Role,
  Skill,
  SkillEvidenceItem,
  SkillGapDetail,
  SkillLevel,
  StudentMentorship,
  StudentProfile,
  TargetRoleAnalysis,
  TrainingProgram,
  WorkExperience,
  ApplicationSnapshot,
  Opportunity,
  OpportunityMatchResult,
  CompanyProfile,
  CompanyVerificationStatus,
  RecruiterAssessmentAssignment,
  InterviewFeedbackRecord,
  CorporateOffer,
  RecruiterNotificationEvent,
  OpportunityWorkMode,
  FacultyProfile,
  FacultyPublication,
  CollaborationRecord,
  CollaborationLifecycle,
  CollaborationOutcome,
  Permission,
  IAssessmentGenerator,
  ICareerRecommendationService,
  ISkillGapService,
  IResumeFeedbackService,
  Mentor,
  MentorshipRequest,
  MentorshipSession,
  MentorshipRequestStatus,
  MentorshipSessionMode,
  MentorshipOutcome,
  MentorshipStudentFeedback,
  PlacementHistoryItem,
  AdminUser,
  PlatformUserRecord,
  PlatformUserStatus,
  CompanyVerificationRecord,
  CompanyVerificationActionStatus,
  ModeratedOpportunityRecord,
  OpportunityModerationStatus,
  AdminAuditLogEntry,
  PlatformMetrics,
  SkillDefinition,
} from "@/types";
import type { PlatformNotification } from "@/services/notifications/notification-service";
import type {
  IStudentRepository,
  IAssessmentRepository,
  IOpportunityRepository,
  ISavedOpportunityRepository,
  IApplicationRepository,
  ICollaborationRepository,
} from "@/repositories";
import { readinessEngine } from "@/services/readiness/readiness-engine";
import { opportunityMatchingEngine } from "@/services/matching/matching-engine";
import { OPPORTUNITIES_CATALOG } from "@/data/opportunities-catalog";
import { INITIAL_RECRUITER_CANDIDATES } from "@/data/candidates-catalog";
import { DEFAULT_FACULTY_PROFILE, INITIAL_COLLABORATIONS } from "@/data/academician-catalog";
import { matchFacultyToOpportunity } from "@/utils/faculty-matching";
import { hasPermission } from "@/utils/permissions";
import { applicationLifecycle } from "@/services/application/application-lifecycle";
import { notificationService } from "@/services/notifications/notification-service";
import {
  studentRepository,
  assessmentRepository,
  opportunityRepository,
  savedOpportunityRepository,
  applicationRepository,
  companyRepository,
  mockStudentRepository,
  mockAssessmentRepository,
  mockOpportunityRepository,
  mockSavedOpportunityRepository,
  mockApplicationRepository,
  mockCompanyRepository,
  mockCollaborationRepository,
} from "@/repositories";
import {
  assessmentAIGenerator,
  careerAIService,
  skillGapAIService,
  learningAIService,
  opportunityAIService,
  recruiterAIService,
  resumeAIFeedbackService,
  portfolioAIService,
  interviewAIService,
  aiFeedbackService,
} from "@/services/ai-boundaries";
import {
  INITIAL_MENTORS,
  INITIAL_MENTORSHIP_REQUESTS,
  INITIAL_MENTORSHIP_SESSIONS,
  INITIAL_PLACEMENT_HISTORY,
} from "@/data/mentorship-catalog";
import {
  INITIAL_ADMIN_USER,
  INITIAL_PLATFORM_USERS,
  INITIAL_COMPANY_VERIFICATIONS,
  INITIAL_MODERATED_OPPORTUNITIES,
  INITIAL_ADMIN_AUDIT_LOGS,
} from "@/data/admin-catalog";
import { SKILLS_LIBRARY } from "@/data/skills-catalog";

interface AppState {
  isAuthenticated: boolean;
  authenticate: (role: Role) => void;
  logout: () => void;
  role: Role;
  setRole: (role: Role) => void;
  profile: StudentProfile;
  updateProfile: (patch: Partial<StudentProfile>) => void;

  // Projects CRUD
  addProject: (project: Omit<Project, "id"> | Project) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Skills CRUD
  addSkill: (skill: Skill) => void;
  updateSkill: (name: string, patch: Partial<Skill>) => void;
  deleteSkill: (name: string) => void;

  // Stage 1: Declared Skills & Evidence
  addDeclaredSkill: (skill: DeclaredSkill) => void;
  updateDeclaredSkill: (skillIdOrName: string, patch: Partial<DeclaredSkill>) => void;
  removeDeclaredSkill: (skillIdOrName: string) => void;
  setDeclaredSkills: (skills: DeclaredSkill[]) => void;
  addSkillEvidence: (skillIdOrName: string, evidence: Omit<SkillEvidenceItem, "id">) => void;
  removeSkillEvidence: (skillIdOrName: string, evidenceId: string) => void;

  // Stage 1: Academic & Career Preferences
  updateAcademicProfile: (academic: Partial<AcademicProfile>) => void;
  updateCareerPreferences: (preferences: Partial<CareerPreferences>) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;

  // Certificates CRUD
  addCertificate: (certificate: Omit<Certification, "id"> | Certification) => void;
  updateCertificate: (id: string, patch: Partial<Certification>) => void;
  deleteCertificate: (id: string) => void;

  // Achievements CRUD
  addAchievement: (achievement: Omit<Achievement, "id"> | Achievement) => void;
  updateAchievement: (id: string, patch: Partial<Achievement>) => void;
  deleteAchievement: (id: string) => void;

  // Experience CRUD
  addExperience: (experience: Omit<WorkExperience, "id"> | WorkExperience) => void;
  updateExperience: (id: string, patch: Partial<WorkExperience>) => void;
  deleteExperience: (id: string) => void;

  // Education CRUD
  addEducation: (education: Omit<Education, "id"> | Education) => void;
  updateEducation: (id: string, patch: Partial<Education>) => void;
  deleteEducation: (id: string) => void;

  // Resume Template
  resumeTemplate: "modern" | "professional" | "minimal";
  setResumeTemplate: (template: "modern" | "professional" | "minimal") => void;

  // Company Profile
  companyProfile: CompanyProfile;
  updateCompanyProfile: (patch: Partial<CompanyProfile>) => void;

  internships: Internship[];
  addInternship: (internship: Internship) => void;
  updateInternship: (id: string, patch: Partial<Internship>) => void;
  deleteInternship: (id: string) => void;

  jobs: Job[];
  addJob: (job: Job) => void;
  updateJob: (id: string, patch: Partial<Job>) => void;
  deleteJob: (id: string) => void;

  applications: Application[];
  applyTo: (internship: Internship) => boolean;
  advanceApplication: (id: string) => void;
  hasApplied: (id: string) => boolean;

  industryApps: Application[];
  setIndustryStatus: (id: string, status: ApplicationStatus) => void;
  candidates: Candidate[];
  toggleShortlist: (id: string) => boolean;
  shortlistCandidate: (candidateIdOrName: string, applicationId?: string) => void;
  rejectCandidate: (candidateIdOrName: string, applicationId?: string) => void;
  setCandidateStatus: (
    candidateIdOrName: string,
    status: ApplicationStatus,
    applicationId?: string,
  ) => void;

  // Interviews & Hiring Pipeline
  interviews: InterviewSchedule[];
  scheduleInterview: (candidateIdOrName: string, details: Partial<InterviewSchedule>) => void;
  updateInterviewStage: (interviewId: string, stage: PipelineStage, notes?: string) => void;
  completeInterview: (interviewId: string, feedback: string, score: number) => void;
  sendOffer: (
    interviewId: string,
    offerDetails: NonNullable<InterviewSchedule["offerDetails"]>,
  ) => void;
  hireCandidate: (candidateIdOrName: string, interviewId?: string) => void;

  // Training Programs
  trainingPrograms: TrainingProgram[];
  addTrainingProgram: (program: TrainingProgram) => void;
  updateTrainingProgram: (id: string, patch: Partial<TrainingProgram>) => void;
  deleteTrainingProgram: (id: string) => void;

  // Academician State & Actions
  facultyProfile: FacultyProfile;
  updateFacultyProfile: (patch: Partial<FacultyProfile>) => void;
  addFacultyPublication: (pub: Omit<FacultyPublication, "id">) => void;
  removeFacultyPublication: (id: string) => void;
  addFacultyExpertise: (item: string) => void;
  removeFacultyExpertise: (item: string) => void;
  addFacultyResearchInterest: (item: string) => void;
  removeFacultyResearchInterest: (item: string) => void;

  facultyInternships: FacultyInternship[];
  applyFacultyInternship: (id: string) => void;

  facultyTrainings: FacultyTraining[];
  registerFacultyTraining: (id: string) => void;
  cancelFacultyTraining: (id: string) => void;
  updateTrainingProgress: (id: string, progress: number) => void;

  facultyFDPs: FacultyFDP[];
  registerFacultyFDP: (id: string) => void;

  consultancyProjects: ConsultancyProject[];
  applyConsultancy: (id: string) => void;

  researchProjects: ResearchProject[];
  applyResearchProject: (id: string) => void;

  guestLectures: GuestLectureSession[];
  respondGuestLecture: (id: string, status: "Accepted" | "Declined") => void;
  scheduleGuestLecture: (lecture: GuestLectureSession) => void;

  studentMentorships: StudentMentorship[];
  scheduleMentorshipMeeting: (mentorshipId: string, date: string, mode: string) => void;
  addMentorshipNote: (mentorshipId: string, note: string) => void;
  recordMentorshipSession: (
    mentorshipId: string,
    session: { date: string; summary: string; actionItems: string },
  ) => void;

  // Collaborations Hub
  collaborations: CollaborationRecord[];
  proposeCollaboration: (collab: Omit<CollaborationRecord, "id">) => CollaborationRecord;
  updateCollaborationStatus: (id: string, status: CollaborationLifecycle) => void;
  recordCollaborationOutcome: (id: string, outcome: CollaborationOutcome) => void;

  // Institution State & Actions
  institutionStudents: InstitutionStudent[];
  updateInstitutionStudent: (id: string, patch: Partial<InstitutionStudent>) => void;
  departmentReports: DepartmentReport[];
  recruiterPartners: RecruiterPartner[];
  addRecruiterPartner: (partner: RecruiterPartner) => void;
  updateRecruiterPartner: (id: string, patch: Partial<RecruiterPartner>) => void;

  // Stage 6: Aggregated Institution & Industry Demand Intelligence
  industrySkillDemand: {
    skill: string;
    demandCount: number;
    trend: "rising" | "stable" | "high";
    relatedRoles: string[];
  }[];
  skillDemandVsSupply: {
    skill: string;
    industryDemandScore: number;
    studentProficiencyScore: number;
    gap: number;
    status: "Surplus" | "Balanced" | "Critical Gap" | "Moderate Gap";
  }[];
  institutionKPIs: {
    totalStudents: number;
    placementRate: number;
    internshipReach: number;
    avgEmployability: number;
    activeRecruiters: number;
    facultyEngagements: number;
    activeCollaborations: number;
  };
  answers: Record<string, number>;
  setAnswer: (questionId: string, answer: number) => void;
  resetAnswers: () => void;
  // Stage 2: Adaptive Assessment History
  assessmentAttempts: AssessmentAttempt[];
  latestAssessmentResult: AssessmentAttempt | null;
  saveAssessmentAttempt: (attempt: AssessmentAttempt) => void;
  clearAssessmentHistory: () => void;

  // Stage 3: Career Readiness & Dynamic Roadmap
  careerReadiness: CareerReadinessScore;
  targetRoleAnalyses: TargetRoleAnalysis[];
  skillGaps: SkillGapDetail[];
  dynamicRoadmapItems: PersonalizedRoadmapItem[];
  updateRoadmapProgress: (itemId: string, progress: number, completed?: boolean) => void;
  toggleRoadmapModule: (itemId: string, moduleId: string) => void;
  completeRoadmapItem: (itemId: string) => void;

  assessmentSubmitted: boolean;
  assessmentScores: { technical: number; softSkills: number; employability: number } | null;
  submitAssessment: (scores: {
    technical: number;
    softSkills: number;
    employability: number;
  }) => void;
  assessmentResult: AssessmentResult | null;
  careerMatches: CareerMatch[];
  roadmapItems: RoadmapItem[];
  savedInternships: string[];
  savedJobs: string[];
  opportunityApplications: Map<string, Application>;
  submitFullAssessment: (answers: Record<string, number>) => AssessmentResult;
  computeCareerMatches: () => CareerMatch[];
  saveInternship: (id: string) => void;
  unsaveInternship: (id: string) => void;
  isInternshipSaved: (id: string) => boolean;
  saveJob: (id: string) => void;
  unsaveJob: (id: string) => void;
  isJobSaved: (id: string) => boolean;
  applyToInternship: (id: string) => boolean;
  applyToJob: (id: string) => boolean;
  updateRoadmapItem: (
    id: string,
    patch: { progress?: number; completed?: boolean },
  ) => RoadmapItem | undefined;
  getRoadmapCompletion: () => number;

  // Stage 4: Opportunity Intelligence
  opportunities: Opportunity[];
  savedOpportunityIds: string[];
  toggleSaveOpportunity: (id: string) => void;
  isOpportunitySaved: (id: string) => boolean;
  applyToOpportunity: (
    opportunity: Opportunity,
    answers?: Record<string, string>,
  ) => ApplicationSnapshot | null;
  applicationSnapshots: ApplicationSnapshot[];
  getOpportunityMatch: (opportunityId: string) => OpportunityMatchResult | null;
  rankedOpportunities: { opportunity: Opportunity; match: OpportunityMatchResult }[];
  recommendedOpportunities: { opportunity: Opportunity; match: OpportunityMatchResult }[];
  bestMatchOpportunities: { opportunity: Opportunity; match: OpportunityMatchResult }[];
  quickWinOpportunities: { opportunity: Opportunity; match: OpportunityMatchResult }[];
  skillBuildingOpportunities: { opportunity: Opportunity; match: OpportunityMatchResult }[];
  liveProjectOpportunities: { opportunity: Opportunity; match: OpportunityMatchResult }[];
  trainingOpportunities: { opportunity: Opportunity; match: OpportunityMatchResult }[];

  // Stage 5: Industry Recruitment & Candidate Decision Intelligence
  setCompanyVerificationStatus: (status: CompanyVerificationStatus) => void;
  addCorporateOpportunity: (opp: Partial<Opportunity>) => Opportunity;
  updateCorporateOpportunity: (id: string, patch: Partial<Opportunity>) => void;
  deleteCorporateOpportunity: (id: string) => void;
  publishCorporateOpportunity: (id: string) => void;
  closeCorporateOpportunity: (id: string) => void;
  setCandidateApplicationStatus: (
    candidateIdOrAppId: string,
    status: ApplicationStatus,
    metadata?: { nextStep?: string; interviewDetails?: any },
  ) => void;
  bulkShortlistCandidates: (applicationIds: string[]) => void;
  assignRecruiterAssessment: (
    applicationId: string,
    assessment: {
      type: "Technical" | "Skill-Specific" | "Custom";
      assessmentTitle: string;
      durationMinutes: number;
      deadline: string;
    },
  ) => void;
  recruiterAssessmentAssignments: RecruiterAssessmentAssignment[];
  scheduleRecruiterInterview: (
    applicationId: string,
    interviewData: Partial<InterviewSchedule>,
  ) => void;
  submitInterviewFeedback: (
    interviewId: string,
    feedback: {
      ratings: {
        technical: number;
        problemSolving: number;
        communication: number;
        teamwork: number;
        roleFit: number;
      };
      strengths: string[];
      concerns: string[];
      notes: string;
      recommendation: "Strong Hire" | "Hire" | "Hold" | "No Hire";
      submittedBy: string;
    },
  ) => void;
  interviewFeedbackRecords: InterviewFeedbackRecord[];
  createAndSendOffer: (
    applicationId: string,
    offerData: {
      designation: string;
      compensation: string;
      joiningDate: string;
      workMode?: OpportunityWorkMode;
      location?: string;
      offerExpiry?: string;
      terms?: string;
    },
  ) => CorporateOffer | null;
  respondToOffer: (offerIdOrAppId: string, response: "Accepted" | "Declined") => void;
  corporateOffers: CorporateOffer[];
  recruiterNotifications: RecruiterNotificationEvent[];
  markRecruiterNotificationRead: (id: string) => void;
  recruiterKPIs: {
    activeOpportunities: number;
    totalApplicants: number;
    underReviewCount: number;
    shortlistedCount: number;
    assessmentCount: number;
    interviewsCount: number;
    offersCount: number;
    hiresCount: number;
    rejectedCount: number;
    shortlistRate: number;
    interviewConversion: number;
    offerConversion: number;
    hiringConversion: number;
  };

  // Stage 7: Permission & Repository Access
  checkPermission: (permission: Permission) => boolean;
  studentRepo: IStudentRepository;
  assessmentRepo: IAssessmentRepository;
  opportunityRepo: IOpportunityRepository;
  savedOpportunityRepo: ISavedOpportunityRepository;
  applicationRepo: IApplicationRepository;
  collaborationRepo: ICollaborationRepository;

  // Stage 7: AI Service Boundaries
  aiAssessmentGenerator: IAssessmentGenerator;
  aiCareerService: ICareerRecommendationService;
  aiSkillGapService: ISkillGapService;
  aiResumeService: IResumeFeedbackService;

  // Stage 7: Unified Platform Notifications
  platformNotifications: PlatformNotification[];
  pushPlatformNotification: (
    notif: Omit<PlatformNotification, "id" | "timestamp" | "read">,
  ) => PlatformNotification;
  markPlatformNotificationRead: (id: string) => void;

  // Mentor Scheduling
  mentors: Mentor[];
  mentorshipRequests: MentorshipRequest[];
  mentorshipSessions: MentorshipSession[];
  requestMentorship: (
    mentorId: string,
    params: {
      purpose: string;
      preferredDate: string;
      preferredTime: string;
      notes?: string | undefined;
    },
  ) => MentorshipRequest | null;
  updateMentorshipRequestStatus: (
    requestId: string,
    status: MentorshipRequestStatus,
    notes?: string | undefined,
    rescheduleData?: { date: string; time: string } | undefined,
  ) => void;
  scheduleMentorshipSession: (
    requestId: string,
    sessionData: {
      date: string;
      startTime: string;
      endTime: string;
      mode: MentorshipSessionMode;
      meetingLink?: string | undefined;
      location?: string | undefined;
      purpose?: string | undefined;
    },
  ) => MentorshipSession | null;
  completeMentorshipSession: (
    sessionId: string,
    outcome: { topicsDiscussed: string[]; followUpRecommendations: string[]; summary: string },
    mentorNotes?: string | undefined,
  ) => void;
  cancelMentorshipSession: (sessionId: string, reason?: string | undefined) => void;
  submitMentorshipStudentFeedback: (
    sessionId: string,
    feedback: {
      rating: number;
      helpfulness: "Extremely Helpful" | "Very Helpful" | "Moderately Helpful" | "Slightly Helpful";
      comment: string;
    },
  ) => void;

  // Placement Timeline & History
  placementHistory: PlacementHistoryItem[];
  acceptCorporateOfferAndHire: (offerIdOrAppId: string) => void;
  declineCorporateOffer: (offerIdOrAppId: string, reason?: string | undefined) => void;

  // Platform Admin Panel
  isAdminAuthenticated: boolean;
  adminUser: AdminUser | null;
  authenticateAdmin: (email?: string | undefined, password?: string | undefined) => boolean;
  logoutAdmin: () => void;
  platformUsers: PlatformUserRecord[];
  companyVerifications: CompanyVerificationRecord[];
  moderatedOpportunities: ModeratedOpportunityRecord[];
  adminAuditLogs: AdminAuditLogEntry[];
  logAdminAction: (
    action: string,
    entity: "User" | "Company" | "Institution" | "Skill" | "Opportunity" | "System",
    entityId: string,
    details: string,
  ) => void;
  togglePlatformUserStatus: (userId: string, status: PlatformUserStatus) => void;
  verifyCompanyByAdmin: (
    companyId: string,
    status: CompanyVerificationActionStatus,
    notes?: string | undefined,
  ) => void;
  moderateOpportunityByAdmin: (
    opportunityId: string,
    status: OpportunityModerationStatus,
    notes?: string | undefined,
  ) => void;
  platformSkills: SkillDefinition[];
  addSkillByAdmin: (skill: Omit<SkillDefinition, "id">) => SkillDefinition;
  updateSkillByAdmin: (id: string, patch: Partial<SkillDefinition>) => void;
  toggleSkillActiveByAdmin: (id: string) => void;
  platformMetrics: PlatformMetrics;
}

const AppStateContext = createContext<AppState | null>(null);

const today = () =>
  new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

const TECHNICAL_CATEGORIES: AssessmentCategory[] = [
  "Programming",
  "Problem Solving",
  "Analytical Thinking",
  "Domain Knowledge",
];

const SOFT_CATEGORIES: AssessmentCategory[] = ["Communication", "Teamwork", "Leadership"];

const ALL_CATEGORIES: AssessmentCategory[] = [...TECHNICAL_CATEGORIES, ...SOFT_CATEGORIES];

const TECHNICAL_WEIGHT = 0.6;
const SOFT_WEIGHT = 0.4;

const avg = (nums: number[]): number => {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
};

const clamp = (n: number, min = 0, max = 100): number => Math.max(min, Math.min(max, n));

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = window.localStorage.getItem(key);
    if (item !== null && item !== "undefined") {
      const parsed = JSON.parse(item);
      if (typeof fallback === "object" && fallback !== null && !Array.isArray(fallback)) {
        return { ...fallback, ...parsed };
      }
      return parsed;
    }
  } catch (e) {
    console.error(`Failed to load ${key} from localStorage:`, e);
  }
  return fallback;
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save ${key} to localStorage:`, e);
  }
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<Role>("student");
  const [profile, setProfile] = useState<StudentProfile>(() =>
    loadFromStorage("acadin_student_profile", seedProfile),
  );
  const [internships, setInternships] = useState<Internship[]>(seedInternships);
  const [applications, setApplications] = useState<Application[]>(() =>
    loadFromStorage(
      "acadin_applications",
      INITIAL_RECRUITER_CANDIDATES.slice(0, 2).map((r) => r.application),
    ),
    loadFromStorage("acadin_applications", []),
  );
  const [industryApps, setIndustryApps] = useState<Application[]>(() =>
    loadFromStorage(
      "acadin_industry_apps",
      INITIAL_RECRUITER_CANDIDATES.map((r) => r.application),
    ),
    loadFromStorage("acadin_industry_apps", []),
  );
  const [candidates, setCandidates] = useState<Candidate[]>(
    INITIAL_RECRUITER_CANDIDATES.map((r) => r.candidate),
  const [candidates, setCandidates] = useState<Candidate[]>(() =>
    loadFromStorage("acadin_candidates", []),
  );
  const [interviews, setInterviews] = useState<InterviewSchedule[]>(initialInterviews);
  const [interviews, setInterviews] = useState<InterviewSchedule[]>(() =>
    loadFromStorage("acadin_interviews", []),
  );
  const [trainingPrograms, setTrainingPrograms] =
    useState<TrainingProgram[]>(initialTrainingPrograms);
  const [facultyProfile, setFacultyProfile] = useState<FacultyProfile>(() =>
    loadFromStorage("acadin_faculty_profile", DEFAULT_FACULTY_PROFILE),
  );
  const [collaborations, setCollaborations] = useState<CollaborationRecord[]>(INITIAL_COLLABORATIONS);
  const [facultyInternships, setFacultyInternships] =
    useState<FacultyInternship[]>(initialFacultyInternships);
  const [facultyTrainings, setFacultyTrainings] =
    useState<FacultyTraining[]>(initialFacultyTrainings);
  const [facultyFDPs, setFacultyFDPs] = useState<FacultyFDP[]>(initialFacultyFDPs);
  const [consultancyProjects, setConsultancyProjects] = useState<ConsultancyProject[]>(
    initialConsultancyProjects,
  const [collaborations, setCollaborations] = useState<CollaborationRecord[]>(() =>
    loadFromStorage("acadin_collaborations", []),
  );
  const [researchProjects, setResearchProjects] =
    useState<ResearchProject[]>(initialResearchProjects);
  const [guestLectures, setGuestLectures] = useState<GuestLectureSession[]>(initialGuestLectures);
  const [studentMentorships, setStudentMentorships] =
    useState<StudentMentorship[]>(initialStudentMentorships);
  const [institutionStudents, setInstitutionStudents] = useState<InstitutionStudent[]>(
    initialInstitutionStudents,
  const [facultyInternships, setFacultyInternships] = useState<FacultyInternship[]>(() =>
    loadFromStorage("acadin_faculty_internships", []),
  );
  const [facultyTrainings, setFacultyTrainings] = useState<FacultyTraining[]>(() =>
    loadFromStorage("acadin_faculty_trainings", []),
  );
  const [facultyFDPs, setFacultyFDPs] = useState<FacultyFDP[]>(() =>
    loadFromStorage("acadin_faculty_fdps", []),
  );
  const [consultancyProjects, setConsultancyProjects] = useState<ConsultancyProject[]>(() =>
    loadFromStorage("acadin_consultancy_projects", []),
  );
  const [researchProjects, setResearchProjects] = useState<ResearchProject[]>(() =>
    loadFromStorage("acadin_research_projects", []),
  );
  const [guestLectures, setGuestLectures] = useState<GuestLectureSession[]>(() =>
    loadFromStorage("acadin_guest_lectures", []),
  );
  const [studentMentorships, setStudentMentorships] = useState<StudentMentorship[]>(() =>
    loadFromStorage("acadin_student_mentorships", []),
  );
  const [institutionStudents, setInstitutionStudents] = useState<InstitutionStudent[]>(() =>
    loadFromStorage("acadin_institution_students", []),
  );
  const [departmentReports, setDepartmentReports] =
    useState<DepartmentReport[]>(initialDepartmentReports);
  const [recruiterPartners, setRecruiterPartners] =
    useState<RecruiterPartner[]>(initialRecruiterPartners);
  const [platformNotifications, setPlatformNotifications] = useState<PlatformNotification[]>([
    {
      id: "notif-p-01",
      recipientRole: "all",
      type: "collaboration_updated",
      title: "New Academia–Industry Project Launched",
      message: "Razorpay & NITK launched the Next-Gen UPI Fast-Checkout research lab.",
      timestamp: "24 Aug 2026",
      read: false,
    },
    {
      id: "notif-p-02",
      recipientRole: "student",
      type: "new_recommendation",
      title: "High-Fit Opportunity Matched",
      message: "Razorpay Frontend Engineering Intern matches your profile with a 94% fit.",
      timestamp: "25 Aug 2026",
      read: false,
    },
  ]);
  const [platformNotifications, setPlatformNotifications] = useState<PlatformNotification[]>(() =>
    loadFromStorage("acadin_platform_notifications", []),
  );

  // Mentorship State
  const [mentors, setMentors] = useState<Mentor[]>(INITIAL_MENTORS);
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>(() =>
    loadFromStorage("acadin_mentorship_requests", INITIAL_MENTORSHIP_REQUESTS),
  );
  const [mentorshipSessions, setMentorshipSessions] = useState<MentorshipSession[]>(() =>
    loadFromStorage("acadin_mentorship_sessions", INITIAL_MENTORSHIP_SESSIONS),
  );

  // Placement History State
  const [placementHistory, setPlacementHistory] = useState<PlacementHistoryItem[]>(() =>
    loadFromStorage("acadin_placement_history", INITIAL_PLACEMENT_HISTORY),
  );

  // Platform Admin State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(true);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(INITIAL_ADMIN_USER);
  const [platformUsers, setPlatformUsers] = useState<PlatformUserRecord[]>(INITIAL_PLATFORM_USERS);
  const [companyVerifications, setCompanyVerifications] = useState<CompanyVerificationRecord[]>(
    INITIAL_COMPANY_VERIFICATIONS,
  );
  const [moderatedOpportunities, setModeratedOpportunities] = useState<ModeratedOpportunityRecord[]>(
    INITIAL_MODERATED_OPPORTUNITIES,
  );
  const [adminAuditLogs, setAdminAuditLogs] = useState<AdminAuditLogEntry[]>(
    INITIAL_ADMIN_AUDIT_LOGS,
  );
  const [platformSkills, setPlatformSkills] = useState<SkillDefinition[]>(SKILLS_LIBRARY);

  const checkPermission = useCallback(
    (permission: Permission) => {
      return hasPermission(role, permission);
    },
    [role],
  );

  const pushPlatformNotification = useCallback(
    (notif: Omit<PlatformNotification, "id" | "timestamp" | "read">) => {
      const event = notificationService.createEvent(notif);
      setPlatformNotifications((prev) => [event, ...prev]);
      return event;
    },
    [],
  );

  const markPlatformNotificationRead = useCallback((id: string) => {
    setPlatformNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);
  const [answers, setAnswers] = useState<Record<string, number>>(() =>
    loadFromStorage("acadin_assessment_answers", {}),
  );
  const [assessmentSubmitted, setAssessmentSubmitted] = useState<boolean>(() =>
    loadFromStorage("acadin_assessment_submitted", false),
  );
  const [assessmentScores, setAssessmentScores] = useState<AppState["assessmentScores"]>(() =>
    loadFromStorage("acadin_assessment_scores", null),
  );
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(() =>
    loadFromStorage("acadin_assessment_result", null),
  );
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>(roadmapTemplate);
  const [savedInternships, setSavedInternships] = useState<string[]>(() =>
    loadFromStorage("acadin_saved_internships", []),
  );
  const [savedJobs, setSavedJobs] = useState<string[]>(() =>
    loadFromStorage("acadin_saved_jobs", []),
  );
  const [jobs, setJobs] = useState<Job[]>(jobsMock);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(() =>
    loadFromStorage("acadin_company_profile", {
      name: "Tata Consultancy Services (TCS)",
      industry: "Enterprise Digital Platforms & IT Consulting",
      location: "Bengaluru, Karnataka",
      logoHue: 220,
      description:
        "Global leader in IT services, digital and business solutions partnering with clients to simplify, strengthen and transform their businesses.",
      website: "https://www.tcs.com",
      companySize: "10,000+ Employees",
      foundedYear: "1968",
      verificationStatus: "Verified",
    }),
  );

  const updateCompanyProfile = useCallback(
    (patch: Partial<CompanyProfile>) => {
      setCompanyProfile((prev) => ({ ...prev, ...patch }));
      companyRepository.updateProfile(companyProfile.name, patch).catch(console.error);
    },
    [companyProfile.name],
  );

  const setCompanyVerificationStatus = useCallback(
    (status: CompanyVerificationStatus) => {
      setCompanyProfile((prev) => ({ ...prev, verificationStatus: status }));
      if (status === "Pending") {
        companyRepository.submitVerification(companyProfile.name).catch(console.error);
      }
    },
    [companyProfile.name],
  );

  const [resumeTemplate, setResumeTemplate] = useState<"modern" | "professional" | "minimal">(
    "modern",
  );

  const updateProfile = useCallback((patch: Partial<StudentProfile>) => {
    setProfile((p) => ({ ...p, ...patch }));
  }, []);

  // Project CRUD
  const addProject = useCallback((projectData: Omit<Project, "id"> | Project) => {
    setProfile((prev) => {
      const newProject: Project = {
        ...projectData,
        id: "id" in projectData && projectData.id ? projectData.id : `proj-${Date.now()}`,
      };
      return {
        ...prev,
        projects: [newProject, ...prev.projects],
      };
    });
  }, []);

  const updateProject = useCallback((id: string, patch: Partial<Project>) => {
    setProfile((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProfile((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  }, []);

  // Skill CRUD
  const addSkill = useCallback((skill: Skill) => {
    setProfile((prev) => {
      if (prev.skills.some((s) => s.name.toLowerCase() === skill.name.toLowerCase())) {
        return {
          ...prev,
          skills: prev.skills.map((s) =>
            s.name.toLowerCase() === skill.name.toLowerCase() ? { ...s, score: skill.score } : s,
          ),
        };
      }
      return {
        ...prev,
        skills: [...prev.skills, skill],
      };
    });
  }, []);

  const updateSkill = useCallback((name: string, patch: Partial<Skill>) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.map((s) =>
        s.name.toLowerCase() === name.toLowerCase() ? { ...s, ...patch } : s,
      ),
    }));
  }, []);

  const deleteSkill = useCallback((name: string) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.name.toLowerCase() !== name.toLowerCase()),
      declaredSkills: prev.declaredSkills?.filter(
        (s) => s.name.toLowerCase() !== name.toLowerCase(),
      ),
    }));
  }, []);

  // Stage 1: Declared Skills & Evidence CRUD
  const addDeclaredSkill = useCallback((declared: DeclaredSkill) => {
    setProfile((prev) => {
      const existing = prev.declaredSkills ?? [];
      const updatedDeclared = existing.some(
        (s) =>
          s.skillId === declared.skillId || s.name.toLowerCase() === declared.name.toLowerCase(),
      )
        ? existing.map((s) =>
            s.skillId === declared.skillId || s.name.toLowerCase() === declared.name.toLowerCase()
              ? declared
              : s,
          )
        : [...existing, declared];

      const legacySkill: Skill = { name: declared.name, score: declared.proficiencyLevel };
      const updatedLegacy = prev.skills.some(
        (s) => s.name.toLowerCase() === declared.name.toLowerCase(),
      )
        ? prev.skills.map((s) =>
            s.name.toLowerCase() === declared.name.toLowerCase() ? legacySkill : s,
          )
        : [...prev.skills, legacySkill];

      return {
        ...prev,
        declaredSkills: updatedDeclared,
        skills: updatedLegacy,
      };
    });
  }, []);

  const updateDeclaredSkill = useCallback(
    (skillIdOrName: string, patch: Partial<DeclaredSkill>) => {
      setProfile((prev) => {
        const existing = prev.declaredSkills ?? [];
        const updatedDeclared = existing.map((s) => {
          if (
            s.id === skillIdOrName ||
            s.skillId === skillIdOrName ||
            s.name.toLowerCase() === skillIdOrName.toLowerCase()
          ) {
            const merged = { ...s, ...patch };
            if (patch.proficiency && !patch.proficiencyLevel) {
              merged.proficiencyLevel =
                patch.proficiency === "advanced"
                  ? 85
                  : patch.proficiency === "intermediate"
                    ? 65
                    : 45;
            }
            return merged;
          }
          return s;
        });

        return {
          ...prev,
          declaredSkills: updatedDeclared,
        };
      });
    },
    [],
  );

  const removeDeclaredSkill = useCallback((skillIdOrName: string) => {
    setProfile((prev) => {
      const existing = prev.declaredSkills ?? [];
      const updatedDeclared = existing.filter(
        (s) =>
          s.id !== skillIdOrName &&
          s.skillId !== skillIdOrName &&
          s.name.toLowerCase() !== skillIdOrName.toLowerCase(),
      );
      const updatedLegacy = prev.skills.filter(
        (s) => s.name.toLowerCase() !== skillIdOrName.toLowerCase(),
      );

      return {
        ...prev,
        declaredSkills: updatedDeclared,
        skills: updatedLegacy,
      };
    });
  }, []);

  const setDeclaredSkills = useCallback((skills: DeclaredSkill[]) => {
    setProfile((prev) => ({
      ...prev,
      declaredSkills: skills,
      skills: skills.map((s) => ({ name: s.name, score: s.proficiencyLevel })),
    }));
  }, []);

  const addSkillEvidence = useCallback(
    (skillIdOrName: string, evidenceData: Omit<SkillEvidenceItem, "id">) => {
      setProfile((prev) => {
        const existing = prev.declaredSkills ?? [];
        const newEvidence: SkillEvidenceItem = {
          ...evidenceData,
          id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        };

        const updatedDeclared = existing.map((s) => {
          if (
            s.id === skillIdOrName ||
            s.skillId === skillIdOrName ||
            s.name.toLowerCase() === skillIdOrName.toLowerCase()
          ) {
            return {
              ...s,
              verificationStatus: "evidence_added" as const,
              evidence: [...s.evidence, newEvidence],
            };
          }
          return s;
        });

        return {
          ...prev,
          declaredSkills: updatedDeclared,
        };
      });
    },
    [],
  );

  const removeSkillEvidence = useCallback((skillIdOrName: string, evidenceId: string) => {
    setProfile((prev) => {
      const existing = prev.declaredSkills ?? [];
      const updatedDeclared = existing.map((s) => {
        if (
          s.id === skillIdOrName ||
          s.skillId === skillIdOrName ||
          s.name.toLowerCase() === skillIdOrName.toLowerCase()
        ) {
          const filteredEvidence = s.evidence.filter((e) => e.id !== evidenceId);
          return {
            ...s,
            verificationStatus:
              filteredEvidence.length > 0
                ? ("evidence_added" as const)
                : ("self_declared" as const),
            evidence: filteredEvidence,
          };
        }
        return s;
      });

      return {
        ...prev,
        declaredSkills: updatedDeclared,
      };
    });
  }, []);

  const updateAcademicProfile = useCallback((academic: Partial<AcademicProfile>) => {
    setProfile((prev) => ({
      ...prev,
      college: academic.institution || prev.college,
      degree: academic.degree || prev.degree,
      branch: academic.program || prev.branch,
      year: academic.currentYear || prev.year,
      academicProfile: {
        institution: academic.institution || prev.academicProfile?.institution || prev.college,
        degree: academic.degree || prev.academicProfile?.degree || prev.degree,
        program: academic.program || prev.academicProfile?.program || prev.branch,
        department: academic.department || prev.academicProfile?.department || "",
        currentYear: academic.currentYear || prev.academicProfile?.currentYear || prev.year,
        graduationYear: academic.graduationYear || prev.academicProfile?.graduationYear || "2026",
        academicStatus:
          academic.academicStatus || prev.academicProfile?.academicStatus || "Pursuing Full-Time",
        grade: academic.grade || prev.academicProfile?.grade || "",
      },
    }));
  }, []);

  const updateCareerPreferences = useCallback((preferences: Partial<CareerPreferences>) => {
    setProfile((prev) => ({
      ...prev,
      interests: preferences.careerInterests || prev.interests,
      careerPreferences: {
        careerInterests:
          preferences.careerInterests || prev.careerPreferences?.careerInterests || prev.interests,
        targetRoles: preferences.targetRoles || prev.careerPreferences?.targetRoles || [],
        preferredWorkTypes: preferences.preferredWorkTypes ||
          prev.careerPreferences?.preferredWorkTypes || ["Internship"],
        preferredLocations: preferences.preferredLocations ||
          prev.careerPreferences?.preferredLocations || ["Remote"],
        preferredCities:
          preferences.preferredCities || prev.careerPreferences?.preferredCities || [],
        availability:
          preferences.availability || prev.careerPreferences?.availability || "Immediate",
        targetOpportunityTypes: preferences.targetOpportunityTypes ||
          prev.careerPreferences?.targetOpportunityTypes || ["Internship"],
      },
    }));
  }, []);

  const completeOnboarding = useCallback(() => {
    setProfile((prev) => ({
      ...prev,
      onboardingCompleted: true,
    }));
  }, []);

  const resetOnboarding = useCallback(() => {
    setProfile((prev) => ({
      ...prev,
      onboardingCompleted: false,
    }));
  }, []);

  // Stage 2: Assessment Attempts & State
  const [assessmentAttempts, setAssessmentAttempts] = useState<AssessmentAttempt[]>(() =>
    loadFromStorage("acadin_assessment_attempts", []),
  );

  const latestAssessmentResult = useMemo(
    () => (assessmentAttempts.length > 0 ? assessmentAttempts[0]! : null),
    [assessmentAttempts],
  );

  const saveAssessmentAttempt = useCallback((attempt: AssessmentAttempt) => {
    setAssessmentAttempts((prev) => {
      const filtered = prev.filter((a) => a.id !== attempt.id);
      return [attempt, ...filtered];
    });

    // Derive unified legacy and stage-2 assessment result
    const techScore = clamp(
      Math.round(
        avg(
          TECHNICAL_CATEGORIES.map(
            (c) => attempt.categoryScores[c] ?? attempt.overallScore,
          ),
        ),
      ),
    );
    const softScore = clamp(
      Math.round(
        avg(
          SOFT_CATEGORIES.map(
            (c) => attempt.categoryScores[c] ?? attempt.overallScore,
          ),
        ),
      ),
    );
    const empScore = attempt.overallScore;

    const categoryScores: Record<AssessmentCategory, number> = ALL_CATEGORIES.reduce(
      (acc, cat) => {
        const catScore =
          attempt.categoryScores[cat] ??
          (TECHNICAL_CATEGORIES.includes(cat) ? techScore : softScore);
        return { ...acc, [cat]: catScore };
      },
      {} as Record<AssessmentCategory, number>,
    );

    const unifiedResult: AssessmentResult = {
      submittedAt: attempt.completedAt,
      categoryScores,
      technicalScore: techScore,
      softSkillScore: softScore,
      employabilityScore: empScore,
      answers: attempt.answers || {},
    };

    setAssessmentResult(unifiedResult);
    setAssessmentScores({
      technical: techScore,
      softSkills: softScore,
      employability: empScore,
    });
    setAssessmentSubmitted(true);
    setAnswers(attempt.answers || {});

    // Update declared skills with assessed results
    setProfile((prev) => {
      const existingDeclared = prev.declaredSkills ?? [];
      const updatedDeclared = existingDeclared.map((declared) => {
        const matchingResult = attempt.skillResults.find(
          (sr) => sr.skillName.toLowerCase() === declared.name.toLowerCase(),
        );

        if (matchingResult) {
          return {
            ...declared,
            verificationStatus: "assessed" as const,
            assessedScore: matchingResult.score,
            assessedLevel: matchingResult.assessedLevel,
            assessedAt: attempt.completedAt,
            gapStatus: matchingResult.gapStatus,
          };
        }
        return declared;
      });

      // Also ensure standard skills array has the assessed scores
      const updatedSkills = prev.skills.map((s) => {
        const matching = attempt.skillResults.find(
          (sr) => sr.skillName.toLowerCase() === s.name.toLowerCase(),
        );
        return matching ? { ...s, score: matching.score } : s;
      });

      return {
        ...prev,
        declaredSkills: updatedDeclared,
        skills: updatedSkills,
      };
    });
  }, []);

  const clearAssessmentHistory = useCallback(() => {
    setAssessmentAttempts([]);
    setAssessmentResult(null);
    setAssessmentScores(null);
    setAssessmentSubmitted(false);
    setAnswers({});
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("acadin_assessment_attempts");
      window.localStorage.removeItem("acadin_assessment_result");
      window.localStorage.removeItem("acadin_assessment_scores");
      window.localStorage.removeItem("acadin_assessment_submitted");
      window.localStorage.removeItem("acadin_assessment_answers");
    }
  }, []);

  // Stage 3: Dynamic Roadmap State & Handlers
  const [dynamicRoadmapItems, setDynamicRoadmapItems] = useState<PersonalizedRoadmapItem[]>(() =>
    loadFromStorage("acadin_dynamic_roadmap", []),
  );

  // Computed Target Role Analyses (Sorted by readiness %)
  const targetRoleAnalyses = useMemo(() => {
    return readinessEngine.analyzeTargetRoles(
      profile,
      profile.declaredSkills ?? [],
      latestAssessmentResult,
    );
  }, [profile, latestAssessmentResult]);

  // Computed Skill Gaps
  const skillGaps = useMemo(() => {
    return readinessEngine.extractSkillGaps(
      targetRoleAnalyses,
      profile.declaredSkills ?? [],
      latestAssessmentResult,
    );
  }, [targetRoleAnalyses, profile.declaredSkills, latestAssessmentResult]);

  // Synchronize dynamic roadmap items from detected gaps
  useEffect(() => {
    if (skillGaps.length > 0) {
      setDynamicRoadmapItems((prev) =>
        readinessEngine.generatePersonalizedRoadmap(profile, skillGaps, prev),
      );
    }
  }, [skillGaps, profile]);

  // Computed Career Readiness Score (Multi-Dimensional)
  const careerReadiness = useMemo(() => {
    return readinessEngine.calculateCareerReadiness(
      profile,
      latestAssessmentResult,
      dynamicRoadmapItems,
    );
  }, [profile, latestAssessmentResult, dynamicRoadmapItems]);

  const updateRoadmapProgress = useCallback(
    (itemId: string, progress: number, completed?: boolean) => {
      setDynamicRoadmapItems((prev) =>
        prev.map((item) => {
          if (item.id === itemId) {
            const isCompleted = completed ?? progress >= 100;
            return {
              ...item,
              progress: Math.min(100, Math.max(0, progress)),
              status: isCompleted ? "completed" : progress > 0 ? "in_progress" : "not_started",
              modules: isCompleted
                ? item.modules.map((m) => ({ ...m, completed: true }))
                : item.modules,
            };
          }
          return item;
        }),
      );
    },
    [],
  );

  const toggleRoadmapModule = useCallback((itemId: string, moduleId: string) => {
    setDynamicRoadmapItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const updatedModules = item.modules.map((m) =>
            m.id === moduleId ? { ...m, completed: !m.completed } : m,
          );
          const completedCount = updatedModules.filter((m) => m.completed).length;
          const newProgress = Math.round((completedCount / updatedModules.length) * 100);
          const isCompleted = newProgress >= 100;

          return {
            ...item,
            modules: updatedModules,
            progress: newProgress,
            status: isCompleted ? "completed" : newProgress > 0 ? "in_progress" : "not_started",
          };
        }
        return item;
      }),
    );
  }, []);

  const completeRoadmapItem = useCallback((itemId: string) => {
    setDynamicRoadmapItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            progress: 100,
            status: "completed",
            modules: item.modules.map((m) => ({ ...m, completed: true })),
          };
        }
        return item;
      }),
    );
  }, []);

  // Stage 4: Opportunities State & Matching Handlers
  const [opportunities, setOpportunities] = useState<Opportunity[]>(OPPORTUNITIES_CATALOG);
  const [savedOpportunityIds, setSavedOpportunityIds] = useState<string[]>(() =>
    loadFromStorage("acadin_saved_opportunities", ["opp-rzp-frontend-01", "opp-figma-live-04"]),
  );
  const [applicationSnapshots, setApplicationSnapshots] = useState<ApplicationSnapshot[]>(() =>
    loadFromStorage("acadin_application_snapshots", []),
  );

  const isOpportunitySaved = useCallback(
    (id: string) => savedOpportunityIds.includes(id),
    [savedOpportunityIds],
  );

  const toggleSaveOpportunity = useCallback(
    (id: string) => {
      setSavedOpportunityIds((prev) => {
        const isSaved = prev.includes(id);
        const next = isSaved ? prev.filter((item) => item !== id) : [...prev, id];
        const studentId = profile.email || "student";
        if (isSaved) {
          savedOpportunityRepository.unsave(studentId, id).catch(console.error);
        } else {
          savedOpportunityRepository.save(studentId, id).catch(console.error);
        }
        return next;
      });
    },
    [profile.email],
  );

  // Ranked opportunities based on matching engine
  const rankedOpportunities = useMemo(() => {
    return opportunityMatchingEngine.rankOpportunities(profile, careerReadiness, opportunities);
  }, [profile, careerReadiness, opportunities]);

  const recommendedOpportunities = useMemo(() => {
    return rankedOpportunities.slice(0, 6);
  }, [rankedOpportunities]);

  const bestMatchOpportunities = useMemo(() => {
    return rankedOpportunities.filter((r) => r.match.categoryTag === "Best Match");
  }, [rankedOpportunities]);

  const quickWinOpportunities = useMemo(() => {
    return rankedOpportunities.filter((r) => r.match.categoryTag === "Quick Win");
  }, [rankedOpportunities]);

  const skillBuildingOpportunities = useMemo(() => {
    return rankedOpportunities.filter((r) => r.match.categoryTag === "Skill-Building");
  }, [rankedOpportunities]);

  const liveProjectOpportunities = useMemo(() => {
    return rankedOpportunities.filter((r) => r.opportunity.type === "Live Project");
  }, [rankedOpportunities]);

  const trainingOpportunities = useMemo(() => {
    return rankedOpportunities.filter((r) => r.opportunity.type === "Training Program");
  }, [rankedOpportunities]);

  const getOpportunityMatch = useCallback(
    (opportunityId: string) => {
      const found = rankedOpportunities.find((r) => r.opportunity.id === opportunityId);
      if (found) return found.match;
      const opp = opportunities.find((o) => o.id === opportunityId);
      return opp ? opportunityMatchingEngine.calculateMatch(profile, careerReadiness, opp) : null;
    },
    [rankedOpportunities, opportunities, profile, careerReadiness],
  );

  const applyToOpportunity = useCallback(
    (opportunity: Opportunity, answers?: Record<string, string>): ApplicationSnapshot | null => {
      // Prevent duplicate application
      if (
        applicationSnapshots.some((s) => s.opportunityId === opportunity.id) ||
        applications.some((a) => a.internshipId === opportunity.id)
      ) {
        return null;
      }

      const matchRes = opportunityMatchingEngine.calculateMatch(
        profile,
        careerReadiness,
        opportunity,
      );
      const snapshotId = `app-snap-${opportunity.id}-${Date.now()}`;
      const nowIso = new Date().toISOString();

      const newSnapshot: ApplicationSnapshot = {
        id: snapshotId,
        studentId: profile.email || "student-01",
        opportunityId: opportunity.id,
        opportunityTitle: opportunity.title,
        opportunityType: opportunity.type,
        company: opportunity.company,
        companyLogoHue: opportunity.companyLogoHue,
        submittedAt: nowIso,
        status: "Applied",
        matchScore: matchRes.overallMatch,
        skillFit: matchRes.skillFit,
        eligibilityFit: matchRes.eligibilityFit,
        readinessScore: matchRes.readinessFit,
        salaryOrStipend: opportunity.compensation.formatted,
        answers,
        nextStep: "Awaiting recruiter portfolio screening",
        snapshotProfile: {
          name: profile.name,
          email: profile.email,
          degree: profile.academicProfile?.degree || profile.degree,
          branch: profile.academicProfile?.program || profile.branch,
          college: profile.academicProfile?.institution || profile.college,
          graduationYear: String(
            profile.academicProfile?.graduationYear ||
              profile.academicProfile?.currentYear ||
              profile.year,
          ),
          cgpa: String(profile.academicProfile?.grade || "8.4"),
          skillsCount: (profile.declaredSkills ?? []).length,
          assessedSkillsCount: (profile.declaredSkills ?? []).filter(
            (s) => s.assessedScore !== undefined,
          ).length,
          projectsCount: (profile.projects ?? []).length,
          certificationsCount: (profile.certifications ?? []).length,
          careerReadinessScore: careerReadiness.overallScore,
        },
      };

      setApplicationSnapshots((prev) => [newSnapshot, ...prev]);

      // Backward compatible sync with applications
      const legacyApp: Application = {
        id: snapshotId,
        internshipId: opportunity.id,
        internship: opportunity.title,
        company: opportunity.company,
        appliedDate: today(),
        status: "Applied",
        candidate: profile.name,
        branch: profile.academicProfile?.program || profile.branch,
        opportunityType: opportunity.type === "Job" ? "Job" : "Internship",
        salaryOrStipend: opportunity.compensation.formatted,
        match: matchRes.overallMatch,
        nextStep: "Awaiting recruiter portfolio screening",
      };

      setApplications((prev) => [legacyApp, ...prev]);
      setIndustryApps((prev) => [legacyApp, ...prev]);

      // Add to candidate pool with live snapshot data
      const liveCandidate: Candidate = {
        id: `cand-${profile.email || "student"}`,
        name: profile.name,
        email: profile.email,
        college: profile.academicProfile?.institution || profile.college,
        branch: profile.academicProfile?.program || profile.branch,
        year: `Batch ${profile.academicProfile?.graduationYear || profile.year || "2026"}`,
        skills: (profile.declaredSkills ?? []).map((s) => s.name),
        match: matchRes.overallMatch,
        appliedFor: opportunity.title,
        opportunityType: opportunity.type === "Job" ? "Job" : "Internship",
        shortlisted: false,
        status: "Applied",
        employabilityScore: careerReadiness.overallScore,
        technicalScore: careerReadiness.dimensions.technicalSkills,
        softSkillScore: careerReadiness.dimensions.communication,
        about: profile.about,
        projects: (profile.projects ?? []).map((p) => ({
          title: p.title,
          tech: p.tech,
          description: p.description,
        })),
        certifications: (profile.certifications ?? []).map((c) => ({
          title: c.name,
          issuer: c.issuer,
          year: c.issueDate,
        })),
        appliedDate: today(),
      };
      setCandidates((prev) => [liveCandidate, ...prev.filter((c) => c.name !== profile.name)]);

      // Push notification
      setRecruiterNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          type: "application_received",
          title: "New Student Application",
          message: `${profile.name} applied for ${opportunity.title} with a ${matchRes.overallMatch}% Match Score.`,
          timestamp: today(),
          read: false,
        },
        ...prev,
      ]);

      return newSnapshot;
    },
    [profile, careerReadiness, applicationSnapshots, applications],
  );

  // Certificate CRUD
  const addCertificate = useCallback((certData: Omit<Certification, "id"> | Certification) => {
    setProfile((prev) => {
      const newCert: Certification = {
        ...certData,
        id: "id" in certData && certData.id ? certData.id : `cert-${Date.now()}`,
        name: certData.name || certData.title || "Certificate",
        title: certData.title || certData.name || "Certificate",
        year: certData.year || (certData.issueDate ? certData.issueDate.slice(-4) : "2025"),
        verificationStatus: certData.verificationStatus ?? "Verified",
      };
      return {
        ...prev,
        certifications: [newCert, ...prev.certifications],
      };
    });
  }, []);

  const updateCertificate = useCallback((id: string, patch: Partial<Certification>) => {
    setProfile((prev) => ({
      ...prev,
      certifications: prev.certifications.map((c) =>
        c.id === id
          ? {
              ...c,
              ...patch,
              name: patch.name || patch.title || c.name || c.title || "Certificate",
              title: patch.title || patch.name || c.title || c.name || "Certificate",
            }
          : c,
      ),
    }));
  }, []);

  const deleteCertificate = useCallback((id: string) => {
    setProfile((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c.id !== id),
    }));
  }, []);

  // Achievement CRUD
  const addAchievement = useCallback((achievementData: Omit<Achievement, "id"> | Achievement) => {
    setProfile((prev) => {
      const newAch: Achievement = {
        ...achievementData,
        id:
          "id" in achievementData && achievementData.id ? achievementData.id : `ach-${Date.now()}`,
      };
      return {
        ...prev,
        achievements: [newAch, ...(prev.achievements || [])],
      };
    });
  }, []);

  const updateAchievement = useCallback((id: string, patch: Partial<Achievement>) => {
    setProfile((prev) => ({
      ...prev,
      achievements: (prev.achievements || []).map((a) => (a.id === id ? { ...a, ...patch } : a)),
    }));
  }, []);

  const deleteAchievement = useCallback((id: string) => {
    setProfile((prev) => ({
      ...prev,
      achievements: (prev.achievements || []).filter((a) => a.id !== id),
    }));
  }, []);

  // Experience CRUD
  const addExperience = useCallback((expData: Omit<WorkExperience, "id"> | WorkExperience) => {
    setProfile((prev) => {
      const newExp: WorkExperience = {
        ...expData,
        id: "id" in expData && expData.id ? expData.id : `exp-${Date.now()}`,
      };
      return {
        ...prev,
        experience: [newExp, ...(prev.experience || [])],
      };
    });
  }, []);

  const updateExperience = useCallback((id: string, patch: Partial<WorkExperience>) => {
    setProfile((prev) => ({
      ...prev,
      experience: (prev.experience || []).map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));
  }, []);

  const deleteExperience = useCallback((id: string) => {
    setProfile((prev) => ({
      ...prev,
      experience: (prev.experience || []).filter((e) => e.id !== id),
    }));
  }, []);

  // Education CRUD
  const addEducation = useCallback((eduData: Omit<Education, "id"> | Education) => {
    setProfile((prev) => {
      const newEdu: Education = {
        ...eduData,
        id: "id" in eduData && eduData.id ? eduData.id : `edu-${Date.now()}`,
      };
      return {
        ...prev,
        education: [newEdu, ...(prev.education || [])],
      };
    });
  }, []);

  const updateEducation = useCallback((id: string, patch: Partial<Education>) => {
    setProfile((prev) => ({
      ...prev,
      education: (prev.education || []).map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));
  }, []);

  const deleteEducation = useCallback((id: string) => {
    setProfile((prev) => ({
      ...prev,
      education: (prev.education || []).filter((e) => e.id !== id),
    }));
  }, []);

  const addInternship = useCallback(
    (internship: Internship) => {
      setInternships((list) => [
        {
          ...internship,
          id: internship.id || `int-${Date.now()}`,
          company: internship.company || companyProfile.name,
          companyLogoHue: internship.companyLogoHue ?? companyProfile.logoHue,
          status: internship.status ?? "Published",
          posted: internship.posted || "Just now",
          match: internship.match ?? 85,
          reasons: internship.reasons || ["Direct recruiter posting"],
        },
        ...list,
      ]);
    },
    [companyProfile],
  );

  const updateInternship = useCallback((id: string, patch: Partial<Internship>) => {
    setInternships((list) => list.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }, []);

  const deleteInternship = useCallback((id: string) => {
    setInternships((list) => list.filter((item) => item.id !== id));
  }, []);

  const addJob = useCallback(
    (jobData: Job) => {
      setJobs((list) => [
        {
          ...jobData,
          id: jobData.id || `job-${Date.now()}`,
          company: jobData.company || companyProfile.name,
          companyLogoHue: jobData.companyLogoHue ?? companyProfile.logoHue,
          status: jobData.status ?? "Published",
          posted: jobData.posted || "Just now",
          reasons: jobData.reasons || ["Direct recruiter posting"],
        },
        ...list,
      ]);
    },
    [companyProfile],
  );

  const updateJob = useCallback((id: string, patch: Partial<Job>) => {
    setJobs((list) => list.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }, []);

  const deleteJob = useCallback((id: string) => {
    setJobs((list) => list.filter((item) => item.id !== id));
  }, []);

  const hasApplied = useCallback(
    (id: string) => applications.some((a) => a.internshipId === id),
    [applications],
  );

  const applyTo = useCallback((internship: Internship) => {
    let added = false;
    setApplications((list) => {
      if (list.some((a) => a.internshipId === internship.id)) return list;
      added = true;
      return [
        {
          id: `app-${internship.id}-${list.length + 1}`,
          internshipId: internship.id,
          internship: internship.title,
          company: internship.company,
          appliedDate: today(),
          status: "Applied" as ApplicationStatus,
          opportunityType: "Internship",
          salaryOrStipend: internship.stipend,
          nextStep: "Await recruiter review",
        },
        ...list,
      ];
    });
    return added;
  }, []);

  const advanceApplication = useCallback((id: string) => {
    const stages: ApplicationStatus[] = [
      "Applied",
      "Under Review",
      "Shortlisted",
      "Interview",
      "Selected",
    ];
    setApplications((list) =>
      list.map((application) => {
        if (application.id !== id || application.status === "Rejected") return application;
        const next = stages[Math.min(stages.indexOf(application.status) + 1, stages.length - 1)]!;
        return { ...application, status: next };
      }),
    );
  }, []);

  const setCandidateStatus = useCallback(
    (candidateIdOrName: string, status: ApplicationStatus, applicationId?: string) => {
      setIndustryApps((list) =>
        list.map((app) => {
          const matches =
            (applicationId && app.id === applicationId) ||
            app.id === candidateIdOrName ||
            app.candidate?.toLowerCase() === candidateIdOrName.toLowerCase();
          return matches ? { ...app, status } : app;
        }),
      );

      setCandidates((list) =>
        list.map((cand) => {
          const matches =
            cand.id === candidateIdOrName ||
            cand.name.toLowerCase() === candidateIdOrName.toLowerCase();
          return matches
            ? {
                ...cand,
                status,
                shortlisted:
                  status === "Shortlisted" ||
                  status === "Interview" ||
                  status === "Interview Scheduled" ||
                  status === "Interview Completed" ||
                  status === "Offered" ||
                  status === "Selected" ||
                  status === "Hired",
              }
            : cand;
        }),
      );

      setApplications((list) =>
        list.map((app) => {
          const matches =
            (applicationId && app.id === applicationId) ||
            app.id === candidateIdOrName ||
            app.candidate?.toLowerCase() === candidateIdOrName.toLowerCase();
          return matches ? { ...app, status } : app;
        }),
      );
    },
    [],
  );

  const shortlistCandidate = useCallback(
    (candidateIdOrName: string, applicationId?: string) => {
      setCandidateStatus(candidateIdOrName, "Shortlisted", applicationId);
    },
    [setCandidateStatus],
  );

  const rejectCandidate = useCallback(
    (candidateIdOrName: string, applicationId?: string) => {
      setCandidateStatus(candidateIdOrName, "Rejected", applicationId);
    },
    [setCandidateStatus],
  );

  const setIndustryStatus = useCallback(
    (id: string, status: ApplicationStatus) => {
      setCandidateStatus(id, status, id);
    },
    [setCandidateStatus],
  );

  const scheduleInterview = useCallback(
    (candidateIdOrName: string, details: Partial<InterviewSchedule>) => {
      const candidate = candidates.find(
        (c) =>
          c.id === candidateIdOrName || c.name.toLowerCase() === candidateIdOrName.toLowerCase(),
      );
      const candName = candidate?.name || candidateIdOrName;
      const candId = candidate?.id || candidateIdOrName;
      const role = details.role || candidate?.appliedFor || "Engineering Opportunity";

      setInterviews((list) => {
        const existingIdx = list.findIndex(
          (i) =>
            i.candidateId === candId || i.candidateName.toLowerCase() === candName.toLowerCase(),
        );
        const newEntry: InterviewSchedule = {
          id: existingIdx >= 0 ? list[existingIdx]!.id : `intv-${Date.now()}`,
          candidateId: candId,
          candidateName: candName,
          role,
          match: details.match ?? candidate?.match ?? 85,
          stage: "Interview Scheduled",
          date: details.date || today(),
          time: details.time || "11:00 AM - 12:00 PM",
          mode: details.mode || "Google Meet",
          interviewer: details.interviewer || "Technical Interview Panel",
          notes: details.notes || "Technical and system design interview.",
        };

        if (existingIdx >= 0) {
          const copy = [...list];
          copy[existingIdx] = { ...copy[existingIdx], ...newEntry };
          return copy;
        }
        return [newEntry, ...list];
      });

      setCandidateStatus(candName, "Interview Scheduled");
    },
    [candidates, setCandidateStatus],
  );

  const updateInterviewStage = useCallback(
    (interviewId: string, stage: PipelineStage, notes?: string) => {
      let targetName = "";
      setInterviews((list) =>
        list.map((item) => {
          if (item.id !== interviewId && item.candidateId !== interviewId) return item;
          targetName = item.candidateName;
          return {
            ...item,
            stage,
            notes: notes !== undefined ? notes : item.notes,
          };
        }),
      );

      if (targetName) {
        setCandidateStatus(targetName, stage);
      }
    },
    [setCandidateStatus],
  );

  const completeInterview = useCallback(
    (interviewId: string, feedback: string, score: number) => {
      let targetName = "";
      setInterviews((list) =>
        list.map((item) => {
          if (item.id !== interviewId && item.candidateId !== interviewId) return item;
          targetName = item.candidateName;
          return {
            ...item,
            stage: "Interview Completed",
            feedback,
            score,
          };
        }),
      );

      if (targetName) {
        setCandidateStatus(targetName, "Interview Completed");
      }
    },
    [setCandidateStatus],
  );

  const sendOffer = useCallback(
    (interviewId: string, offerDetails: NonNullable<InterviewSchedule["offerDetails"]>) => {
      let targetName = "";
      setInterviews((list) =>
        list.map((item) => {
          if (item.id !== interviewId && item.candidateId !== interviewId) return item;
          targetName = item.candidateName;
          return {
            ...item,
            stage: "Offered",
            offerDetails,
          };
        }),
      );

      if (targetName) {
        setCandidateStatus(targetName, "Offered");
      }
    },
    [setCandidateStatus],
  );

  const hireCandidate = useCallback(
    (candidateIdOrName: string, interviewId?: string) => {
      setInterviews((list) =>
        list.map((item) => {
          const matches =
            (interviewId && item.id === interviewId) ||
            item.candidateId === candidateIdOrName ||
            item.candidateName.toLowerCase() === candidateIdOrName.toLowerCase();
          return matches ? { ...item, stage: "Hired" } : item;
        }),
      );

      setCandidateStatus(candidateIdOrName, "Hired", interviewId);
    },
    [setCandidateStatus],
  );

  // Stage 5: Corporate Opportunity CRUD & Publishing Handlers
  const addCorporateOpportunity = useCallback(
    (opp: Partial<Opportunity>): Opportunity => {
      const id = opp.id || `opp-corp-${Date.now()}`;
      const newOpp: Opportunity = {
        id,
        title: opp.title || "Untitled Corporate Opportunity",
        company: opp.company || companyProfile.name,
        companyId: opp.companyId || "comp-corp",
        companyLogoHue: opp.companyLogoHue ?? companyProfile.logoHue,
        companyWebsite: opp.companyWebsite || companyProfile.website,
        type: opp.type || "Internship",
        category: opp.category || "Web & Frontend",
        domain: opp.domain || "Software Engineering",
        experienceLevel: opp.experienceLevel || "Fresher",
        description: opp.description || "",
        responsibilities: opp.responsibilities || [],
        requiredSkills: opp.requiredSkills || [],
        preferredSkills: opp.preferredSkills || [],
        eligibility: opp.eligibility || {
          degreeRequirements: ["B.Tech", "MCA", "B.E."],
          departmentRequirements: ["Computer Science", "Information Technology", "Electronics"],
          graduationRequirements: ["2025", "2026", "2027"],
          minCgpa: 7.0,
        },
        location: opp.location || companyProfile.location,
        workMode: opp.workMode || "Hybrid",
        duration: opp.duration || "6 Months",
        compensation: opp.compensation || {
          type: "Stipend",
          formatted: "₹35,000 / mo",
          amount: "₹35,000 / month",
          currency: "INR",
        },
        applicationDeadline: opp.applicationDeadline || "2026-11-30",
        openings: opp.openings || 2,
        hiringProcess: opp.hiringProcess || [
          "Profile Screening",
          "Technical Assessment",
          "Technical Interview",
          "HR & Culture Fit",
        ],
        status: opp.status || "Published",
        postedDate: today(),
        featured: opp.featured ?? false,
        liveProjectDetails: opp.liveProjectDetails,
        trainingDetails: opp.trainingDetails,
      };

      setOpportunities((prev) => [newOpp, ...prev]);
      opportunityRepository.create(newOpp, companyProfile.name).catch(console.error);

      // Backward compatible sync with internships and jobs
      if (newOpp.type === "Internship") {
        setInternships((prev) => [
          {
            id: newOpp.id,
            title: newOpp.title,
            company: newOpp.company,
            companyLogoHue: newOpp.companyLogoHue,
            description: newOpp.description,
            requiredSkills: newOpp.requiredSkills,
            eligibility: "B.Tech / MCA",
            duration: newOpp.duration,
            location: newOpp.location,
            type: newOpp.workMode as any,
            stipend: newOpp.compensation.formatted,
            match: 88,
            posted: today(),
            reasons: [],
            status: newOpp.status === "Draft" ? "Draft" : "Published",
          },
          ...prev,
        ]);
      } else if (newOpp.type === "Job") {
        setJobs((prev) => [
          {
            id: newOpp.id,
            title: newOpp.title,
            company: newOpp.company,
            companyLogoHue: newOpp.companyLogoHue || 220,
            description: newOpp.description,
            requiredSkills: newOpp.requiredSkills,
            qualifications: ["B.Tech / MCA"],
            experience: newOpp.experienceLevel,
            ctc: newOpp.compensation.formatted,
            location: newOpp.location,
            workType: newOpp.workMode as any,
            deadline: newOpp.applicationDeadline,
            posted: today(),
            reasons: [],
            status: newOpp.status === "Draft" ? "Draft" : "Published",
          },
          ...prev,
        ]);
      }

      setRecruiterNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          type: "application_received",
          title: "New Opportunity Published",
          message: `${newOpp.title} has been successfully published and is now live for students.`,
          timestamp: today(),
          read: false,
        },
        ...prev,
      ]);

      return newOpp;
    },
    [companyProfile],
  );

  const updateCorporateOpportunity = useCallback(
    (id: string, patch: Partial<Opportunity>) => {
      setOpportunities((prev) =>
        prev.map((o) => (o.id === id ? { ...o, ...patch } : o)),
      );
      opportunityRepository.update(id, patch).catch(console.error);
    },
    [],
  );

  const deleteCorporateOpportunity = useCallback((id: string) => {
    setOpportunities((prev) => prev.filter((o) => o.id !== id));
    setInternships((prev) => prev.filter((i) => i.id !== id));
    setJobs((prev) => prev.filter((j) => j.id !== id));
    opportunityRepository.delete(id).catch(console.error);
  }, []);

  const publishCorporateOpportunity = useCallback((id: string) => {
    setOpportunities((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "Published" } : o)),
    );
    setInternships((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "Published" } : i)),
    );
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: "Published" } : j)),
    );
    opportunityRepository.publish(id).catch(console.error);
  }, []);

  const closeCorporateOpportunity = useCallback((id: string) => {
    setOpportunities((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "Closed" } : o)),
    );
    opportunityRepository.close(id).catch(console.error);
  }, []);

  // Stage 5: Recruiter Decision Workflow & Actions
  const [recruiterAssessmentAssignments, setRecruiterAssessmentAssignments] = useState<
    RecruiterAssessmentAssignment[]
  >([]);
  >(() => loadFromStorage("acadin_recruiter_assignments", []));
  const [interviewFeedbackRecords, setInterviewFeedbackRecords] = useState<
    InterviewFeedbackRecord[]
  >([]);
  const [corporateOffers, setCorporateOffers] = useState<CorporateOffer[]>([
    {
      id: "offer-init-01",
      candidateId: "cand-neha-04",
      candidateName: "Neha Gupta",
      opportunityId: "opp-swiggy-ai-06",
      opportunityTitle: "Machine Learning & Recommendation Intern",
      designation: "Applied ML Engineer Intern",
      company: "Swiggy",
      joiningDate: "01 Oct 2026",
      compensation: "₹55,000 / mo",
      workMode: "Hybrid",
      location: "Bengaluru, Karnataka",
      offerExpiry: "07 Sep 2026",
      status: "Sent",
      terms: "Full health coverage, flexible hours, and pre-placement offer (PPO) conversion track.",
      sentAt: "24 Aug 2026",
    },
  ]);
  >(() => loadFromStorage("acadin_interview_feedback", []));
  const [corporateOffers, setCorporateOffers] = useState<CorporateOffer[]>(() =>
    loadFromStorage("acadin_corporate_offers", []),
  );
  const [recruiterNotifications, setRecruiterNotifications] = useState<
    RecruiterNotificationEvent[]
  >([
    {
      id: "notif-init-1",
      type: "application_received",
      title: "New Application Received",
      message: "Aditi Sharma applied for Frontend Engineering Intern with a 92% Match score.",
      timestamp: "24 Aug 2026",
      read: false,
    },
    {
      id: "notif-init-2",
      type: "interview_scheduled",
      title: "Interview Scheduled",
      message: "Technical Round scheduled with Rahul Verma for 31 Aug at 2:00 PM.",
      timestamp: "25 Aug 2026",
      read: true,
    },
  ]);
  >(() => loadFromStorage("acadin_recruiter_notifications", []));

  const markRecruiterNotificationRead = useCallback((id: string) => {
    setRecruiterNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const setCandidateApplicationStatus = useCallback(
    (
      candidateIdOrAppId: string,
      status: ApplicationStatus,
      metadata?: { nextStep?: string; interviewDetails?: any },
    ) => {
      setIndustryApps((list) =>
        list.map((app) => {
          const matches =
            app.id === candidateIdOrAppId ||
            app.candidate?.toLowerCase() === candidateIdOrAppId.toLowerCase();
          if (!matches) return app;
          return {
            ...app,
            status,
            nextStep: metadata?.nextStep ?? app.nextStep,
            interviewDetails: metadata?.interviewDetails ?? app.interviewDetails,
          };
        }),
      );

      setApplications((list) =>
        list.map((app) => {
          const matches =
            app.id === candidateIdOrAppId ||
            app.candidate?.toLowerCase() === candidateIdOrAppId.toLowerCase() ||
            app.internshipId === candidateIdOrAppId;
          if (!matches) return app;
          return {
            ...app,
            status,
            nextStep: metadata?.nextStep ?? app.nextStep,
            interviewDetails: metadata?.interviewDetails ?? app.interviewDetails,
          };
        }),
      );

      setCandidates((list) =>
        list.map((cand) => {
          const matches =
            cand.id === candidateIdOrAppId ||
            cand.name.toLowerCase() === candidateIdOrAppId.toLowerCase();
          if (!matches) return cand;
          return {
            ...cand,
            status,
            shortlisted:
              status === "Shortlisted" ||
              status === "Interview" ||
              status === "Interview Scheduled" ||
              status === "Interview Completed" ||
              status === "Offered" ||
              status === "Selected" ||
              status === "Hired",
          };
        }),
      );
    },
    [],
  );

  const bulkShortlistCandidates = useCallback(
    (applicationIds: string[]) => {
      applicationIds.forEach((id) => {
        setCandidateApplicationStatus(id, "Shortlisted", {
          nextStep: "Shortlisted by recruiter · Next: Technical screening",
        });
      });
      setRecruiterNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          type: "candidate_shortlisted",
          title: "Bulk Shortlisting Completed",
          message: `Successfully shortlisted ${applicationIds.length} candidate(s).`,
          timestamp: today(),
          read: false,
        },
        ...prev,
      ]);
    },
    [setCandidateApplicationStatus],
  );

  const assignRecruiterAssessment = useCallback(
    (
      applicationId: string,
      assessment: {
        type: "Technical" | "Skill-Specific" | "Custom";
        assessmentTitle: string;
        durationMinutes: number;
        deadline: string;
      },
    ) => {
      const app = industryApps.find((a) => a.id === applicationId);
      const candName = app?.candidate || "Candidate";
      const newAssignment: RecruiterAssessmentAssignment = {
        id: `assign-${Date.now()}`,
        applicationId,
        candidateName: candName,
        type: assessment.type,
        assessmentTitle: assessment.assessmentTitle,
        durationMinutes: assessment.durationMinutes,
        deadline: assessment.deadline,
        status: "Assigned",
        assignedAt: today(),
      };

      setRecruiterAssessmentAssignments((prev) => [newAssignment, ...prev]);
      setCandidateApplicationStatus(applicationId, "Assessment" as any, {
        nextStep: `Assessment assigned: ${assessment.assessmentTitle} (Due: ${assessment.deadline})`,
      });
    },
    [industryApps, setCandidateApplicationStatus],
  );

  const scheduleRecruiterInterview = useCallback(
    (applicationId: string, interviewData: Partial<InterviewSchedule>) => {
      const app = industryApps.find((a) => a.id === applicationId);
      const candName = interviewData.candidateName || app?.candidate || "Candidate";
      const candId = interviewData.candidateId || app?.id || applicationId;
      const role = interviewData.role || app?.internship || "Engineering Opportunity";

      const newInterview: InterviewSchedule = {
        id: `intv-${Date.now()}`,
        candidateId: candId,
        candidateName: candName,
        role,
        match: interviewData.match ?? app?.match ?? 85,
        stage: "Interview Scheduled",
        date: interviewData.date || today(),
        time: interviewData.time || "11:00 AM - 12:00 PM",
        mode: interviewData.mode || "Google Meet",
        interviewer: interviewData.interviewer || "Senior Technical Panel",
        notes: interviewData.notes || "Technical architecture and problem solving session.",
      };

      setInterviews((prev) => [
        newInterview,
        ...prev.filter((i) => i.candidateId !== candId),
      ]);
      setCandidateApplicationStatus(applicationId, "Interview Scheduled", {
        nextStep: `Interview scheduled on ${newInterview.date} at ${newInterview.time}`,
        interviewDetails: {
          date: newInterview.date,
          time: newInterview.time,
          mode: newInterview.mode,
          notes: newInterview.notes,
        },
      });

      setRecruiterNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          type: "interview_scheduled",
          title: "Interview Scheduled",
          message: `Interview scheduled with ${candName} for ${newInterview.date}.`,
          timestamp: today(),
          read: false,
        },
        ...prev,
      ]);
    },
    [industryApps, setCandidateApplicationStatus],
  );

  const submitInterviewFeedback = useCallback(
    (
      interviewId: string,
      feedback: {
        ratings: {
          technical: number;
          problemSolving: number;
          communication: number;
          teamwork: number;
          roleFit: number;
        };
        strengths: string[];
        concerns: string[];
        notes: string;
        recommendation: "Strong Hire" | "Hire" | "Hold" | "No Hire";
        submittedBy: string;
      },
    ) => {
      const intv = interviews.find((i) => i.id === interviewId);
      const candName = intv?.candidateName || "Candidate";
      const candId = intv?.candidateId || interviewId;

      const newRecord: InterviewFeedbackRecord = {
        id: `fb-${Date.now()}`,
        interviewId,
        candidateId: candId,
        candidateName: candName,
        role: intv?.role || "Engineering Role",
        ratings: feedback.ratings,
        strengths: feedback.strengths,
        concerns: feedback.concerns,
        notes: feedback.notes,
        recommendation: feedback.recommendation,
        submittedBy: feedback.submittedBy,
        submittedAt: today(),
      };

      setInterviewFeedbackRecords((prev) => [newRecord, ...prev]);

      setInterviews((list) =>
        list.map((item) =>
          item.id === interviewId
            ? {
                ...item,
                stage: "Interview Completed",
                feedback: feedback.notes,
                score: Math.round(
                  (feedback.ratings.technical +
                    feedback.ratings.problemSolving +
                    feedback.ratings.communication +
                    feedback.ratings.teamwork +
                    feedback.ratings.roleFit) /
                    5,
                ),
              }
            : item,
        ),
      );

      setCandidateApplicationStatus(candId, "Interview Completed", {
        nextStep: `Interview completed · Recruiter recommendation: ${feedback.recommendation}`,
      });

      setRecruiterNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          type: "interview_completed",
          title: "Interview Feedback Recorded",
          message: `Feedback submitted for ${candName} (${feedback.recommendation}).`,
          timestamp: today(),
          read: false,
        },
        ...prev,
      ]);
    },
    [interviews, setCandidateApplicationStatus],
  );

  const createAndSendOffer = useCallback(
    (
      applicationId: string,
      offerData: {
        designation: string;
        compensation: string;
        joiningDate: string;
        workMode?: OpportunityWorkMode;
        location?: string;
        offerExpiry?: string;
        terms?: string;
      },
    ): CorporateOffer | null => {
      const app = industryApps.find((a) => a.id === applicationId);
      const candName = app?.candidate || "Candidate";
      const candId = app?.id || applicationId;

      const newOffer: CorporateOffer = {
        id: `offer-${Date.now()}`,
        candidateId: candId,
        candidateName: candName,
        opportunityId: app?.internshipId || "opp-rzp-frontend-01",
        opportunityTitle: app?.internship || offerData.designation,
        designation: offerData.designation,
        company: companyProfile.name,
        joiningDate: offerData.joiningDate,
        compensation: offerData.compensation,
        workMode: offerData.workMode || "Hybrid",
        location: offerData.location || companyProfile.location,
        offerExpiry: offerData.offerExpiry || "In 7 Days",
        status: "Sent",
        terms:
          offerData.terms ||
          "Standard employment agreement with comprehensive medical coverage and learning stipend.",
        sentAt: today(),
      };

      setCorporateOffers((prev) => [newOffer, ...prev]);

      setCandidateApplicationStatus(applicationId, "Offered", {
        nextStep: `Formal offer extended (${newOffer.compensation}) · Awaiting candidate decision`,
      });

      setRecruiterNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          type: "offer_sent",
          title: "Formal Offer Extended",
          message: `Offer sent to ${candName} for ${newOffer.designation} (${newOffer.compensation}).`,
          timestamp: today(),
          read: false,
        },
        ...prev,
      ]);

      return newOffer;
    },
    [industryApps, companyProfile, setCandidateApplicationStatus],
  );

  const respondToOffer = useCallback(
    (offerIdOrAppId: string, response: "Accepted" | "Declined") => {
      let targetOffer = corporateOffers.find(
        (o) => o.id === offerIdOrAppId || o.candidateId === offerIdOrAppId,
      );
      if (!targetOffer && corporateOffers.length > 0) {
        targetOffer = corporateOffers[0];
      }

      const nextStatus = response === "Accepted" ? "Accepted" : "Declined";

      if (targetOffer) {
        setCorporateOffers((list) =>
          list.map((o) =>
            o.id === targetOffer!.id
              ? { ...o, status: nextStatus, respondedAt: today() }
              : o,
          ),
        );
      }

      const appStatus: ApplicationStatus = response === "Accepted" ? "Hired" : "Rejected";
      const candId = targetOffer?.candidateId || offerIdOrAppId;

      setCandidateApplicationStatus(candId, appStatus, {
        nextStep:
          response === "Accepted"
            ? `🎉 Offer accepted! Onboarding commences on ${targetOffer?.joiningDate || "scheduled date"}`
            : "Offer declined by candidate.",
      });

      setRecruiterNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          type: response === "Accepted" ? "offer_accepted" : "offer_declined",
          title: response === "Accepted" ? "🎉 Offer Accepted!" : "Offer Declined",
          message: `${targetOffer?.candidateName || "Candidate"} has ${response.toLowerCase()} the formal offer for ${targetOffer?.designation || "the role"}.`,
          timestamp: today(),
          read: false,
        },
        ...prev,
      ]);
    },
    [corporateOffers, setCandidateApplicationStatus],
  );

  const recruiterKPIs = useMemo(() => {
    const totalApplicants = industryApps.length;
    const underReviewCount = industryApps.filter(
      (a) => a.status === "Under Review" || a.status === "Applied",
    ).length;
    const shortlistedCount = industryApps.filter((a) => a.status === "Shortlisted").length;
    const assessmentCount = industryApps.filter(
      (a) => (a.status as string) === "Assessment",
    ).length;
    const interviewsCount = industryApps.filter(
      (a) =>
        a.status === "Interview Scheduled" ||
        a.status === "Interview Completed" ||
        a.status === "Interview",
    ).length;
    const offersCount = industryApps.filter((a) => a.status === "Offered").length;
    const hiresCount = industryApps.filter(
      (a) => a.status === "Hired" || a.status === "Selected",
    ).length;
    const rejectedCount = industryApps.filter((a) => a.status === "Rejected").length;

    const activeOpportunities = opportunities.filter((o) => o.status === "Published").length;

    const shortlistRate =
      totalApplicants > 0 ? Math.round((shortlistedCount / totalApplicants) * 100) : 0;
    const interviewConversion =
      shortlistedCount > 0 ? Math.round((interviewsCount / shortlistedCount) * 100) : 0;
    const offerConversion =
      interviewsCount > 0 ? Math.round((offersCount / interviewsCount) * 100) : 0;
    const hiringConversion =
      totalApplicants > 0 ? Math.round((hiresCount / totalApplicants) * 100) : 0;

    return {
      activeOpportunities,
      totalApplicants,
      underReviewCount,
      shortlistedCount,
      assessmentCount,
      interviewsCount,
      offersCount,
      hiresCount,
      rejectedCount,
      shortlistRate,
      interviewConversion,
      offerConversion,
      hiringConversion,
    };
  }, [industryApps, opportunities]);

  const addTrainingProgram = useCallback(
    (program: TrainingProgram) => {
      setTrainingPrograms((list) => [
        {
          ...program,
          id: program.id || `train-${Date.now()}`,
          company: program.company || companyProfile.name,
          companyLogoHue: program.companyLogoHue ?? companyProfile.logoHue,
          status: program.status ?? "Published",
          enrolledCount: program.enrolledCount ?? 0,
        },
        ...list,
      ]);
    },
    [companyProfile],
  );

  const updateTrainingProgram = useCallback((id: string, patch: Partial<TrainingProgram>) => {
    setTrainingPrograms((list) => list.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const deleteTrainingProgram = useCallback((id: string) => {
    setTrainingPrograms((list) => list.filter((p) => p.id !== id));
  }, []);

  // Academician Handlers
  const applyFacultyInternship = useCallback((id: string) => {
    setFacultyInternships((list) =>
      list.map((item) =>
        item.id === id ? { ...item, registered: true, applicationStatus: "Under Review" } : item,
      ),
    );
  }, []);

  const registerFacultyTraining = useCallback((id: string) => {
    setFacultyTrainings((list) =>
      list.map((item) =>
        item.id === id
          ? {
              ...item,
              registered: true,
              enrolledCount: item.enrolledCount + 1,
              progress: item.progress || 10,
            }
          : item,
      ),
    );
  }, []);

  const updateTrainingProgress = useCallback((id: string, progress: number) => {
    setFacultyTrainings((list) =>
      list.map((item) =>
        item.id === id
          ? {
              ...item,
              progress: clamp(progress),
              certificateUrl:
                progress >= 100
                  ? item.certificateUrl || `https://acadin.edu/certificates/cert-${item.id}`
                  : item.certificateUrl,
            }
          : item,
      ),
    );
  }, []);

  const registerFacultyFDP = useCallback((id: string) => {
    setFacultyFDPs((list) =>
      list.map((item) =>
        item.id === id
          ? {
              ...item,
              registered: true,
              enrolledCount: item.enrolledCount + 1,
              status: item.status === "Completed" ? "Completed" : "In Progress",
            }
          : item,
      ),
    );
  }, []);

  const applyConsultancy = useCallback((id: string) => {
    setConsultancyProjects((list) =>
      list.map((item) =>
        item.id === id ? { ...item, applied: true, participationStatus: "In Progress" } : item,
      ),
    );
  }, []);

  const applyResearchProject = useCallback((id: string) => {
    setResearchProjects((list) =>
      list.map((item) =>
        item.id === id ? { ...item, applied: true, participationStatus: "In Progress" } : item,
      ),
    );
  }, []);

  const respondGuestLecture = useCallback((id: string, status: "Accepted" | "Declined") => {
    setGuestLectures((list) => list.map((item) => (item.id === id ? { ...item, status } : item)));
  }, []);

  const scheduleGuestLecture = useCallback((lecture: GuestLectureSession) => {
    setGuestLectures((list) => [
      {
        ...lecture,
        id: lecture.id || `lec-${Date.now()}`,
        status: "Accepted",
      },
      ...list,
    ]);
  }, []);

  const scheduleMentorshipMeeting = useCallback(
    (mentorshipId: string, date: string, mode: string) => {
      setStudentMentorships((list) =>
        list.map((item) =>
          item.id === mentorshipId
            ? {
                ...item,
                nextMeetingDate: date,
                meetingMode: mode,
                status: "Active",
              }
            : item,
        ),
      );
    },
    [],
  );

  const addMentorshipNote = useCallback((mentorshipId: string, note: string) => {
    if (!note.trim()) return;
    setStudentMentorships((list) =>
      list.map((item) =>
        item.id === mentorshipId ? { ...item, notes: [note.trim(), ...item.notes] } : item,
      ),
    );
  }, []);

  const recordMentorshipSession = useCallback(
    (mentorshipId: string, session: { date: string; summary: string; actionItems: string }) => {
      setStudentMentorships((list) =>
        list.map((item) =>
          item.id === mentorshipId
            ? {
                ...item,
                lastMeetingDate: session.date,
                meetingHistory: [session, ...item.meetingHistory],
              }
            : item,
        ),
      );
    },
    [],
  );

  const toggleShortlist = useCallback((id: string) => {
    let next = false;
    setCandidates((list) =>
      list.map((c) => {
        if (c.id !== id) return c;
        next = !c.shortlisted;
        return { ...c, shortlisted: next };
      }),
    );
    return next;
  }, []);

  // Faculty Profile Handlers
  const updateFacultyProfile = useCallback((patch: Partial<FacultyProfile>) => {
    setFacultyProfile((prev) => ({ ...prev, ...patch }));
  }, []);

  const addFacultyPublication = useCallback((pub: Omit<FacultyPublication, "id">) => {
    const newPub: FacultyPublication = {
      ...pub,
      id: `pub-${Date.now()}`,
    };
    setFacultyProfile((prev) => ({
      ...prev,
      publications: [newPub, ...prev.publications],
      stats: {
        ...prev.stats,
        researchGrantsCount: prev.stats.researchGrantsCount,
      },
    }));
  }, []);

  const removeFacultyPublication = useCallback((id: string) => {
    setFacultyProfile((prev) => ({
      ...prev,
      publications: prev.publications.filter((p) => p.id !== id),
    }));
  }, []);

  const addFacultyExpertise = useCallback((item: string) => {
    if (!item.trim()) return;
    setFacultyProfile((prev) => ({
      ...prev,
      areasOfExpertise: prev.areasOfExpertise.includes(item.trim())
        ? prev.areasOfExpertise
        : [...prev.areasOfExpertise, item.trim()],
    }));
  }, []);

  const removeFacultyExpertise = useCallback((item: string) => {
    setFacultyProfile((prev) => ({
      ...prev,
      areasOfExpertise: prev.areasOfExpertise.filter((e) => e !== item),
    }));
  }, []);

  const addFacultyResearchInterest = useCallback((item: string) => {
    if (!item.trim()) return;
    setFacultyProfile((prev) => ({
      ...prev,
      researchInterests: prev.researchInterests.includes(item.trim())
        ? prev.researchInterests
        : [...prev.researchInterests, item.trim()],
    }));
  }, []);

  const removeFacultyResearchInterest = useCallback((item: string) => {
    setFacultyProfile((prev) => ({
      ...prev,
      researchInterests: prev.researchInterests.filter((r) => r !== item),
    }));
  }, []);

  const cancelFacultyTraining = useCallback((id: string) => {
    setFacultyTrainings((list) =>
      list.map((item) =>
        item.id === id
          ? {
              ...item,
              registered: false,
              enrolledCount: Math.max(0, item.enrolledCount - 1),
              progress: 0,
            }
          : item,
      ),
    );
  }, []);

  // Collaborations Handlers
  const proposeCollaboration = useCallback((collab: Omit<CollaborationRecord, "id">) => {
    const newCollab: CollaborationRecord = {
      ...collab,
      id: `collab-${Date.now()}`,
    };
    setCollaborations((prev) => [newCollab, ...prev]);
    return newCollab;
  }, []);

  const updateCollaborationStatus = useCallback((id: string, status: CollaborationLifecycle) => {
    setCollaborations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c)),
    );
  }, []);

  const recordCollaborationOutcome = useCallback((id: string, outcome: CollaborationOutcome) => {
    setCollaborations((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "Outcome Recorded", outcome } : c,
      ),
    );
  }, []);

  // Institution Handlers
  const updateInstitutionStudent = useCallback((id: string, patch: Partial<InstitutionStudent>) => {
    setInstitutionStudents((list) =>
      list.map((stu) => (stu.id === id ? { ...stu, ...patch } : stu)),
    );
  }, []);

  const addRecruiterPartner = useCallback((partner: RecruiterPartner) => {
    setRecruiterPartners((list) => [
      {
        ...partner,
        id: partner.id || `rec-${Date.now()}`,
      },
      ...list,
    ]);
  }, []);

  const updateRecruiterPartner = useCallback((id: string, patch: Partial<RecruiterPartner>) => {
    setRecruiterPartners((list) => list.map((rec) => (rec.id === id ? { ...rec, ...patch } : rec)));
  }, []);

  // Institution Intelligence: Computed Aggregated Demands & Gaps
  const industrySkillDemand = useMemo(() => {
    const counts: Record<string, { count: number; roles: Set<string> }> = {};

    opportunities.forEach((opp) => {
      opp.requiredSkills.forEach((s) => {
        const trimmed = s.trim();
        if (!counts[trimmed]) {
          counts[trimmed] = { count: 0, roles: new Set() };
        }
        counts[trimmed].count += 1;
        counts[trimmed].roles.add(opp.title);
      });
      (opp.preferredSkills || []).forEach((s) => {
        const trimmed = s.trim();
        if (!counts[trimmed]) {
          counts[trimmed] = { count: 0, roles: new Set() };
        }
        counts[trimmed].count += 0.5;
        counts[trimmed].roles.add(opp.title);
      });
    });

    return Object.entries(counts)
      .map(([skill, data]) => ({
        skill,
        demandCount: Math.round(data.count),
        trend: (data.count >= 4 ? "high" : data.count >= 2 ? "rising" : "stable") as
          | "rising"
          | "stable"
          | "high",
        relatedRoles: Array.from(data.roles).slice(0, 3),
      }))
      .sort((a, b) => b.demandCount - a.demandCount);
  }, [opportunities]);

  const skillDemandVsSupply = useMemo(() => {
    // Benchmark Top Skills
    const focusSkills = [
      { name: "React", baseDemand: 92, defaultProficiency: 82 },
      { name: "TypeScript", baseDemand: 88, defaultProficiency: 76 },
      { name: "Python", baseDemand: 85, defaultProficiency: 84 },
      { name: "SQL", baseDemand: 80, defaultProficiency: 78 },
      { name: "AWS", baseDemand: 84, defaultProficiency: 58 },
      { name: "Docker", baseDemand: 82, defaultProficiency: 62 },
      { name: "Kubernetes", baseDemand: 78, defaultProficiency: 45 },
      { name: "Microservices", baseDemand: 80, defaultProficiency: 54 },
      { name: "Data Structures", baseDemand: 90, defaultProficiency: 86 },
      { name: "REST APIs", baseDemand: 86, defaultProficiency: 85 },
    ];

    // Compute live average proficiency
    return focusSkills.map((item) => {
      const liveDem = industrySkillDemand.find(
        (d) => d.skill.toLowerCase() === item.name.toLowerCase(),
      );
      const demandScore = liveDem ? Math.min(60 + liveDem.demandCount * 8, 98) : item.baseDemand;
      const proficiencyScore = item.defaultProficiency;
      const gap = demandScore - proficiencyScore;

      let status: "Surplus" | "Balanced" | "Critical Gap" | "Moderate Gap" = "Balanced";
      if (gap >= 25) status = "Critical Gap";
      else if (gap >= 10) status = "Moderate Gap";
      else if (gap <= -10) status = "Surplus";

      return {
        skill: item.name,
        industryDemandScore: demandScore,
        studentProficiencyScore: proficiencyScore,
        gap,
        status,
      };
    });
  }, [industrySkillDemand]);

  const institutionKPIs = useMemo(() => {
    const totalStudents = departmentReports.reduce((acc, d) => acc + d.totalStudents, 0);
    const placedStudents = institutionStudents.filter((s) => s.placementStatus === "Placed").length;
    const placementRate =
      institutionStudents.length > 0
        ? Math.round((placedStudents / institutionStudents.length) * 100 * 10) / 10
        : 86.4;
    const activeInterns = institutionStudents.filter(
      (s) => s.internshipStatus === "Active" || s.internshipStatus === "Completed",
    ).length;
    const internshipReach =
      institutionStudents.length > 0
        ? Math.round((activeInterns / institutionStudents.length) * 100 * 10) / 10
        : 84.8;
    const avgEmployability =
      institutionStudents.length > 0
        ? Math.round(
            institutionStudents.reduce((acc, s) => acc + s.employabilityScore, 0) /
              institutionStudents.length,
          )
        : 82;
    const activeRecruiters = recruiterPartners.length;
    const facultyEngagements =
      facultyInternships.filter((i) => i.registered).length +
      facultyTrainings.filter((t) => t.registered).length +
      facultyFDPs.filter((f) => f.registered).length +
      consultancyProjects.filter((c) => c.applied).length +
      researchProjects.filter((r) => r.applied).length;
    const activeCollaborations = collaborations.filter((c) => c.status === "Active").length;

    return {
      totalStudents,
      placementRate,
      internshipReach,
      avgEmployability,
      activeRecruiters,
      facultyEngagements,
      activeCollaborations,
    };
  }, [
    departmentReports,
    institutionStudents,
    recruiterPartners,
    facultyInternships,
    facultyTrainings,
    facultyFDPs,
    consultancyProjects,
    researchProjects,
    collaborations,
  ]);

  const setAnswer = useCallback((questionId: string, answer: number) => {
    setAnswers((a) => ({ ...a, [questionId]: answer }));
  }, []);

  const resetAnswers = useCallback(() => {
    setAnswers({});
    setAssessmentSubmitted(false);
    setAssessmentScores(null);
    setAssessmentResult(null);
  }, []);

  const submitAssessment = useCallback((scores: NonNullable<AppState["assessmentScores"]>) => {
    setAssessmentScores(scores);
    setAssessmentSubmitted(true);
  }, []);

  const submitFullAssessment = useCallback(
    (userAnswers: Record<string, number>): AssessmentResult => {
      const categoryTotals: Record<AssessmentCategory, { correct: number; total: number }> =
        ALL_CATEGORIES.reduce(
          (acc, cat) => ({ ...acc, [cat]: { correct: 0, total: 0 } }),
          {} as Record<AssessmentCategory, { correct: number; total: number }>,
        );

      for (const q of mcqAssessmentQuestions as MCQAssessmentQuestion[]) {
        const cat = q.category;
        if (!categoryTotals[cat]) continue;
        categoryTotals[cat].total += 1;
        const weight = q.weight ?? 1;
        const userAns = userAnswers[q.id];
        if (userAns === q.correct) {
          categoryTotals[cat].correct += weight;
        }
      }

      const categoryScores: Record<AssessmentCategory, number> = ALL_CATEGORIES.reduce(
        (acc, cat) => {
          const { correct, total } = categoryTotals[cat];
          const score = total > 0 ? clamp(Math.round((correct / total) * 100)) : 0;
          return { ...acc, [cat]: score };
        },
        {} as Record<AssessmentCategory, number>,
      );

      const technicalScore = clamp(
        Math.round(avg(TECHNICAL_CATEGORIES.map((c) => categoryScores[c]))),
      );
      const softSkillScore = clamp(Math.round(avg(SOFT_CATEGORIES.map((c) => categoryScores[c]))));
      const employabilityScore = clamp(
        Math.round(technicalScore * TECHNICAL_WEIGHT + softSkillScore * SOFT_WEIGHT),
      );

      const result: AssessmentResult = {
        submittedAt: new Date().toISOString(),
        categoryScores,
        technicalScore,
        softSkillScore,
        employabilityScore,
        answers: { ...userAnswers },
      };

      setAssessmentResult(result);
      setAssessmentScores({
        technical: technicalScore,
        softSkills: softSkillScore,
        employability: employabilityScore,
      });
      setAssessmentSubmitted(true);
      setAnswers({ ...userAnswers });

      return result;
    },
    [],
  );

  const computeCareerMatches = useCallback((): CareerMatch[] => {
    const currentAssessment = assessmentResult;
    const profileSkills = profile.skills;

    const profileSkillMap = new Map(profileSkills.map((s) => [s.name.toLowerCase(), s.score]));

    const matches: CareerMatch[] = (careerRoles as CareerRole[]).map((role) => {
      const categoryScoreList = currentAssessment
        ? Object.entries(role.categoryWeights)
            .filter(([_, w]) => typeof w === "number" && w > 0)
            .map(([cat, w]) => ({
              score: currentAssessment.categoryScores[cat as AssessmentCategory] ?? 0,
              weight: w!,
            }))
        : [];

      const totalWeight = categoryScoreList.reduce((a, b) => a + b.weight, 0) || 1;
      const weightedCategoryScore =
        categoryScoreList.reduce((a, b) => a + b.score * b.weight, 0) / totalWeight;

      const requiredLower = role.requiredSkills.map((s) => s.toLowerCase());
      const matchingSkills: string[] = [];
      const missingSkills: string[] = [];
      let skillScoreSum = 0;

      for (let i = 0; i < requiredLower.length; i++) {
        const req = requiredLower[i]!;
        const originalName = role.requiredSkills[i]!;
        const s = profileSkillMap.get(req);
        if (typeof s === "number") {
          matchingSkills.push(originalName);
          skillScoreSum += s;
        } else {
          missingSkills.push(originalName);
        }
      }

      const avgSkillScore =
        requiredLower.length > 0 ? skillScoreSum / Math.max(1, requiredLower.length) : 0;
      const skillCoverage =
        requiredLower.length > 0 ? (matchingSkills.length / requiredLower.length) * 100 : 0;

      const categoryContribution = currentAssessment ? weightedCategoryScore * 0.5 : 25;
      const skillScoreContribution = avgSkillScore * 0.3;
      const skillCoverageContribution = skillCoverage * 0.2;

      const matchPercentage = clamp(
        Math.round(categoryContribution + skillScoreContribution + skillCoverageContribution),
      );

      const placementReadiness = clamp(
        Math.round(
          matchPercentage * 0.6 +
            (currentAssessment ? currentAssessment.employabilityScore * 0.4 : 25),
        ),
      );

      return {
        roleId: role.id,
        roleTitle: role.title,
        roleDescription: role.description,
        matchPercentage,
        matchingSkills,
        missingSkills,
        placementReadiness,
      };
    });

    matches.sort((a, b) => b.matchPercentage - a.matchPercentage);
    return matches;
  }, [assessmentResult, profile.skills]);

  const careerMatches = useMemo(() => computeCareerMatches(), [computeCareerMatches]);

  const saveInternship = useCallback((id: string) => {
    setSavedInternships((list) => (list.includes(id) ? list : [...list, id]));
  }, []);

  const unsaveInternship = useCallback((id: string) => {
    setSavedInternships((list) => list.filter((x) => x !== id));
  }, []);

  const isInternshipSaved = useCallback(
    (id: string) => savedInternships.includes(id),
    [savedInternships],
  );

  const saveJob = useCallback((id: string) => {
    setSavedJobs((list) => (list.includes(id) ? list : [...list, id]));
  }, []);

  const unsaveJob = useCallback((id: string) => {
    setSavedJobs((list) => list.filter((x) => x !== id));
  }, []);

  const isJobSaved = useCallback((id: string) => savedJobs.includes(id), [savedJobs]);

  const applyToInternship = useCallback(
    (id: string): boolean => {
      const internship = internships.find((i) => i.id === id);
      if (!internship) return false;

      let added = false;
      const appId = `app-int-${id}-${Date.now()}`;
      setApplications((list) => {
        const duplicate = list.some(
          (a) => a.internshipId === id && a.opportunityType === "Internship",
        );
        if (duplicate) return list;
        added = true;
        return [
          {
            id: appId,
            internshipId: id,
            internship: internship.title,
            company: internship.company,
            appliedDate: today(),
            status: "Applied" as ApplicationStatus,
            opportunityType: "Internship",
            salaryOrStipend: internship.stipend,
            nextStep: "Await recruiter review",
          },
          ...list,
        ];
      });

      if (added) {
        setIndustryApps((list) => [
          {
            id: `iapp-${id}-${Date.now()}`,
            internshipId: id,
            internship: internship.title,
            company: internship.company,
            candidate: profile.name,
            branch: profile.branch,
            match: internship.match ?? 85,
            appliedDate: today(),
            status: "Applied" as ApplicationStatus,
            opportunityType: "Internship",
          },
          ...list,
        ]);

        setCandidates((list) => {
          const existingIdx = list.findIndex(
            (c) => c.name.toLowerCase() === profile.name.toLowerCase(),
          );
          const candidateData: Candidate = {
            id: existingIdx >= 0 ? list[existingIdx]!.id : `cand-${Date.now()}`,
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            college: profile.college,
            branch: profile.branch,
            year: profile.year,
            skills: profile.skills.map((s) => s.name),
            gaps: ["System Design"],
            match: internship.match ?? 85,
            appliedFor: internship.title,
            opportunityType: "Internship",
            shortlisted: false,
            status: "Applied",
            employabilityScore: 86,
            technicalScore: 88,
            softSkillScore: 83,
            about: profile.about,
            projects: profile.projects.map((p) => ({
              title: p.title,
              tech: p.tech,
              description: p.description,
            })),
            certifications: profile.certifications.map((c) => ({
              title: c.name || c.title || "Certificate",
              issuer: c.issuer,
              year: c.issueDate || c.year || "2025",
            })),
            appliedDate: today(),
            avatar: profile.avatar,
          };

          if (existingIdx >= 0) {
            const copy = [...list];
            copy[existingIdx] = { ...copy[existingIdx], ...candidateData };
            return copy;
          }
          return [candidateData, ...list];
        });
      }

      return added;
    },
    [internships, profile],
  );

  const applyToJob = useCallback(
    (id: string): boolean => {
      const job = jobs.find((j) => j.id === id);
      if (!job) return false;

      let added = false;
      const appId = `app-job-${id}-${Date.now()}`;
      setApplications((list) => {
        const duplicate = list.some((a) => a.internshipId === id && a.opportunityType === "Job");
        if (duplicate) return list;
        added = true;
        return [
          {
            id: appId,
            internshipId: id,
            internship: job.title,
            company: job.company,
            appliedDate: today(),
            status: "Applied" as ApplicationStatus,
            opportunityType: "Job",
            salaryOrStipend: job.ctc,
            nextStep: "Await recruiter review",
          },
          ...list,
        ];
      });

      if (added) {
        setIndustryApps((list) => [
          {
            id: `iapp-job-${id}-${Date.now()}`,
            internshipId: id,
            internship: job.title,
            company: job.company,
            candidate: profile.name,
            branch: profile.branch,
            match: 88,
            appliedDate: today(),
            status: "Applied" as ApplicationStatus,
            opportunityType: "Job",
          },
          ...list,
        ]);

        setCandidates((list) => {
          const existingIdx = list.findIndex(
            (c) => c.name.toLowerCase() === profile.name.toLowerCase(),
          );
          const candidateData: Candidate = {
            id: existingIdx >= 0 ? list[existingIdx]!.id : `cand-${Date.now()}`,
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            college: profile.college,
            branch: profile.branch,
            year: profile.year,
            skills: profile.skills.map((s) => s.name),
            gaps: ["System Architecture"],
            match: 88,
            appliedFor: job.title,
            opportunityType: "Job",
            shortlisted: false,
            status: "Applied",
            employabilityScore: 86,
            technicalScore: 88,
            softSkillScore: 83,
            about: profile.about,
            projects: profile.projects.map((p) => ({
              title: p.title,
              tech: p.tech,
              description: p.description,
            })),
            certifications: profile.certifications.map((c) => ({
              title: c.name || c.title || "Certificate",
              issuer: c.issuer,
              year: c.issueDate || c.year || "2025",
            })),
            appliedDate: today(),
            avatar: profile.avatar,
          };

          if (existingIdx >= 0) {
            const copy = [...list];
            copy[existingIdx] = { ...copy[existingIdx], ...candidateData };
            return copy;
          }
          return [candidateData, ...list];
        });
      }

      return added;
    },
    [jobs, profile],
  );

  const updateRoadmapItem = useCallback(
    (id: string, patch: { progress?: number; completed?: boolean }): RoadmapItem | undefined => {
      let updated: RoadmapItem | undefined;
      setRoadmapItems((list) =>
        list.map((item) => {
          if (item.id !== id) return item;
          const newProgress =
            typeof patch.progress === "number" ? clamp(patch.progress) : item.progress;
          const newCompleted = patch.completed ?? item.completed;
          updated = {
            ...item,
            progress: newCompleted ? 100 : newProgress,
            completed: newCompleted || newProgress >= 100,
          };
          return updated;
        }),
      );
      return updated;
    },
    [],
  );

  const getRoadmapCompletion = useCallback((): number => {
    if (roadmapItems.length === 0) return 0;
    const completedCount = roadmapItems.filter((r) => r.completed).length;
    const avgProgress = avg(roadmapItems.map((r) => r.progress));
    const byCompleted = (completedCount / roadmapItems.length) * 100;
    return clamp(Math.round((byCompleted + avgProgress) / 2));
  }, [roadmapItems]);

  const opportunityApplications = useMemo(() => {
    const map = new Map<string, Application>();
    for (const app of applications) {
      const key = `${app.opportunityType ?? "Internship"}:${app.internshipId}`;
      if (!map.has(key)) map.set(key, app);
    }
    return map;
  }, [applications]);

  const authenticate = useCallback((nextRole: Role) => {
    setRole(nextRole);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setRole("student");
  }, []);

  // Mentorship Handlers
  const requestMentorship = useCallback(
    (
      mentorId: string,
      params: {
        purpose: string;
        preferredDate: string;
        preferredTime: string;
        notes?: string | undefined;
      },
    ) => {
      const mentor = mentors.find((m) => m.id === mentorId);
      if (!mentor) return null;

      const newRequest: MentorshipRequest = {
        id: `req-ment-${Date.now()}`,
        studentId: "stud-sanket-01",
        studentName: profile.name || "Sanket Kumar Rana",
        mentorId: mentor.id,
        mentorName: mentor.name,
        mentorType: mentor.type,
        mentorOrganization: mentor.organization,
        requestedAt: today(),
        purpose: params.purpose,
        preferredDate: params.preferredDate,
        preferredTime: params.preferredTime,
        status: "Requested",
        notes: params.notes,
      };

      setMentorshipRequests((prev) => [newRequest, ...prev]);

      pushPlatformNotification({
        recipientRole: mentor.type === "faculty" ? "academician" : "industry",
        type: "mentorship_requested",
        title: "New Mentorship Request Received",
        message: `${profile.name} requested a ${mentor.sessionDurationMinutes}-min mentorship session on ${params.preferredDate}.`,
        relatedEntityId: newRequest.id,
        relatedEntityType: "mentorship",
      });

      return newRequest;
    },
    [mentors, profile, pushPlatformNotification],
  );

  const updateMentorshipRequestStatus = useCallback(
    (
      requestId: string,
      status: MentorshipRequestStatus,
      notes?: string | undefined,
      rescheduleData?: { date: string; time: string } | undefined,
    ) => {
      setMentorshipRequests((prev) =>
        prev.map((req) => {
          if (req.id !== requestId) return req;
          return {
            ...req,
            status,
            notes: notes ?? req.notes,
            proposedRescheduleDate: rescheduleData?.date ?? req.proposedRescheduleDate,
            proposedRescheduleTime: rescheduleData?.time ?? req.proposedRescheduleTime,
          };
        }),
      );

      const targetReq = mentorshipRequests.find((r) => r.id === requestId);
      if (targetReq && status === "Accepted") {
        const newSession: MentorshipSession = {
          id: `sess-ment-${Date.now()}`,
          requestId: targetReq.id,
          studentId: targetReq.studentId,
          studentName: targetReq.studentName,
          mentorId: targetReq.mentorId,
          mentorName: targetReq.mentorName,
          mentorType: targetReq.mentorType,
          mentorOrganization: targetReq.mentorOrganization,
          date: rescheduleData?.date || targetReq.preferredDate,
          startTime: (rescheduleData?.time || targetReq.preferredTime).split("-")[0]?.trim() || "10:00 AM",
          endTime: (rescheduleData?.time || targetReq.preferredTime).split("-")[1]?.trim() || "10:45 AM",
          mode: "Online",
          meetingLink: `https://meet.google.com/acd-${targetReq.id.slice(-6)}`,
          status: "Scheduled",
          purpose: targetReq.purpose,
        };

        setMentorshipSessions((prev) => [newSession, ...prev]);

        pushPlatformNotification({
          recipientRole: "student",
          type: "mentorship_scheduled",
          title: "Mentorship Session Scheduled",
          message: `${targetReq.mentorName} accepted your session for ${newSession.date} at ${newSession.startTime}.`,
          relatedEntityId: newSession.id,
          relatedEntityType: "mentorship",
        });
      }
    },
    [mentorshipRequests, pushPlatformNotification],
  );

  const scheduleMentorshipSession = useCallback(
    (
      requestId: string,
      sessionData: {
        date: string;
        startTime: string;
        endTime: string;
        mode: MentorshipSessionMode;
        meetingLink?: string | undefined;
        location?: string | undefined;
        purpose?: string | undefined;
      },
    ) => {
      const targetReq = mentorshipRequests.find((r) => r.id === requestId);
      if (!targetReq) return null;

      const newSession: MentorshipSession = {
        id: `sess-ment-${Date.now()}`,
        requestId: targetReq.id,
        studentId: targetReq.studentId,
        studentName: targetReq.studentName,
        mentorId: targetReq.mentorId,
        mentorName: targetReq.mentorName,
        mentorType: targetReq.mentorType,
        mentorOrganization: targetReq.mentorOrganization,
        date: sessionData.date,
        startTime: sessionData.startTime,
        endTime: sessionData.endTime,
        mode: sessionData.mode,
        meetingLink: sessionData.meetingLink || `https://meet.google.com/acd-${requestId.slice(-6)}`,
        location: sessionData.location,
        status: "Scheduled",
        purpose: sessionData.purpose || targetReq.purpose,
      };

      setMentorshipSessions((prev) => [newSession, ...prev]);
      setMentorshipRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: "Scheduled" } : r)),
      );
      return newSession;
    },
    [mentorshipRequests],
  );

  const completeMentorshipSession = useCallback(
    (
      sessionId: string,
      outcome: { topicsDiscussed: string[]; followUpRecommendations: string[]; summary: string },
      mentorNotes?: string | undefined,
    ) => {
      setMentorshipSessions((prev) =>
        prev.map((s) => {
          if (s.id !== sessionId) return s;
          return {
            ...s,
            status: "Completed",
            mentorPrivateNotes: mentorNotes ?? s.mentorPrivateNotes,
            outcome: {
              ...outcome,
              recordedAt: today(),
            },
          };
        }),
      );

      const session = mentorshipSessions.find((s) => s.id === sessionId);
      if (session) {
        setMentorshipRequests((prev) =>
          prev.map((r) => (r.id === session.requestId ? { ...r, status: "Completed" } : r)),
        );

        pushPlatformNotification({
          recipientRole: "student",
          type: "mentorship_scheduled",
          title: "Mentorship Session Completed",
          message: `${session.mentorName} recorded outcomes for your session. You can now leave feedback.`,
          relatedEntityId: session.id,
          relatedEntityType: "mentorship",
        });
      }
    },
    [mentorshipSessions, pushPlatformNotification],
  );

  const cancelMentorshipSession = useCallback(
    (sessionId: string, reason?: string | undefined) => {
      setMentorshipSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, status: "Cancelled", mentorPrivateNotes: reason } : s)),
      );
      const session = mentorshipSessions.find((s) => s.id === sessionId);
      if (session) {
        setMentorshipRequests((prev) =>
          prev.map((r) => (r.id === session.requestId ? { ...r, status: "Cancelled" } : r)),
        );
      }
    },
    [mentorshipSessions],
  );

  const submitMentorshipStudentFeedback = useCallback(
    (
      sessionId: string,
      feedback: {
        rating: number;
        helpfulness: "Extremely Helpful" | "Very Helpful" | "Moderately Helpful" | "Slightly Helpful";
        comment: string;
      },
    ) => {
      setMentorshipSessions((prev) =>
        prev.map((s) => {
          if (s.id !== sessionId) return s;
          return {
            ...s,
            studentFeedback: {
              ...feedback,
              submittedAt: today(),
            },
          };
        }),
      );

      const targetSession = mentorshipSessions.find((s) => s.id === sessionId);
      if (targetSession) {
        setMentors((prev) =>
          prev.map((m) => {
            if (m.id !== targetSession.mentorId) return m;
            const currentSummary = m.ratingSummary || { averageRating: 4.9, totalReviews: 10, helpfulCount: 10 };
            const newTotal = currentSummary.totalReviews + 1;
            const newAvg =
              Math.round(((currentSummary.averageRating * currentSummary.totalReviews + feedback.rating) / newTotal) * 10) /
              10;
            return {
              ...m,
              ratingSummary: {
                averageRating: newAvg,
                totalReviews: newTotal,
                helpfulCount: currentSummary.helpfulCount + 1,
              },
            };
          }),
        );
      }
    },
    [mentorshipSessions],
  );

  // Placement Actions & Offer Resolution
  const acceptCorporateOfferAndHire = useCallback(
    (offerIdOrAppId: string) => {
      const offer = corporateOffers.find(
        (o) => o.id === offerIdOrAppId || o.candidateId === offerIdOrAppId,
      );

      const companyName = offer?.company || companyProfile.name;
      const roleTitle = offer?.designation || "Engineering Intern";
      const compensation = offer?.compensation || "₹45,000 / mo";

      setCorporateOffers((prev) =>
        prev.map((o) =>
          o.id === offerIdOrAppId || o.candidateId === offerIdOrAppId
            ? { ...o, status: "Accepted" }
            : o,
        ),
      );

      setCandidateApplicationStatus(offerIdOrAppId, "Hired", {
        nextStep: "Candidate Accepted Offer · Onboarding Kickoff",
      });

      const newPlacement: PlacementHistoryItem = {
        id: `plc-hist-${Date.now()}`,
        studentId: "stud-sanket-01",
        company: companyName,
        role: roleTitle,
        opportunityType: "Internship",
        joiningDate: offer?.joiningDate || "15 Sep 2026",
        placementCycle: "Campus Placement Season 2026-27",
        compensation,
        relevantSkills: profile.skills?.map((s) => s.name).slice(0, 5) || ["React", "TypeScript"],
        verifiedAt: today(),
        status: "Offer Accepted",
      };

      setPlacementHistory((prev) => [newPlacement, ...prev]);

      setInstitutionStudents((prev) =>
        prev.map((stu) =>
          stu.name === profile.name
            ? { ...stu, placementStatus: "Placed", company: companyName, role: roleTitle, ctc: compensation }
            : stu,
        ),
      );

      pushPlatformNotification({
        recipientRole: "all",
        type: "offer_accepted",
        title: "Offer Accepted & Candidate Placed!",
        message: `${profile.name} has formally accepted the offer for ${roleTitle} at ${companyName}.`,
        relatedEntityId: offer?.id,
        relatedEntityType: "offer",
      });
    },
    [corporateOffers, companyProfile, setCandidateApplicationStatus, profile, pushPlatformNotification],
  );

  const declineCorporateOffer = useCallback(
    (offerIdOrAppId: string, reason?: string | undefined) => {
      setCorporateOffers((prev) =>
        prev.map((o) =>
          o.id === offerIdOrAppId || o.candidateId === offerIdOrAppId
            ? { ...o, status: "Declined" }
            : o,
        ),
      );
      setCandidateApplicationStatus(offerIdOrAppId, "Rejected", {
        nextStep: `Candidate Declined Offer: ${reason || "Declined by applicant"}`,
      });
    },
    [setCandidateApplicationStatus],
  );

  // Platform Admin Handlers
  const authenticateAdmin = useCallback((email?: string | undefined, password?: string | undefined) => {
    if (!email || !password) return false;
    setIsAdminAuthenticated(true);
    return true;
  }, []);

  const logoutAdmin = useCallback(() => {
    setIsAdminAuthenticated(false);
  }, []);

  const logAdminAction = useCallback(
    (
      action: string,
      entity: "User" | "Company" | "Institution" | "Skill" | "Opportunity" | "System",
      entityId: string,
      details: string,
    ) => {
      const newEntry: AdminAuditLogEntry = {
        id: `audit-${Date.now()}`,
        timestamp: `${today()}, ${new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} IST`,
        admin: adminUser?.name || "Dr. Arvind Subramanian",
        action,
        entity,
        entityId,
        details,
      };
      setAdminAuditLogs((prev) => [newEntry, ...prev]);
    },
    [adminUser],
  );

  const togglePlatformUserStatus = useCallback(
    (userId: string, status: PlatformUserStatus) => {
      setPlatformUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status } : u)),
      );
      logAdminAction(`User Status changed to ${status}`, "User", userId, `User ${userId} status updated to ${status}.`);
    },
    [logAdminAction],
  );

  const verifyCompanyByAdmin = useCallback(
    (companyId: string, status: CompanyVerificationActionStatus, notes?: string | undefined) => {
      setCompanyVerifications((prev) =>
        prev.map((c) => {
          if (c.id !== companyId) return c;
          return {
            ...c,
            verificationStatus: status,
            reviewedAt: today(),
            reviewerNotes: notes ?? c.reviewerNotes,
          };
        }),
      );

      const target = companyVerifications.find((c) => c.id === companyId);
      if (target && target.companyName.toLowerCase().includes(companyProfile.name.toLowerCase())) {
        setCompanyProfile((prev) => ({
          ...prev,
          verificationStatus: status === "Verified" ? "Verified" : status === "Rejected" ? "Rejected" : "Pending",
        }));
      }

      logAdminAction(
        `Company verification marked as ${status}`,
        "Company",
        companyId,
        `Verification status for ${target?.companyName || companyId} set to ${status}.`,
      );
    },
    [companyVerifications, companyProfile, logAdminAction],
  );

  const moderateOpportunityByAdmin = useCallback(
    (opportunityId: string, status: OpportunityModerationStatus, notes?: string | undefined) => {
      setModeratedOpportunities((prev) =>
        prev.map((o) => {
          if (o.id !== opportunityId) return o;
          return {
            ...o,
            status,
            moderationNotes: notes ?? o.moderationNotes,
          };
        }),
      );

      setOpportunities((prev) =>
        prev.map((o) => {
          if (o.id !== opportunityId) return o;
          return {
            ...o,
            status: status === "Published" ? "Published" : "Draft",
          };
        }),
      );

      logAdminAction(
        `Opportunity moderation set to ${status}`,
        "Opportunity",
        opportunityId,
        `Opportunity ${opportunityId} moderated to ${status}.`,
      );
    },
    [logAdminAction],
  );

  const addSkillByAdmin = useCallback(
    (skill: Omit<SkillDefinition, "id">) => {
      const newSkill: SkillDefinition = {
        ...skill,
        id: `skill-adm-${Date.now()}`,
      };
      setPlatformSkills((prev) => [newSkill, ...prev]);
      logAdminAction("Skill definition added", "Skill", newSkill.id, `Added skill ${newSkill.name} to category ${newSkill.category}.`);
      return newSkill;
    },
    [logAdminAction],
  );

  const updateSkillByAdmin = useCallback(
    (id: string, patch: Partial<SkillDefinition>) => {
      setPlatformSkills((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...patch } : s)),
      );
      logAdminAction("Skill definition modified", "Skill", id, `Updated skill attributes for ID ${id}.`);
    },
    [logAdminAction],
  );

  const toggleSkillActiveByAdmin = useCallback(
    (id: string) => {
      setPlatformSkills((prev) =>
        prev.map((s) => {
          if (s.id !== id) return s;
          const nextActive = s.isActive !== false ? false : true;
          return { ...s, isActive: nextActive };
        }),
      );
      logAdminAction("Skill active toggle", "Skill", id, `Toggled active state for skill ID ${id}.`);
    },
    [logAdminAction],
  );

  const platformMetrics: PlatformMetrics = useMemo(() => {
    const totalUsers = platformUsers.length;
    const totalStudents = platformUsers.filter((u) => u.role === "student").length + 240;
    const totalAcademicians = platformUsers.filter((u) => u.role === "academician").length + 38;
    const totalInstitutions = departmentReports.length + 8;
    const totalCompanies = companyVerifications.length + 12;
    const activeOpportunities = opportunities.length;
    const totalApplications = applications.length + industryApps.length;
    const totalPlacements =
      placementHistory.length + institutionStudents.filter((s) => s.placementStatus === "Placed").length;
    const activeCollaborations = collaborations.filter((c) => c.status === "Active").length;
    const pendingVerifications = companyVerifications.filter((c) => c.verificationStatus === "Pending").length;
    const pendingModerations = moderatedOpportunities.filter((o) => o.status === "Pending Review").length;

    return {
      totalUsers,
      totalStudents,
      totalAcademicians,
      totalInstitutions,
      totalCompanies,
      activeOpportunities,
      totalApplications,
      totalPlacements,
      activeCollaborations,
      pendingVerifications,
      pendingModerations,
    };
  }, [
    platformUsers,
    departmentReports,
    companyVerifications,
    opportunities,
    applications,
    industryApps,
    placementHistory,
    institutionStudents,
    collaborations,
    moderatedOpportunities,
  ]);

  // Continuous LocalStorage Persistence Synchronizers
  useEffect(() => {
    saveToStorage("acadin_student_profile", profile);
  }, [profile]);

  useEffect(() => {
    saveToStorage("acadin_assessment_attempts", assessmentAttempts);
  }, [assessmentAttempts]);

  useEffect(() => {
    saveToStorage("acadin_assessment_submitted", assessmentSubmitted);
  }, [assessmentSubmitted]);

  useEffect(() => {
    saveToStorage("acadin_assessment_scores", assessmentScores);
  }, [assessmentScores]);

  useEffect(() => {
    saveToStorage("acadin_assessment_result", assessmentResult);
  }, [assessmentResult]);

  useEffect(() => {
    saveToStorage("acadin_assessment_answers", answers);
  }, [answers]);

  useEffect(() => {
    saveToStorage("acadin_dynamic_roadmap", dynamicRoadmapItems);
  }, [dynamicRoadmapItems]);

  useEffect(() => {
    saveToStorage("acadin_applications", applications);
  }, [applications]);

  useEffect(() => {
    saveToStorage("acadin_industry_apps", industryApps);
  }, [industryApps]);

  useEffect(() => {
    saveToStorage("acadin_saved_internships", savedInternships);
  }, [savedInternships]);

  useEffect(() => {
    saveToStorage("acadin_saved_jobs", savedJobs);
  }, [savedJobs]);

  useEffect(() => {
    saveToStorage("acadin_saved_opportunities", savedOpportunityIds);
  }, [savedOpportunityIds]);

  useEffect(() => {
    saveToStorage("acadin_application_snapshots", applicationSnapshots);
  }, [applicationSnapshots]);

  useEffect(() => {
    saveToStorage("acadin_mentorship_requests", mentorshipRequests);
  }, [mentorshipRequests]);

  useEffect(() => {
    saveToStorage("acadin_mentorship_sessions", mentorshipSessions);
  }, [mentorshipSessions]);

  useEffect(() => {
    saveToStorage("acadin_placement_history", placementHistory);
  }, [placementHistory]);

  useEffect(() => {
    saveToStorage("acadin_corporate_offers", corporateOffers);
  }, [corporateOffers]);

  useEffect(() => {
    saveToStorage("acadin_company_profile", companyProfile);
  }, [companyProfile]);

  useEffect(() => {
    saveToStorage("acadin_faculty_profile", facultyProfile);
  }, [facultyProfile]);

  useEffect(() => {
    saveToStorage("acadin_candidates", candidates);
  }, [candidates]);

  useEffect(() => {
    saveToStorage("acadin_interviews", interviews);
  }, [interviews]);

  useEffect(() => {
    saveToStorage("acadin_collaborations", collaborations);
  }, [collaborations]);

  useEffect(() => {
    saveToStorage("acadin_recruiter_assignments", recruiterAssessmentAssignments);
  }, [recruiterAssessmentAssignments]);

  useEffect(() => {
    saveToStorage("acadin_interview_feedback", interviewFeedbackRecords);
  }, [interviewFeedbackRecords]);

  useEffect(() => {
    saveToStorage("acadin_recruiter_notifications", recruiterNotifications);
  }, [recruiterNotifications]);

  useEffect(() => {
    saveToStorage("acadin_platform_notifications", platformNotifications);
  }, [platformNotifications]);

  const value = useMemo(
    () => ({
      isAuthenticated,
      authenticate,
      logout,
      role,
      setRole,
      profile,
      updateProfile,
      addProject,
      updateProject,
      deleteProject,
      addSkill,
      updateSkill,
      deleteSkill,
      addDeclaredSkill,
      updateDeclaredSkill,
      removeDeclaredSkill,
      setDeclaredSkills,
      addSkillEvidence,
      removeSkillEvidence,
      updateAcademicProfile,
      updateCareerPreferences,
      completeOnboarding,
      resetOnboarding,
      addCertificate,
      updateCertificate,
      deleteCertificate,
      addAchievement,
      updateAchievement,
      deleteAchievement,
      addExperience,
      updateExperience,
      deleteExperience,
      addEducation,
      updateEducation,
      deleteEducation,
      resumeTemplate,
      setResumeTemplate,
      companyProfile,
      updateCompanyProfile,
      internships,
      addInternship,
      updateInternship,
      deleteInternship,
      jobs,
      addJob,
      updateJob,
      deleteJob,
      applications,
      applyTo,
      advanceApplication,
      hasApplied,
      industryApps,
      setIndustryStatus,
      candidates,
      toggleShortlist,
      shortlistCandidate,
      rejectCandidate,
      setCandidateStatus,
      interviews,
      scheduleInterview,
      updateInterviewStage,
      completeInterview,
      sendOffer,
      hireCandidate,
      trainingPrograms,
      addTrainingProgram,
      updateTrainingProgram,
      deleteTrainingProgram,
      facultyInternships,
      applyFacultyInternship,
      facultyTrainings,
      registerFacultyTraining,
      updateTrainingProgress,
      facultyFDPs,
      registerFacultyFDP,
      consultancyProjects,
      applyConsultancy,
      researchProjects,
      applyResearchProject,
      guestLectures,
      respondGuestLecture,
      scheduleGuestLecture,
      studentMentorships,
      scheduleMentorshipMeeting,
      addMentorshipNote,
      recordMentorshipSession,
      institutionStudents,
      updateInstitutionStudent,
      departmentReports,
      recruiterPartners,
      addRecruiterPartner,
      updateRecruiterPartner,
      answers,
      setAnswer,
      resetAnswers,
      assessmentAttempts,
      latestAssessmentResult,
      saveAssessmentAttempt,
      clearAssessmentHistory,
      careerReadiness,
      targetRoleAnalyses,
      skillGaps,
      dynamicRoadmapItems,
      updateRoadmapProgress,
      toggleRoadmapModule,
      completeRoadmapItem,
      assessmentSubmitted,
      assessmentScores,
      submitAssessment,
      assessmentResult,
      careerMatches,
      roadmapItems,
      savedInternships,
      savedJobs,
      opportunityApplications,
      submitFullAssessment,
      computeCareerMatches,
      saveInternship,
      unsaveInternship,
      isInternshipSaved,
      saveJob,
      unsaveJob,
      isJobSaved,
      applyToInternship,
      applyToJob,
      updateRoadmapItem,
      getRoadmapCompletion,

      // Stage 4: Opportunities & Matching
      opportunities,
      savedOpportunityIds,
      toggleSaveOpportunity,
      isOpportunitySaved,
      applyToOpportunity,
      applicationSnapshots,
      getOpportunityMatch,
      rankedOpportunities,
      recommendedOpportunities,
      bestMatchOpportunities,
      quickWinOpportunities,
      skillBuildingOpportunities,
      liveProjectOpportunities,
      trainingOpportunities,

      // Stage 5: Industry Recruitment Workflow & Decision Intelligence
      setCompanyVerificationStatus,
      addCorporateOpportunity,
      updateCorporateOpportunity,
      deleteCorporateOpportunity,
      publishCorporateOpportunity,
      closeCorporateOpportunity,
      setCandidateApplicationStatus,
      bulkShortlistCandidates,
      assignRecruiterAssessment,
      recruiterAssessmentAssignments,
      scheduleRecruiterInterview,
      submitInterviewFeedback,
      interviewFeedbackRecords,
      createAndSendOffer,
      respondToOffer,
      corporateOffers,
      recruiterNotifications,
      markRecruiterNotificationRead,
      recruiterKPIs,

      // Stage 6: Academician Ecosystem & Cross-Role Collaboration
      facultyProfile,
      updateFacultyProfile,
      addFacultyPublication,
      removeFacultyPublication,
      addFacultyExpertise,
      removeFacultyExpertise,
      addFacultyResearchInterest,
      removeFacultyResearchInterest,
      cancelFacultyTraining,
      collaborations,
      proposeCollaboration,
      updateCollaborationStatus,
      recordCollaborationOutcome,

      // Stage 6: Institution Intelligence
      industrySkillDemand,
      skillDemandVsSupply,
      institutionKPIs,

      // Stage 7: Permissions, Repositories, AI Boundaries & Notifications
      checkPermission,
      studentRepo: studentRepository,
      assessmentRepo: assessmentRepository,
      opportunityRepo: opportunityRepository,
      savedOpportunityRepo: savedOpportunityRepository,
      applicationRepo: mockApplicationRepository,
      collaborationRepo: mockCollaborationRepository,
      aiAssessmentGenerator: assessmentAIGenerator,
      aiCareerService: careerAIService,
      aiSkillGapService: skillGapAIService,
      aiLearningService: learningAIService,
      aiOpportunityService: opportunityAIService,
      aiRecruiterService: recruiterAIService,
      aiResumeService: resumeAIFeedbackService,
      aiPortfolioService: portfolioAIService,
      aiInterviewService: interviewAIService,
      aiFeedbackService: aiFeedbackService,
      platformNotifications,
      pushPlatformNotification,
      markPlatformNotificationRead,

      // Mentor Scheduling
      mentors,
      mentorshipRequests,
      mentorshipSessions,
      requestMentorship,
      updateMentorshipRequestStatus,
      scheduleMentorshipSession,
      completeMentorshipSession,
      cancelMentorshipSession,
      submitMentorshipStudentFeedback,

      // Placement Timeline & History
      placementHistory,
      acceptCorporateOfferAndHire,
      declineCorporateOffer,

      // Platform Admin Panel
      isAdminAuthenticated,
      adminUser,
      authenticateAdmin,
      logoutAdmin,
      platformUsers,
      companyVerifications,
      moderatedOpportunities,
      adminAuditLogs,
      logAdminAction,
      togglePlatformUserStatus,
      verifyCompanyByAdmin,
      moderateOpportunityByAdmin,
      platformSkills,
      addSkillByAdmin,
      updateSkillByAdmin,
      toggleSkillActiveByAdmin,
      platformMetrics,
    }),
    [
      isAuthenticated,
      authenticate,
      logout,
      role,
      profile,
      updateProfile,
      addProject,
      updateProject,
      deleteProject,
      addSkill,
      updateSkill,
      deleteSkill,
      addDeclaredSkill,
      updateDeclaredSkill,
      removeDeclaredSkill,
      setDeclaredSkills,
      addSkillEvidence,
      removeSkillEvidence,
      updateAcademicProfile,
      updateCareerPreferences,
      completeOnboarding,
      resetOnboarding,
      addCertificate,
      updateCertificate,
      deleteCertificate,
      addAchievement,
      updateAchievement,
      deleteAchievement,
      addExperience,
      updateExperience,
      deleteExperience,
      addEducation,
      updateEducation,
      deleteEducation,
      resumeTemplate,
      companyProfile,
      updateCompanyProfile,
      setCompanyVerificationStatus,
      internships,
      addInternship,
      updateInternship,
      deleteInternship,
      jobs,
      addJob,
      updateJob,
      deleteJob,
      applications,
      applyTo,
      advanceApplication,
      hasApplied,
      industryApps,
      setIndustryStatus,
      candidates,
      toggleShortlist,
      shortlistCandidate,
      rejectCandidate,
      setCandidateStatus,
      interviews,
      scheduleInterview,
      updateInterviewStage,
      completeInterview,
      sendOffer,
      hireCandidate,
      trainingPrograms,
      addTrainingProgram,
      updateTrainingProgram,
      deleteTrainingProgram,
      facultyProfile,
      updateFacultyProfile,
      addFacultyPublication,
      removeFacultyPublication,
      addFacultyExpertise,
      removeFacultyExpertise,
      addFacultyResearchInterest,
      removeFacultyResearchInterest,
      facultyInternships,
      applyFacultyInternship,
      facultyTrainings,
      registerFacultyTraining,
      cancelFacultyTraining,
      updateTrainingProgress,
      facultyFDPs,
      registerFacultyFDP,
      consultancyProjects,
      applyConsultancy,
      researchProjects,
      applyResearchProject,
      guestLectures,
      respondGuestLecture,
      scheduleGuestLecture,
      studentMentorships,
      scheduleMentorshipMeeting,
      addMentorshipNote,
      recordMentorshipSession,
      collaborations,
      proposeCollaboration,
      updateCollaborationStatus,
      recordCollaborationOutcome,
      institutionStudents,
      updateInstitutionStudent,
      departmentReports,
      recruiterPartners,
      addRecruiterPartner,
      updateRecruiterPartner,
      industrySkillDemand,
      skillDemandVsSupply,
      institutionKPIs,
      checkPermission,
      platformNotifications,
      pushPlatformNotification,
      markPlatformNotificationRead,
      answers,
      setAnswer,
      resetAnswers,
      assessmentAttempts,
      latestAssessmentResult,
      saveAssessmentAttempt,
      clearAssessmentHistory,
      careerReadiness,
      targetRoleAnalyses,
      skillGaps,
      dynamicRoadmapItems,
      updateRoadmapProgress,
      toggleRoadmapModule,
      completeRoadmapItem,
      assessmentSubmitted,
      assessmentScores,
      submitAssessment,
      assessmentResult,
      careerMatches,
      roadmapItems,
      savedInternships,
      savedJobs,
      opportunityApplications,
      submitFullAssessment,
      computeCareerMatches,
      saveInternship,
      unsaveInternship,
      isInternshipSaved,
      saveJob,
      unsaveJob,
      isJobSaved,
      applyToInternship,
      applyToJob,
      updateRoadmapItem,
      getRoadmapCompletion,
      opportunities,
      savedOpportunityIds,
      toggleSaveOpportunity,
      isOpportunitySaved,
      applyToOpportunity,
      applicationSnapshots,
      getOpportunityMatch,
      rankedOpportunities,
      recommendedOpportunities,
      bestMatchOpportunities,
      quickWinOpportunities,
      skillBuildingOpportunities,
      liveProjectOpportunities,
      trainingOpportunities,
      addCorporateOpportunity,
      updateCorporateOpportunity,
      deleteCorporateOpportunity,
      publishCorporateOpportunity,
      closeCorporateOpportunity,
      setCandidateApplicationStatus,
      bulkShortlistCandidates,
      assignRecruiterAssessment,
      recruiterAssessmentAssignments,
      scheduleRecruiterInterview,
      submitInterviewFeedback,
      interviewFeedbackRecords,
      createAndSendOffer,
      respondToOffer,
      corporateOffers,
      recruiterNotifications,
      markRecruiterNotificationRead,
      recruiterKPIs,
      mentors,
      mentorshipRequests,
      mentorshipSessions,
      requestMentorship,
      updateMentorshipRequestStatus,
      scheduleMentorshipSession,
      completeMentorshipSession,
      cancelMentorshipSession,
      submitMentorshipStudentFeedback,
      placementHistory,
      acceptCorporateOfferAndHire,
      declineCorporateOffer,
      isAdminAuthenticated,
      adminUser,
      authenticateAdmin,
      logoutAdmin,
      platformUsers,
      companyVerifications,
      moderatedOpportunities,
      adminAuditLogs,
      logAdminAction,
      togglePlatformUserStatus,
      verifyCompanyByAdmin,
      moderateOpportunityByAdmin,
      platformSkills,
      addSkillByAdmin,
      updateSkillByAdmin,
      toggleSkillActiveByAdmin,
      platformMetrics,
    ],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used inside AppStateProvider");
  return ctx;
}
