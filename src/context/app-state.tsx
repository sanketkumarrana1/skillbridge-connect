import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  industryApplications as seedIndustryApplications,
  initialApplications,
  initialCandidates,
  internships as seedInternships,
  studentProfile as seedProfile,
} from "@/data/mock";
import type {
  Application,
  ApplicationStatus,
  Candidate,
  Internship,
  Role,
  SkillLevel,
  StudentProfile,
} from "@/types";

interface AppState {
  role: Role;
  setRole: (role: Role) => void;
  profile: StudentProfile;
  updateProfile: (patch: Partial<StudentProfile>) => void;
  internships: Internship[];
  addInternship: (internship: Internship) => void;
  applications: Application[];
  applyTo: (internship: Internship) => boolean;
  hasApplied: (id: string) => boolean;
  industryApps: Application[];
  setIndustryStatus: (id: string, status: ApplicationStatus) => void;
  candidates: Candidate[];
  toggleShortlist: (id: string) => boolean;
  answers: Record<string, SkillLevel>;
  setAnswer: (questionId: string, level: SkillLevel) => void;
  resetAnswers: () => void;
}

const AppStateContext = createContext<AppState | null>(null);

const today = () =>
  new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("student");
  const [profile, setProfile] = useState<StudentProfile>(seedProfile);
  const [internships, setInternships] = useState<Internship[]>(seedInternships);
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [industryApps, setIndustryApps] = useState<Application[]>(seedIndustryApplications);
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [answers, setAnswers] = useState<Record<string, SkillLevel>>({});

  const updateProfile = useCallback((patch: Partial<StudentProfile>) => {
    setProfile((p) => ({ ...p, ...patch }));
  }, []);

  const addInternship = useCallback((internship: Internship) => {
    setInternships((list) => [internship, ...list]);
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
        },
        ...list,
      ];
    });
    return added;
  }, []);

  const setIndustryStatus = useCallback((id: string, status: ApplicationStatus) => {
    setIndustryApps((list) => list.map((a) => (a.id === id ? { ...a, status } : a)));
  }, []);

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

  const setAnswer = useCallback((questionId: string, level: SkillLevel) => {
    setAnswers((a) => ({ ...a, [questionId]: level }));
  }, []);

  const resetAnswers = useCallback(() => setAnswers({}), []);

  const value = useMemo(
    () => ({
      role,
      setRole,
      profile,
      updateProfile,
      internships,
      addInternship,
      applications,
      applyTo,
      hasApplied,
      industryApps,
      setIndustryStatus,
      candidates,
      toggleShortlist,
      answers,
      setAnswer,
      resetAnswers,
    }),
    [
      role,
      profile,
      updateProfile,
      internships,
      addInternship,
      applications,
      applyTo,
      hasApplied,
      industryApps,
      setIndustryStatus,
      candidates,
      toggleShortlist,
      answers,
      setAnswer,
      resetAnswers,
    ],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used inside AppStateProvider");
  return ctx;
}
