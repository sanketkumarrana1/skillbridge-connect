import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
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
  Achievement,
  Application,
  ApplicationStatus,
  AssessmentCategory,
  AssessmentResult,
  Candidate,
  CareerMatch,
  CareerRole,
  Certification,
  CompanyProfile,
  ConsultancyProject,
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
  PipelineStage,
  Project,
  RecruiterPartner,
  ResearchProject,
  RoadmapItem,
  Role,
  Skill,
  SkillLevel,
  StudentMentorship,
  StudentProfile,
  TrainingProgram,
  WorkExperience,
} from "@/types";

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
  facultyInternships: FacultyInternship[];
  applyFacultyInternship: (id: string) => void;

  facultyTrainings: FacultyTraining[];
  registerFacultyTraining: (id: string) => void;
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

  // Institution State & Actions
  institutionStudents: InstitutionStudent[];
  updateInstitutionStudent: (id: string, patch: Partial<InstitutionStudent>) => void;
  departmentReports: DepartmentReport[];
  recruiterPartners: RecruiterPartner[];
  addRecruiterPartner: (partner: RecruiterPartner) => void;
  updateRecruiterPartner: (id: string, patch: Partial<RecruiterPartner>) => void;
  answers: Record<string, number>;
  setAnswer: (questionId: string, answer: number) => void;
  resetAnswers: () => void;
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

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<Role>("student");
  const [profile, setProfile] = useState<StudentProfile>(seedProfile);
  const [internships, setInternships] = useState<Internship[]>(seedInternships);
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [industryApps, setIndustryApps] = useState<Application[]>(seedIndustryApplications);
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [interviews, setInterviews] = useState<InterviewSchedule[]>(initialInterviews);
  const [trainingPrograms, setTrainingPrograms] =
    useState<TrainingProgram[]>(initialTrainingPrograms);
  const [facultyInternships, setFacultyInternships] =
    useState<FacultyInternship[]>(initialFacultyInternships);
  const [facultyTrainings, setFacultyTrainings] =
    useState<FacultyTraining[]>(initialFacultyTrainings);
  const [facultyFDPs, setFacultyFDPs] = useState<FacultyFDP[]>(initialFacultyFDPs);
  const [consultancyProjects, setConsultancyProjects] = useState<ConsultancyProject[]>(
    initialConsultancyProjects,
  );
  const [researchProjects, setResearchProjects] =
    useState<ResearchProject[]>(initialResearchProjects);
  const [guestLectures, setGuestLectures] = useState<GuestLectureSession[]>(initialGuestLectures);
  const [studentMentorships, setStudentMentorships] =
    useState<StudentMentorship[]>(initialStudentMentorships);
  const [institutionStudents, setInstitutionStudents] = useState<InstitutionStudent[]>(
    initialInstitutionStudents,
  );
  const [departmentReports, setDepartmentReports] =
    useState<DepartmentReport[]>(initialDepartmentReports);
  const [recruiterPartners, setRecruiterPartners] =
    useState<RecruiterPartner[]>(initialRecruiterPartners);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);
  const [assessmentScores, setAssessmentScores] = useState<AppState["assessmentScores"]>(null);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>(roadmapTemplate);
  const [savedInternships, setSavedInternships] = useState<string[]>([]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [jobs, setJobs] = useState<Job[]>(jobsMock);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>({
    name: "Nexora Labs",
    industry: "Enterprise AI & Cloud Platforms",
    location: "Bengaluru, India",
    logoHue: 220,
    description:
      "Building resilient cloud-native architectures, real-time analytics engines, and applied AI systems.",
    website: "https://nexoralabs.io",
  });

  const updateCompanyProfile = useCallback((patch: Partial<CompanyProfile>) => {
    setCompanyProfile((prev) => ({ ...prev, ...patch }));
  }, []);

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
    }));
  }, []);

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
    ],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used inside AppStateProvider");
  return ctx;
}
