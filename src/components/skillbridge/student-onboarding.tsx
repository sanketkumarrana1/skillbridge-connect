import { useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Code2,
  Compass,
  FileCheck,
  GraduationCap,
  Info,
  Layers,
  MapPin,
  Plus,
  Rocket,
  Search,
  ShieldAlert,
  Sparkles,
  Target,
  Trash2,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useAppState } from "@/context/app-state";
import { useAuth } from "@/context/auth-context";
import { StudentService } from "@/services/student-service";
import { CAREER_INTERESTS, TARGET_ROLES } from "@/data/career-catalog";
import { SKILL_CATEGORIES, SKILLS_LIBRARY } from "@/data/skills-catalog";
import type {
  AcademicProfile,
  CareerPreferences,
  DeclaredSkill,
  SkillCategory,
  SkillDefinition,
  SkillEvidenceItem,
  SkillEvidenceType,
  SkillProficiency,
} from "@/types";

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
];

const POPULAR_INSTITUTIONS = [
  "National Institute of Technology, Raipur",
  "Indian Institute of Technology, Bombay",
  "Indian Institute of Technology, Delhi",
  "BITS Pilani",
  "International Institute of Information Technology, Hyderabad",
  "Vellore Institute of Technology (VIT)",
  "Delhi Technological University (DTU)",
  "Anna University",
];

const POPULAR_PROGRAMS = [
  "Computer Science & Engineering",
  "Information Technology",
  "Artificial Intelligence & Machine Learning",
  "Data Science & Analytics",
  "Electronics & Communication Engineering",
  "Software Engineering",
  "Master of Computer Applications (MCA)",
  "Bachelor of Computer Applications (BCA)",
];

const EVIDENCE_TYPE_LABELS: Record<SkillEvidenceType, { label: string; icon: string }> = {
  project: { label: "Hands-on Project", icon: "Code2" },
  internship: { label: "Industry Internship", icon: "Briefcase" },
  certificate: { label: "Course / Certification", icon: "Award" },
  hackathon: { label: "Hackathon / Competition", icon: "Sparkles" },
  academic_project: { label: "Academic / Lab Project", icon: "BookOpen" },
  research: { label: "Research Paper / Publication", icon: "FileText" },
  freelance: { label: "Freelance Client Work", icon: "Building2" },
  open_source: { label: "Open Source Contribution", icon: "GitBranch" },
  self_learning: { label: "Self Learning / Practice", icon: "Target" },
  work_experience: { label: "Full-Time Work Experience", icon: "Briefcase" },
};

const PROFICIENCY_META: Record<
  SkillProficiency,
  { label: string; level: number; color: string; desc: string }
> = {
  beginner: {
    label: "Beginner",
    level: 45,
    color: "border-sky-500/40 bg-sky-500/15 text-sky-300",
    desc: "Understand core fundamentals and syntax; building introductory mini-projects.",
  },
  intermediate: {
    label: "Intermediate",
    level: 75,
    color: "border-indigo-500/40 bg-indigo-500/15 text-indigo-300",
    desc: "Comfortably write production features, debug problems, and integrate APIs.",
  },
  advanced: {
    label: "Advanced",
    level: 90,
    color: "border-purple-500/40 bg-purple-500/15 text-purple-300",
    desc: "Deep architectural mastery, performance optimization, and complex design patterns.",
  },
};

const STEPS = [
  { id: 1, title: "Personal Info", sub: "Identity & Contact" },
  { id: 2, title: "Academic Profile", sub: "College & Program" },
  { id: 3, title: "Career Direction", sub: "Interests & Roles" },
  { id: 4, title: "Skill Declaration", sub: "Skills & Evidence" },
  { id: 5, title: "Profile Goals", sub: "Work Preferences" },
  { id: 6, title: "Skill Passport", sub: "Verification Preview" },
];

export function StudentOnboarding() {
  const navigate = useNavigate();
  const { profile, updateProfile, completeOnboarding } = useAppState();
  const { user, isConfigured } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);

  // STEP 1 STATE: Personal Info
  const [name, setName] = useState(profile.name || "");
  const [email, setEmail] = useState(profile.email || "");
  const [phone, setPhone] = useState(profile.phone || "+91 98765 43210");
  const [city, setCity] = useState(profile.city || "Raipur");
  const [state, setState] = useState(profile.state || "Chhattisgarh");
  const [country, setCountry] = useState(profile.country || "India");
  const [avatar, setAvatar] = useState(profile.avatar || AVATAR_PRESETS[0]!);
  const [headline, setHeadline] = useState(
    profile.headline || "Full-Stack Engineer & Applied ML Enthusiast",
  );
  const [about, setAbout] = useState(profile.about || "Passionate about building scalable modern software systems.");

  // STEP 2 STATE: Academic Profile
  const [institution, setInstitution] = useState(
    profile.academicProfile?.institution ||
      profile.college ||
      "National Institute of Technology, Raipur",
  );
  const [degree, setDegree] = useState(
    profile.academicProfile?.degree || profile.degree || "B.Tech",
  );
  const [program, setProgram] = useState(
    profile.academicProfile?.program || profile.branch || "Computer Science & Engineering",
  );
  const [department, setDepartment] = useState(
    profile.academicProfile?.department || "Department of Computer Science & Engineering",
  );
  const [currentYear, setCurrentYear] = useState(
    profile.academicProfile?.currentYear || profile.year || "3rd Year",
  );
  const [graduationYear, setGraduationYear] = useState(
    profile.academicProfile?.graduationYear || "2026",
  );
  const [academicStatus, setAcademicStatus] = useState(
    profile.academicProfile?.academicStatus || "Pursuing Full-Time",
  );
  const [grade, setGrade] = useState(profile.academicProfile?.grade || "8.85 CGPA");

  // STEP 3 STATE: Career Direction
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    profile.careerPreferences?.careerInterests?.length
      ? profile.careerPreferences.careerInterests
      : ["Software Development", "Artificial Intelligence & ML", "Cloud Computing"],
  );
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    profile.careerPreferences?.targetRoles?.length
      ? profile.careerPreferences.targetRoles
      : ["Full Stack Developer", "Frontend Developer", "AI Engineer"],
  );
  const [roleSearchQuery, setRoleSearchQuery] = useState("");

  // STEP 4 STATE: Skill Declaration
  const [declaredSkills, setDeclaredSkills] = useState<DeclaredSkill[]>(
    profile.declaredSkills?.length
      ? profile.declaredSkills
      : [
          {
            id: "decl-init-1",
            skillId: "web-react",
            name: "React",
            category: "Web & Frontend",
            proficiency: "advanced",
            proficiencyLevel: 85,
            selfDeclared: true,
            verificationStatus: "evidence_added",
            evidence: [
              {
                id: "ev-init-1",
                type: "project",
                title: "CampusFlow Placement Tracker",
                description: "Built full responsive UI with React & Tailwind CSS",
                date: "2025",
              },
            ],
            addedAt: new Date().toISOString().split("T")[0]!,
          },
          {
            id: "decl-init-2",
            skillId: "lang-typescript",
            name: "TypeScript",
            category: "Programming Languages",
            proficiency: "intermediate",
            proficiencyLevel: 75,
            selfDeclared: true,
            verificationStatus: "evidence_added",
            evidence: [
              {
                id: "ev-init-2",
                type: "project",
                title: "DevBoard Realtime Workspace",
                description: "Implemented type-safe WebSockets state",
                date: "2024",
              },
            ],
            addedAt: new Date().toISOString().split("T")[0]!,
          },
          {
            id: "decl-init-3",
            skillId: "lang-python",
            name: "Python",
            category: "Programming Languages",
            proficiency: "advanced",
            proficiencyLevel: 90,
            selfDeclared: true,
            verificationStatus: "evidence_added",
            evidence: [
              {
                id: "ev-init-3",
                type: "academic_project",
                title: "LeafScan AI Crop Diagnostics",
                description: "Trained CNN model in Python/TensorFlow",
                date: "2025",
              },
            ],
            addedAt: new Date().toISOString().split("T")[0]!,
          },
          {
            id: "decl-init-4",
            skillId: "cs-dsa",
            name: "Data Structures & Algorithms",
            category: "Computer Science Fundamentals",
            proficiency: "advanced",
            proficiencyLevel: 80,
            selfDeclared: true,
            verificationStatus: "self_declared",
            evidence: [],
            addedAt: new Date().toISOString().split("T")[0]!,
          },
        ],
  );

  const [skillSearchQuery, setSkillSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("All");

  // Evidence Dialog State
  const [evidenceDialogOpen, setEvidenceDialogOpen] = useState(false);
  const [targetSkillForEvidence, setTargetSkillForEvidence] = useState<DeclaredSkill | null>(null);
  const [evidenceType, setEvidenceType] = useState<SkillEvidenceType>("project");
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceDesc, setEvidenceDesc] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");

  // STEP 5 STATE: Goals & Preferences
  const [preferredWorkTypes, setPreferredWorkTypes] = useState<string[]>(
    profile.careerPreferences?.preferredWorkTypes?.length
      ? profile.careerPreferences.preferredWorkTypes
      : ["Internship", "Full-time"],
  );
  const [preferredLocations, setPreferredLocations] = useState<string[]>(
    profile.careerPreferences?.preferredLocations?.length
      ? profile.careerPreferences.preferredLocations
      : ["Hybrid", "Remote"],
  );
  const [preferredCities, setPreferredCities] = useState<string[]>(
    profile.careerPreferences?.preferredCities?.length
      ? profile.careerPreferences.preferredCities
      : ["Bengaluru", "Hyderabad", "Pune", "Delhi NCR"],
  );
  const [cityInput, setCityInput] = useState("");
  const [availability, setAvailability] = useState(
    profile.careerPreferences?.availability || "Summer 2026",
  );
  const [targetOpportunityTypes, setTargetOpportunityTypes] = useState<string[]>(
    profile.careerPreferences?.targetOpportunityTypes?.length
      ? profile.careerPreferences.targetOpportunityTypes
      : ["Internship", "Job", "Live Project"],
  );

  // Skill Suggestions based on chosen Target Roles
  const suggestedSkills = useMemo(() => {
    const recommendedSet = new Set<string>();
    for (const roleTitle of selectedRoles) {
      const match = TARGET_ROLES.find((r) => r.title === roleTitle);
      if (match) {
        match.recommendedSkills.forEach((s) => recommendedSet.add(s));
      }
    }
    return Array.from(recommendedSet);
  }, [selectedRoles]);

  // Filtered Skills in Library
  const filteredSkillsLibrary = useMemo(() => {
    return SKILLS_LIBRARY.filter((skill) => {
      const matchesSearch =
        !skillSearchQuery ||
        skill.name.toLowerCase().includes(skillSearchQuery.toLowerCase()) ||
        skill.aliases.some((a) => a.toLowerCase().includes(skillSearchQuery.toLowerCase())) ||
        skill.tags.some((t) => t.toLowerCase().includes(skillSearchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategoryFilter === "All" || skill.category === selectedCategoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [skillSearchQuery, selectedCategoryFilter]);

  // Handle adding skill
  const handleToggleSkill = (skillDef: SkillDefinition) => {
    const existingIndex = declaredSkills.findIndex((s) => s.name === skillDef.name);
    if (existingIndex >= 0) {
      setDeclaredSkills((prev) => prev.filter((_, idx) => idx !== existingIndex));
      toast.info(`Removed ${skillDef.name} from declared skills`);
    } else {
      const newDeclared: DeclaredSkill = {
        id: `decl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        skillId: skillDef.id,
        name: skillDef.name,
        category: skillDef.category,
        proficiency: "intermediate",
        proficiencyLevel: 75,
        selfDeclared: true,
        verificationStatus: "self_declared",
        evidence: [],
        addedAt: new Date().toISOString().split("T")[0]!,
      };
      setDeclaredSkills((prev) => [...prev, newDeclared]);
      toast.success(`Added ${skillDef.name} (Set proficiency below)`);
    }
  };

  const handleUpdateProficiency = (skillName: string, prof: SkillProficiency) => {
    setDeclaredSkills((prev) =>
      prev.map((s) => {
        if (s.name === skillName) {
          return {
            ...s,
            proficiency: prof,
            proficiencyLevel: PROFICIENCY_META[prof].level,
          };
        }
        return s;
      }),
    );
  };

  const handleOpenAddEvidence = (declared: DeclaredSkill) => {
    setTargetSkillForEvidence(declared);
    setEvidenceTitle("");
    setEvidenceDesc("");
    setEvidenceUrl("");
    setEvidenceType("project");
    setEvidenceDialogOpen(true);
  };

  const handleSaveEvidence = () => {
    if (!targetSkillForEvidence || !evidenceTitle.trim()) {
      toast.error("Please enter an evidence title (e.g. Project Name or Certificate)");
      return;
    }

    const newEvidence: SkillEvidenceItem = {
      id: `ev-${Date.now()}`,
      type: evidenceType,
      title: evidenceTitle.trim(),
      description: evidenceDesc.trim() || undefined,
      url: evidenceUrl.trim() || undefined,
      date: "2025",
    };

    setDeclaredSkills((prev) =>
      prev.map((s) => {
        if (s.id === targetSkillForEvidence.id) {
          const nextEv = [...s.evidence, newEvidence];
          return {
            ...s,
            verificationStatus: "evidence_added",
            evidence: nextEv,
          };
        }
        return s;
      }),
    );

    toast.success(`Evidence linked to ${targetSkillForEvidence.name}`);
    setEvidenceDialogOpen(false);
  };

  const handleRemoveEvidence = (skillId: string, evidenceId: string) => {
    setDeclaredSkills((prev) =>
      prev.map((s) => {
        if (s.id === skillId) {
          const nextEv = s.evidence.filter((e) => e.id !== evidenceId);
          return {
            ...s,
            verificationStatus: nextEv.length > 0 ? "evidence_added" : "self_declared",
            evidence: nextEv,
          };
        }
        return s;
      }),
    );
    toast.info("Evidence removed");
  };

  // Final Complete & Save
  const handleCompleteOnboarding = async () => {
    if (!name.trim()) {
      toast.error("Please enter your name in Step 1");
      setCurrentStep(1);
      return;
    }
    if (declaredSkills.length === 0) {
      toast.error("Please declare at least 1 skill in Step 4");
      setCurrentStep(4);
      return;
    }

    const academicPayload: AcademicProfile = {
      institution: institution.trim(),
      degree: degree.trim(),
      program: program.trim(),
      department: department.trim(),
      currentYear,
      graduationYear,
      academicStatus,
      grade: grade.trim() || undefined,
    };

    const careerPrefsPayload: CareerPreferences = {
      careerInterests: selectedInterests,
      targetRoles: selectedRoles,
      preferredWorkTypes: preferredWorkTypes as CareerPreferences["preferredWorkTypes"],
      preferredLocations: preferredLocations as CareerPreferences["preferredLocations"],
      preferredCities,
      availability,
      targetOpportunityTypes: targetOpportunityTypes as CareerPreferences["targetOpportunityTypes"],
    };

    if (isConfigured && user) {
      const payload = {
        student_id: user.id,
        personal: {
          full_name: name.trim(),
          phone: phone.trim() || undefined,
          city: city.trim() || undefined,
          state: state.trim() || undefined,
          country: country.trim() || "India",
          avatar_url: avatar || undefined,
          headline: headline.trim() || undefined,
          about: about.trim() || undefined,
        },
        academic: {
          institution_name: institution.trim() || undefined,
          degree: degree.trim() || undefined,
          program: program.trim() || undefined,
          academic_year: currentYear || undefined,
          graduation_year: graduationYear || undefined,
          academic_status: academicStatus || "Enrolled",
          grade: grade.trim() || undefined,
        },
        career_preferences: {
          career_interests: selectedInterests,
          target_roles: selectedRoles,
          preferred_work_types: preferredWorkTypes,
          preferred_work_modes: preferredLocations,
          preferred_cities: preferredCities,
          availability,
          preferred_opportunity_types: targetOpportunityTypes,
        },
        declared_skills: declaredSkills.map((s) => ({
          skill_id: s.skillId,
          name: s.name,
          proficiency: s.proficiency,
          proficiency_level: s.proficiencyLevel,
          evidence: s.evidence.map((e) => ({
            type: e.type,
            title: e.title,
            description: e.description,
            url: e.url,
          })),
        })),
      };

      const res = await StudentService.saveOnboarding(payload);
      if (!res.success) {
        console.warn("[Onboarding] Persistent save notice:", res.error);
      }
    }

    // Update shared profile state
    updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: city.trim(),
      state: state.trim(),
      country: country.trim(),
      location: `${city.trim()}, ${country.trim()}`,
      avatar,
      headline: headline.trim(),
      about: about.trim(),
      college: institution.trim(),
      degree: degree.trim(),
      branch: program.trim(),
      year: currentYear,
      academicProfile: academicPayload,
      careerPreferences: careerPrefsPayload,
      declaredSkills,
      skills: declaredSkills.map((s) => ({
        name: s.name,
        score: s.proficiencyLevel,
      })),
      onboardingCompleted: true,
    });

    completeOnboarding();
    toast.success("Skill Passport created! Welcome to your AcadIn workspace.");
    navigate({ to: "/student" });
  };

  return (
    <div className="min-h-screen bg-[#070A13] text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#070A13]/85 px-4 py-4 backdrop-blur-xl sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] font-bold">
              <GraduationCap className="size-5" />
            </span>
            <div>
              <span className="font-display text-lg font-bold text-white">
                Acad<span className="text-gradient">In</span>
              </span>
              <span className="ml-2.5 hidden sm:inline-block text-xs font-semibold uppercase tracking-wider text-indigo-400 border-l border-white/10 pl-2.5">
                Student Profile & Skill Foundation
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300"
            >
              Step {currentStep} of 6
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-slate-400 hover:text-white"
              onClick={() => {
                if (window.confirm("Skip onboarding for now and explore student dashboard?")) {
                  completeOnboarding();
                  navigate({ to: "/student" });
                }
              }}
            >
              Explore Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
        {/* Multi-Step Progress Tracker */}
        <div className="mb-10">
          <div className="hidden sm:grid sm:grid-cols-6 gap-2">
            {STEPS.map((step) => {
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setCurrentStep(step.id)}
                  className={cn(
                    "text-left p-3 rounded-2xl border transition-all duration-200",
                    isCurrent
                      ? "border-indigo-500 bg-indigo-500/15 shadow-[0_0_15px_rgba(99,102,241,0.25)] text-white"
                      : isCompleted
                        ? "border-emerald-500/30 bg-emerald-500/10 text-slate-300"
                        : "border-white/5 bg-slate-900/40 text-slate-500 hover:border-white/15",
                  )}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span>0{step.id}</span>
                    {isCompleted && <Check className="size-3.5 text-emerald-400" />}
                  </div>
                  <p className="text-xs font-semibold truncate text-white">{step.title}</p>
                  <p className="text-[10px] text-slate-400 truncate">{step.sub}</p>
                </button>
              );
            })}
          </div>

          {/* Mobile Progress Bar */}
          <div className="sm:hidden space-y-2">
            <div className="flex justify-between text-xs font-medium text-slate-400">
              <span className="text-white font-semibold">
                Step {currentStep}: {STEPS[currentStep - 1]?.title}
              </span>
              <span>{Math.round((currentStep / 6) * 100)}% Completed</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 transition-all duration-300"
                style={{ width: `${(currentStep / 6) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Step Content Card */}
        <div className="glass-panel relative rounded-3xl p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <AnimatePresence mode="wait">
            {/* ================= STEP 1: PERSONAL INFO ================= */}
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <Badge className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
                    Step 1 · Identity & Profile
                  </Badge>
                  <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
                    Tell us about yourself
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Essential identity details for your verified AcadIn talent profile.
                  </p>
                </div>

                {/* Avatar Selection */}
                <div>
                  <Label className="text-xs font-semibold text-slate-300">
                    Profile Avatar / Photo
                  </Label>
                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    <img
                      src={avatar}
                      alt="Current avatar"
                      className="size-16 rounded-2xl border-2 border-indigo-500 object-cover shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                    />
                    <div className="flex flex-wrap gap-2">
                      {AVATAR_PRESETS.map((preset, idx) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setAvatar(preset)}
                          className={cn(
                            "size-11 overflow-hidden rounded-xl border transition hover:scale-105",
                            avatar === preset
                              ? "border-indigo-400 ring-2 ring-indigo-500/50"
                              : "border-white/10 opacity-70 hover:opacity-100",
                          )}
                        >
                          <img
                            src={preset}
                            alt={`Preset ${idx + 1}`}
                            className="size-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="s1-name" className="text-xs font-semibold text-slate-300">
                      Full Name *
                    </Label>
                    <Input
                      id="s1-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sanket Kumar Rana"
                      className="border-white/10 bg-slate-900/80 text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="s1-email" className="text-xs font-semibold text-slate-300">
                      Email Address *
                    </Label>
                    <Input
                      id="s1-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sanket.rana@student.edu"
                      className="border-white/10 bg-slate-900/80 text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="s1-phone" className="text-xs font-semibold text-slate-300">
                      Phone Number
                    </Label>
                    <Input
                      id="s1-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="border-white/10 bg-slate-900/80 text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="s1-headline" className="text-xs font-semibold text-slate-300">
                      Professional Headline
                    </Label>
                    <Input
                      id="s1-headline"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder="e.g. Full-Stack Engineer & Applied ML Enthusiast"
                      className="border-white/10 bg-slate-900/80 text-white"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="s1-city" className="text-xs font-semibold text-slate-300">
                      City
                    </Label>
                    <Input
                      id="s1-city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Raipur / Bengaluru"
                      className="border-white/10 bg-slate-900/80 text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="s1-state" className="text-xs font-semibold text-slate-300">
                      State / Province
                    </Label>
                    <Input
                      id="s1-state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Chhattisgarh / Karnataka"
                      className="border-white/10 bg-slate-900/80 text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="s1-country" className="text-xs font-semibold text-slate-300">
                      Country
                    </Label>
                    <Input
                      id="s1-country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="India"
                      className="border-white/10 bg-slate-900/80 text-white"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ================= STEP 2: ACADEMIC PROFILE ================= */}
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <Badge className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
                    Step 2 · Academic Background
                  </Badge>
                  <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
                    Your university & program
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    AcadIn supports diverse degree programs and institutions across India and
                    globally.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="s2-inst" className="text-xs font-semibold text-slate-300">
                      University / Institution *
                    </Label>
                    <Input
                      id="s2-inst"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      placeholder="e.g. National Institute of Technology, Raipur"
                      className="border-white/10 bg-slate-900/80 text-white"
                    />
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[11px] text-slate-500">Suggestions:</span>
                      {POPULAR_INSTITUTIONS.slice(0, 3).map((inst) => (
                        <button
                          key={inst}
                          type="button"
                          onClick={() => setInstitution(inst)}
                          className="text-[11px] text-indigo-300 hover:text-white underline underline-offset-2"
                        >
                          {inst.split(",")[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="s2-degree" className="text-xs font-semibold text-slate-300">
                        Degree *
                      </Label>
                      <select
                        id="s2-degree"
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="B.Tech">B.Tech (Bachelor of Technology)</option>
                        <option value="B.E.">B.E. (Bachelor of Engineering)</option>
                        <option value="BCA">BCA (Bachelor of Computer Applications)</option>
                        <option value="MCA">MCA (Master of Computer Applications)</option>
                        <option value="M.Tech">M.Tech (Master of Technology)</option>
                        <option value="B.Sc CS/IT">B.Sc (Computer Science / IT)</option>
                        <option value="M.Sc CS/IT">M.Sc (Computer Science / IT)</option>
                        <option value="Other / Diploma">Other Professional Program</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="s2-prog" className="text-xs font-semibold text-slate-300">
                        Program / Specialization *
                      </Label>
                      <Input
                        id="s2-prog"
                        value={program}
                        onChange={(e) => setProgram(e.target.value)}
                        placeholder="e.g. Computer Science & Engineering"
                        className="border-white/10 bg-slate-900/80 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="s2-year" className="text-xs font-semibold text-slate-300">
                        Current Academic Year
                      </Label>
                      <select
                        id="s2-year"
                        value={currentYear}
                        onChange={(e) => setCurrentYear(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="1st Year">1st Year (Freshman)</option>
                        <option value="2nd Year">2nd Year (Sophomore)</option>
                        <option value="3rd Year">3rd Year (Pre-Final)</option>
                        <option value="4th Year">4th Year (Final Year)</option>
                        <option value="Recent Graduate">Recent Graduate</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="s2-grad" className="text-xs font-semibold text-slate-300">
                        Graduation Year
                      </Label>
                      <select
                        id="s2-grad"
                        value={graduationYear}
                        onChange={(e) => setGraduationYear(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                        <option value="2028">2028</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="s2-grade" className="text-xs font-semibold text-slate-300">
                        CGPA / Score
                      </Label>
                      <Input
                        id="s2-grade"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        placeholder="e.g. 8.85 CGPA or 85%"
                        className="border-white/10 bg-slate-900/80 text-white"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ================= STEP 3: CAREER DIRECTION ================= */}
            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <Badge className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
                    Step 3 · Career Trajectory
                  </Badge>
                  <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
                    Where do you want to grow?
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Select broad career interest domains and specific target roles you are aiming
                    for.
                  </p>
                </div>

                {/* A. Broad Career Interests */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                      A. Select Career Interest Domains ({selectedInterests.length} selected)
                    </Label>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {CAREER_INTERESTS.map((interest) => {
                      const isSelected = selectedInterests.includes(interest.name);
                      return (
                        <button
                          key={interest.id}
                          type="button"
                          onClick={() => {
                            setSelectedInterests((prev) =>
                              isSelected
                                ? prev.filter((item) => item !== interest.name)
                                : [...prev, interest.name],
                            );
                          }}
                          className={cn(
                            "flex items-start gap-3.5 p-3.5 rounded-2xl border text-left transition-all duration-200",
                            isSelected
                              ? "border-indigo-500 bg-indigo-500/15 shadow-[0_0_15px_rgba(99,102,241,0.2)] text-white"
                              : "border-white/10 bg-slate-900/60 text-slate-400 hover:border-white/20 hover:text-slate-200",
                          )}
                        >
                          <span
                            className={cn(
                              "grid size-8 shrink-0 place-items-center rounded-lg border text-xs mt-0.5",
                              isSelected
                                ? "border-indigo-400 bg-indigo-500/30 text-indigo-300"
                                : "border-white/10 bg-slate-800 text-slate-400",
                            )}
                          >
                            <Sparkles className="size-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-white truncate">
                              {interest.name}
                            </p>
                            <p className="text-[11px] text-slate-400 leading-snug line-clamp-2 mt-0.5">
                              {interest.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* B. Searchable Target Roles */}
                <div className="border-t border-white/10 pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div>
                      <Label className="text-xs font-bold uppercase tracking-wider text-purple-400">
                        B. Search & Choose Target Roles ({selectedRoles.length} selected)
                      </Label>
                      <p className="text-xs text-slate-400 mt-0.5">
                        These will drive personalized skill gap analysis and internship matching.
                      </p>
                    </div>
                    <div className="relative w-full sm:max-w-xs">
                      <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-500" />
                      <Input
                        value={roleSearchQuery}
                        onChange={(e) => setRoleSearchQuery(e.target.value)}
                        placeholder="Search target roles..."
                        className="pl-8 h-8 text-xs border-white/10 bg-slate-900/80 text-white"
                      />
                    </div>
                  </div>

                  {/* Selected Roles Chips */}
                  {selectedRoles.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2 p-3 rounded-2xl border border-indigo-500/30 bg-indigo-500/10">
                      <span className="text-xs font-semibold text-indigo-300 self-center mr-1">
                        Active Targets:
                      </span>
                      {selectedRoles.map((roleTitle) => (
                        <Badge
                          key={roleTitle}
                          className="bg-indigo-600/80 text-white border-indigo-400/40 gap-1.5 py-1 px-2.5 text-xs"
                        >
                          {roleTitle}
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedRoles((prev) => prev.filter((r) => r !== roleTitle))
                            }
                            className="hover:text-rose-300"
                          >
                            <X className="size-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Role Cards Grid */}
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 max-h-[320px] overflow-y-auto pr-1">
                    {TARGET_ROLES.filter(
                      (role) =>
                        !roleSearchQuery ||
                        role.title.toLowerCase().includes(roleSearchQuery.toLowerCase()) ||
                        role.category.toLowerCase().includes(roleSearchQuery.toLowerCase()),
                    ).map((role) => {
                      const isSelected = selectedRoles.includes(role.title);
                      return (
                        <div
                          key={role.id}
                          onClick={() => {
                            setSelectedRoles((prev) =>
                              isSelected
                                ? prev.filter((r) => r !== role.title)
                                : [...prev, role.title],
                            );
                          }}
                          className={cn(
                            "cursor-pointer p-3.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between",
                            isSelected
                              ? "border-purple-500 bg-purple-500/15 shadow-[0_0_15px_rgba(168,85,247,0.25)] text-white"
                              : "border-white/10 bg-slate-900/60 text-slate-300 hover:border-white/20",
                          )}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                                {role.category}
                              </span>
                              {isSelected ? (
                                <CheckCircle2 className="size-4 text-purple-400" />
                              ) : (
                                <Plus className="size-4 text-slate-500" />
                              )}
                            </div>
                            <h4 className="font-display font-bold text-sm text-white mt-1">
                              {role.title}
                            </h4>
                            <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                              {role.description}
                            </p>
                          </div>
                          <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                            <span>{role.recommendedSkills.length} recommended skills</span>
                            <span className="text-emerald-400 font-medium">High Demand</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ================= STEP 4: SKILL DECLARATION (CORE ENGINE) ================= */}
            {currentStep === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <Badge className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
                    Step 4 · Core Skill Library
                  </Badge>
                  <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
                    Declare your technical skills
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Search from hundreds of categorized skills, set your self-reported proficiency,
                    and attach project evidence.
                  </p>
                </div>

                {/* Suggested Skills Banner from Target Roles */}
                {suggestedSkills.length > 0 && (
                  <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-4">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">
                      <Sparkles className="size-3.5" /> Recommended for your target roles:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestedSkills.map((skillName) => {
                        const isDeclared = declaredSkills.some((s) => s.name === skillName);
                        const matchDef = SKILLS_LIBRARY.find((s) => s.name === skillName);
                        return (
                          <button
                            key={skillName}
                            type="button"
                            onClick={() => {
                              if (matchDef) handleToggleSkill(matchDef);
                            }}
                            className={cn(
                              "text-xs px-2.5 py-1 rounded-full border transition-all flex items-center gap-1.5",
                              isDeclared
                                ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300 font-semibold"
                                : "border-indigo-400/30 bg-slate-900/80 text-indigo-200 hover:border-indigo-400",
                            )}
                          >
                            {isDeclared ? (
                              <Check className="size-3" />
                            ) : (
                              <Plus className="size-3" />
                            )}
                            {skillName}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Search & Category Filter Bar */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        value={skillSearchQuery}
                        onChange={(e) => setSkillSearchQuery(e.target.value)}
                        placeholder="Search skills, tools, frameworks, or aliases (e.g. React, Docker, PyTorch, DSA)..."
                        className="pl-10 border-white/10 bg-slate-900/80 text-white"
                      />
                    </div>
                  </div>

                  {/* Category Pill Filters */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
                    <button
                      type="button"
                      onClick={() => setSelectedCategoryFilter("All")}
                      className={cn(
                        "shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition",
                        selectedCategoryFilter === "All"
                          ? "border-indigo-500 bg-indigo-500/20 text-white"
                          : "border-white/10 bg-slate-900/60 text-slate-400 hover:text-white",
                      )}
                    >
                      All Categories ({SKILLS_LIBRARY.length})
                    </button>
                    {SKILL_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategoryFilter(cat)}
                        className={cn(
                          "shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition",
                          selectedCategoryFilter === cat
                            ? "border-indigo-500 bg-indigo-500/20 text-white"
                            : "border-white/10 bg-slate-900/60 text-slate-400 hover:text-white",
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Results / Library Grid */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 max-h-[280px] overflow-y-auto pr-1 border border-white/10 rounded-2xl p-3 bg-slate-950/40">
                  {filteredSkillsLibrary.map((skill) => {
                    const isSelected = declaredSkills.some((s) => s.name === skill.name);
                    return (
                      <div
                        key={skill.id}
                        onClick={() => handleToggleSkill(skill)}
                        className={cn(
                          "cursor-pointer p-3 rounded-xl border text-left transition-all duration-200 flex items-center justify-between",
                          isSelected
                            ? "border-indigo-500/60 bg-indigo-500/15 text-white"
                            : "border-white/10 bg-slate-900/60 text-slate-300 hover:border-white/20",
                        )}
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-semibold text-xs text-white truncate">{skill.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{skill.category}</p>
                        </div>
                        <span
                          className={cn(
                            "grid size-6 shrink-0 place-items-center rounded-lg border text-xs",
                            isSelected
                              ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                              : "border-white/10 bg-slate-800 text-slate-400",
                          )}
                        >
                          {isSelected ? (
                            <Check className="size-3.5" />
                          ) : (
                            <Plus className="size-3.5" />
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Selected Skills Management Panel */}
                <div className="border-t border-white/10 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-display text-lg font-bold text-white">
                        Your Declared Skills ({declaredSkills.length})
                      </h3>
                      <p className="text-xs text-slate-400">
                        Set self-reported proficiency and attach project evidence to back up your
                        claims.
                      </p>
                    </div>
                    <Badge variant="outline" className="border-indigo-500/30 text-indigo-300">
                      All Self Declared
                    </Badge>
                  </div>

                  {declaredSkills.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/40 p-8 text-center">
                      <Target className="mx-auto size-8 text-slate-500" />
                      <p className="mt-3 font-semibold text-sm text-slate-300">
                        No skills declared yet
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Pick skills from the catalog above to build your Skill Passport.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {declaredSkills.map((declared) => (
                        <div
                          key={declared.id}
                          className="glass-card-interactive rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="font-display font-bold text-base text-white">
                                {declared.name}
                              </span>
                              <Badge
                                variant="outline"
                                className="text-[10px] border-white/10 bg-slate-800/80 text-slate-400"
                              >
                                {declared.category}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-[10px] font-semibold",
                                  PROFICIENCY_META[declared.proficiency].color,
                                )}
                              >
                                {PROFICIENCY_META[declared.proficiency].label}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-[10px]",
                                  declared.evidence.length > 0
                                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                                    : "border-slate-700 bg-slate-800/50 text-slate-400",
                                )}
                              >
                                {declared.evidence.length > 0
                                  ? `${declared.evidence.length} Evidence Attached`
                                  : "Self Declared · Verification Pending"}
                              </Badge>
                            </div>

                            {/* Evidence List */}
                            {declared.evidence.length > 0 && (
                              <div className="mt-2.5 flex flex-wrap gap-2">
                                {declared.evidence.map((ev) => (
                                  <span
                                    key={ev.id}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/90 px-2 py-1 text-[11px] text-slate-300"
                                  >
                                    <FileCheck className="size-3 text-indigo-400" />
                                    <span className="font-medium truncate max-w-[180px]">
                                      {ev.title}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveEvidence(declared.id, ev.id)}
                                      className="text-slate-500 hover:text-rose-400 ml-1"
                                    >
                                      <X className="size-3" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Action Controls: Proficiency Toggle + Add Evidence + Delete */}
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="flex rounded-xl border border-white/10 bg-slate-900/80 p-1">
                              {(["beginner", "intermediate", "advanced"] as const).map((lvl) => (
                                <button
                                  key={lvl}
                                  type="button"
                                  onClick={() => handleUpdateProficiency(declared.name, lvl)}
                                  className={cn(
                                    "px-2.5 py-1 text-[11px] font-semibold rounded-lg capitalize transition",
                                    declared.proficiency === lvl
                                      ? "bg-indigo-600 text-white shadow-sm"
                                      : "text-slate-400 hover:text-white",
                                  )}
                                >
                                  {lvl}
                                </button>
                              ))}
                            </div>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenAddEvidence(declared)}
                              className="text-xs border-white/10 bg-slate-900/60 text-slate-300 hover:text-white gap-1"
                            >
                              <Plus className="size-3" /> Evidence
                            </Button>

                            <button
                              type="button"
                              onClick={() =>
                                setDeclaredSkills((prev) =>
                                  prev.filter((s) => s.id !== declared.id),
                                )
                              }
                              className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ================= STEP 5: PROFILE GOALS & WORK PREFERENCES ================= */}
            {currentStep === 5 && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <Badge className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
                    Step 5 · Opportunity Preferences
                  </Badge>
                  <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
                    Opportunity matching criteria
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Specify what kinds of roles, work modes, and availability you are looking for.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Preferred Work Type */}
                  <div>
                    <Label className="text-xs font-semibold text-slate-300">
                      Preferred Work Types
                    </Label>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {["Internship", "Full-time", "Part-time", "Freelance", "Apprenticeship"].map(
                        (item) => {
                          const isSelected = preferredWorkTypes.includes(item);
                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() => {
                                setPreferredWorkTypes((prev) =>
                                  isSelected ? prev.filter((w) => w !== item) : [...prev, item],
                                );
                              }}
                              className={cn(
                                "px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition",
                                isSelected
                                  ? "border-indigo-500 bg-indigo-500/20 text-white"
                                  : "border-white/10 bg-slate-900/60 text-slate-400 hover:text-white",
                              )}
                            >
                              {item}
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>

                  {/* Preferred Location Modes */}
                  <div>
                    <Label className="text-xs font-semibold text-slate-300">
                      Preferred Work Mode
                    </Label>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {["On-site", "Hybrid", "Remote"].map((mode) => {
                        const isSelected = preferredLocations.includes(mode);
                        return (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => {
                              setPreferredLocations((prev) =>
                                isSelected ? prev.filter((m) => m !== mode) : [...prev, mode],
                              );
                            }}
                            className={cn(
                              "px-4 py-2 rounded-xl border text-xs font-semibold transition",
                              isSelected
                                ? "border-purple-500 bg-purple-500/20 text-white"
                                : "border-white/10 bg-slate-900/60 text-slate-400 hover:text-white",
                            )}
                          >
                            {mode}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Preferred Cities */}
                  <div>
                    <Label className="text-xs font-semibold text-slate-300">
                      Target Locations / Cities
                    </Label>
                    <div className="mt-2 flex flex-wrap gap-1.5 mb-2">
                      {preferredCities.map((city) => (
                        <Badge
                          key={city}
                          className="bg-slate-800 text-slate-200 border-white/10 gap-1"
                        >
                          {city}
                          <button
                            type="button"
                            onClick={() =>
                              setPreferredCities((prev) => prev.filter((c) => c !== city))
                            }
                            className="hover:text-rose-300"
                          >
                            <X className="size-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2 max-w-sm">
                      <Input
                        value={cityInput}
                        onChange={(e) => setCityInput(e.target.value)}
                        placeholder="Add city (e.g. Bengaluru, Pune)..."
                        className="border-white/10 bg-slate-900/80 text-white text-xs h-9"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && cityInput.trim()) {
                            e.preventDefault();
                            if (!preferredCities.includes(cityInput.trim())) {
                              setPreferredCities((prev) => [...prev, cityInput.trim()]);
                            }
                            setCityInput("");
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        type="button"
                        onClick={() => {
                          if (cityInput.trim() && !preferredCities.includes(cityInput.trim())) {
                            setPreferredCities((prev) => [...prev, cityInput.trim()]);
                            setCityInput("");
                          }
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-slate-300">
                        Joining Availability
                      </Label>
                      <select
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Immediate">Immediate (Within 1-2 weeks)</option>
                        <option value="Within 1 Month">Within 1 Month</option>
                        <option value="Summer 2026">Summer 2026 (May - July)</option>
                        <option value="Winter 2026">Winter 2026 (Dec - Jan)</option>
                        <option value="Post Graduation">Post Graduation</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-slate-300">
                        Target Opportunity Category
                      </Label>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {["Internship", "Job", "Live Project", "Training", "Mentorship"].map(
                          (opp) => {
                            const isSelected = targetOpportunityTypes.includes(opp);
                            return (
                              <button
                                key={opp}
                                type="button"
                                onClick={() => {
                                  setTargetOpportunityTypes((prev) =>
                                    isSelected ? prev.filter((o) => o !== opp) : [...prev, opp],
                                  );
                                }}
                                className={cn(
                                  "px-2.5 py-1 rounded-lg border text-xs font-medium transition",
                                  isSelected
                                    ? "border-pink-500/50 bg-pink-500/20 text-pink-300 font-semibold"
                                    : "border-white/10 bg-slate-900/60 text-slate-400 hover:text-white",
                                )}
                              >
                                {opp}
                              </button>
                            );
                          },
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ================= STEP 6: STUDENT SKILL PASSPORT REVIEW ================= */}
            {currentStep === 6 && (
              <motion.div
                key="step-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                    Step 6 · Student Skill Passport
                  </Badge>
                  <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
                    Review your verified profile passport
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Here is how your declared skills, academic credentials, and evidence will
                    present to campus recruiters.
                  </p>
                </div>

                {/* Skill Passport Summary Card */}
                <div className="rounded-3xl border border-indigo-500/40 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/60 p-6 sm:p-8 shadow-[0_0_40px_rgba(99,102,241,0.25)]">
                  {/* Passport Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={avatar}
                        alt={name}
                        className="size-16 rounded-2xl border-2 border-indigo-400 object-cover shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-xl font-bold text-white">{name}</h3>
                          <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/40 text-[10px]">
                            Student Passport
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                          {degree} in {program} · {institution}
                        </p>
                        <p className="text-xs text-slate-400">{headline}</p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-300">
                        <ShieldAlert className="size-3.5" />
                        Self Declared · Verification Pending
                      </span>
                    </div>
                  </div>

                  {/* Target Roles */}
                  <div className="mt-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Target Career Roles
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedRoles.map((role) => (
                        <Badge
                          key={role}
                          className="border-purple-500/40 bg-purple-500/15 text-purple-300 text-xs py-1"
                        >
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Skills Grid */}
                  <div className="mt-6 border-t border-white/10 pt-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Declared Skill Capabilities ({declaredSkills.length})
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {declaredSkills.map((s) => (
                        <div
                          key={s.id}
                          className="rounded-2xl border border-white/10 bg-slate-900/80 p-3.5"
                        >
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="font-bold text-white text-sm">{s.name}</span>
                            <span
                              className={cn(
                                "font-semibold capitalize text-xs",
                                s.proficiency === "advanced"
                                  ? "text-purple-400"
                                  : s.proficiency === "intermediate"
                                    ? "text-indigo-400"
                                    : "text-sky-400",
                              )}
                            >
                              {s.proficiency} ({s.proficiencyLevel}%)
                            </span>
                          </div>

                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800 mb-2">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-pink-400"
                              style={{ width: `${s.proficiencyLevel}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span>{s.category}</span>
                            <span className="text-slate-300">
                              {s.evidence.length > 0
                                ? `✓ ${s.evidence.length} evidence linked`
                                : "Pending evidence"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls (Back / Next / Save) */}
          <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
            <Button
              variant="outline"
              disabled={currentStep === 1}
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              className="border-white/10 bg-slate-900/60 text-slate-300 hover:text-white"
            >
              <ArrowLeft className="size-4 mr-1.5" /> Back
            </Button>

            <div className="flex items-center gap-3">
              {currentStep < 6 ? (
                <Button
                  onClick={() => setCurrentStep((prev) => Math.min(6, prev + 1))}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                >
                  Save & Continue <ArrowRight className="size-4 ml-1.5" />
                </Button>
              ) : (
                <Button
                  onClick={handleCompleteOnboarding}
                  className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white font-bold shadow-[0_0_25px_rgba(16,185,129,0.4)] px-6"
                >
                  <Rocket className="size-4 mr-2" /> Complete & Enter Workspace
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modal: Attach Skill Evidence */}
      <Dialog open={evidenceDialogOpen} onOpenChange={setEvidenceDialogOpen}>
        <DialogContent className="border-white/10 bg-[#0E1322]/95 text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold text-white flex items-center gap-2">
              <FileCheck className="size-5 text-indigo-400" />
              Attach Evidence for {targetSkillForEvidence?.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Provide verifiable proof (e.g. project repository, certificate, internship)
              demonstrating how you applied this skill.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-300">Evidence Category</Label>
              <select
                value={evidenceType}
                onChange={(e) => setEvidenceType(e.target.value as SkillEvidenceType)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {Object.entries(EVIDENCE_TYPE_LABELS).map(([key, { label }]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-300">Evidence Title *</Label>
              <Input
                value={evidenceTitle}
                onChange={(e) => setEvidenceTitle(e.target.value)}
                placeholder="e.g. Campus Placement Management System"
                className="border-white/10 bg-slate-900/80 text-white text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-300">Description / Context</Label>
              <Textarea
                value={evidenceDesc}
                onChange={(e) => setEvidenceDesc(e.target.value)}
                placeholder="Briefly describe what you built or solved with this skill..."
                rows={2}
                className="border-white/10 bg-slate-900/80 text-white text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-300">Link / URL (Optional)</Label>
              <Input
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                placeholder="https://github.com/username/project"
                className="border-white/10 bg-slate-900/80 text-white text-xs"
              />
            </div>
          </div>

          <DialogFooter className="border-t border-white/10 pt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEvidenceDialogOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveEvidence}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
            >
              Attach Evidence
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
