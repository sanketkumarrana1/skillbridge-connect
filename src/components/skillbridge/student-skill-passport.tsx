import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Award,
  BookOpen,
  Briefcase,
  Check,
  CheckCircle2,
  Code2,
  Compass,
  ExternalLink,
  FileCheck,
  FileText,
  Filter,
  GraduationCap,
  HelpCircle,
  Layers,
  MapPin,
  Plus,
  Search,
  ShieldAlert,
  ShieldCheck,
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
import { SKILL_CATEGORIES, SKILLS_LIBRARY } from "@/data/skills-catalog";
import { readinessEngine } from "@/services/readiness/readiness-engine";
import { validateDocumentFile, formatBytes } from "@/utils/document-validator";
import type { SkillPassportItemStatus } from "@/types";
import type {
  DeclaredSkill,
  SkillCategory,
  SkillDefinition,
  SkillEvidenceItem,
  SkillEvidenceType,
  SkillProficiency,
} from "@/types";

const PROFICIENCY_META: Record<
  SkillProficiency,
  { label: string; level: number; color: string; desc: string }
> = {
  beginner: {
    label: "Beginner",
    level: 45,
    color: "border-sky-500/40 bg-sky-500/15 text-sky-300",
    desc: "Building foundational concepts & simple scripts.",
  },
  intermediate: {
    label: "Intermediate",
    level: 75,
    color: "border-indigo-500/40 bg-indigo-500/15 text-indigo-300",
    desc: "Writing production features & integrating APIs.",
  },
  advanced: {
    label: "Advanced",
    level: 90,
    color: "border-purple-500/40 bg-purple-500/15 text-purple-300",
    desc: "Architectural mastery & complex systems design.",
  },
};

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

export function StudentSkillPassport() {
  const {
    profile,
    addDeclaredSkill,
    updateDeclaredSkill,
    removeDeclaredSkill,
    addSkillEvidence,
    removeSkillEvidence,
  } = useAppState();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  // Add Skill Modal
  const [addSkillModalOpen, setAddSkillModalOpen] = useState(false);
  const [librarySearchQuery, setLibrarySearchQuery] = useState("");
  const [libraryCategoryFilter, setLibraryCategoryFilter] = useState<string>("All");
  const [modalProficiency, setModalProficiency] = useState<SkillProficiency>("intermediate");

  // Add Evidence Modal
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [targetSkillForEvidence, setTargetSkillForEvidence] = useState<DeclaredSkill | null>(null);
  const [evidenceType, setEvidenceType] = useState<SkillEvidenceType>("project");
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceDesc, setEvidenceDesc] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [uploadedEvidenceName, setUploadedEvidenceName] = useState<string | null>(null);
  const [uploadedEvidenceSize, setUploadedEvidenceSize] = useState<string | null>(null);

  const declaredSkills = useMemo(() => profile.declaredSkills ?? [], [profile.declaredSkills]);

  // Filter declared skills
  const filteredDeclaredSkills = useMemo(() => {
    return declaredSkills.filter((s) => {
      const matchSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = categoryFilter === "All" || s.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [declaredSkills, searchQuery, categoryFilter]);

  // Library skills for adding
  const availableLibrarySkills = useMemo(() => {
    return SKILLS_LIBRARY.filter((skill) => {
      const matchSearch =
        !librarySearchQuery ||
        skill.name.toLowerCase().includes(librarySearchQuery.toLowerCase()) ||
        skill.aliases.some((a) => a.toLowerCase().includes(librarySearchQuery.toLowerCase()));
      const matchCat = libraryCategoryFilter === "All" || skill.category === libraryCategoryFilter;
      return matchSearch && matchCat;
    });
  }, [librarySearchQuery, libraryCategoryFilter]);

  const handleAddSkillFromLibrary = (def: SkillDefinition) => {
    const isAlreadyDeclared = declaredSkills.some((s) => s.name === def.name);
    if (isAlreadyDeclared) {
      toast.info(`${def.name} is already in your Skill Passport`);
      return;
    }

    const newSkill: DeclaredSkill = {
      id: `decl-${Date.now()}`,
      skillId: def.id,
      name: def.name,
      category: def.category,
      proficiency: modalProficiency,
      proficiencyLevel: PROFICIENCY_META[modalProficiency].level,
      selfDeclared: true,
      verificationStatus: "self_declared",
      evidence: [],
      addedAt: new Date().toISOString().split("T")[0]!,
    };

    addDeclaredSkill(newSkill);
    toast.success(`Added ${def.name} (${modalProficiency}) to Skill Passport`);
  };

  const handleOpenEvidence = (skill: DeclaredSkill) => {
    setTargetSkillForEvidence(skill);
    setEvidenceTitle("");
    setEvidenceDesc("");
    setEvidenceUrl("");
    setEvidenceType("project");
    setUploadedEvidenceName(null);
    setUploadedEvidenceSize(null);
    setEvidenceModalOpen(true);
  };

  const handleSaveEvidence = () => {
    if (!targetSkillForEvidence || !evidenceTitle.trim()) {
      toast.error("Please enter an evidence title");
      return;
    }

    const descWithFile = uploadedEvidenceName
      ? `${evidenceDesc.trim()} [Attached Document: ${uploadedEvidenceName} (${uploadedEvidenceSize})]`.trim()
      : evidenceDesc.trim();

    addSkillEvidence(targetSkillForEvidence.name, {
      type: evidenceType,
      title: evidenceTitle.trim(),
      description: descWithFile || undefined,
      url: evidenceUrl.trim() || undefined,
      date: "2025",
    });

    toast.success(`Evidence linked to ${targetSkillForEvidence.name}`);
    setEvidenceModalOpen(false);
  };

  const totalEvidenceCount = declaredSkills.reduce((acc, s) => acc + s.evidence.length, 0);
  const targetRoles = profile.careerPreferences?.targetRoles ?? [
    "Full Stack Developer",
    "Frontend Developer",
  ];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-indigo-400">
            Student Skill Passport
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Verified Skill Foundation
          </h1>
          <p className="mt-1.5 text-sm text-slate-400 max-w-2xl">
            Your centralized capability ledger. Declared skills, self-reported proficiencies, and
            linked project evidence recognized by partner teams.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            asChild
            className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold shadow-[0_0_20px_rgba(99,102,241,0.4)]"
          >
            <Link to="/student/assessment">
              <Sparkles className="size-4 mr-1.5" /> Take Adaptive Assessment
            </Link>
          </Button>
          <Button
            onClick={() => setAddSkillModalOpen(true)}
            variant="outline"
            className="border-white/10 bg-slate-900/60 text-slate-300 hover:text-white"
          >
            <Plus className="size-4 mr-1.5" /> Declare New Skill
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-white/10 bg-slate-900/60 text-slate-300 hover:text-white"
          >
            <Link to="/student/settings">Edit Preferences</Link>
          </Button>
        </div>
      </div>

      {/* Main Passport Identity Container */}
      <div className="rounded-3xl border border-indigo-500/40 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/60 p-6 sm:p-8 shadow-[0_0_50px_rgba(99,102,241,0.2)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <img
              src={
                profile.avatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
              }
              alt={profile.name}
              className="size-20 rounded-2xl border-2 border-indigo-400 object-cover shadow-[0_0_20px_rgba(99,102,241,0.4)]"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display text-2xl font-bold text-white">{profile.name}</h2>
                <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/40 text-xs">
                  Passport ID: ACD-STU-{profile.name.slice(0, 3).toUpperCase()}-2026
                </Badge>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {profile.academicProfile?.degree || profile.degree} in{" "}
                {profile.academicProfile?.program || profile.branch} ·{" "}
                {profile.academicProfile?.institution || profile.college}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{profile.headline}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                Verification Ledger
              </p>
              <p className="font-semibold text-xs text-indigo-200 mt-0.5 flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-indigo-400" />
                Self Declared ✓ · Assessed (Stage 2) · Verification: Pending
              </p>
            </div>
          </div>
        </div>

        {/* Target Roles & Metadata Badges */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-3">
              Target Roles:
            </span>
            <div className="inline-flex flex-wrap gap-2 mt-2 md:mt-0">
              {targetRoles.map((role) => (
                <Badge
                  key={role}
                  className="border-purple-500/40 bg-purple-500/15 text-purple-300 text-xs py-1"
                >
                  <Target className="size-3 mr-1" />
                  {role}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <div>
              <span className="font-bold text-white text-sm">{declaredSkills.length}</span> Declared
            </div>
            <div>
              <span className="font-bold text-indigo-300 text-sm">
                {declaredSkills.filter((s) => s.assessedScore !== undefined).length}
              </span>{" "}
              Assessed
            </div>
            <div>
              <span className="font-bold text-emerald-400 text-sm">{totalEvidenceCount}</span>{" "}
              Evidence Items
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search declared skills in passport..."
            className="pl-10 border-white/10 bg-slate-900/80 text-white"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
          <button
            type="button"
            onClick={() => setCategoryFilter("All")}
            className={cn(
              "shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition",
              categoryFilter === "All"
                ? "border-indigo-500 bg-indigo-500/20 text-white"
                : "border-white/10 bg-slate-900/60 text-slate-400 hover:text-white",
            )}
          >
            All Categories ({declaredSkills.length})
          </button>
          {SKILL_CATEGORIES.map((cat) => {
            const count = declaredSkills.filter((s) => s.category === cat).length;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={cn(
                  "shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition",
                  categoryFilter === cat
                    ? "border-indigo-500 bg-indigo-500/20 text-white"
                    : "border-white/10 bg-slate-900/60 text-slate-400 hover:text-white",
                )}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Declared Skills Grid */}
      {filteredDeclaredSkills.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/40 p-12 text-center">
          <Target className="mx-auto size-10 text-slate-500" />
          <p className="mt-4 font-display text-lg font-bold text-white">
            No declared skills match your filter
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Clear search filters or add new skills from the library.
          </p>
          <Button
            onClick={() => setAddSkillModalOpen(true)}
            className="mt-5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs"
          >
            <Plus className="size-3.5 mr-1" /> Add Skills to Passport
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredDeclaredSkills.map((declared) => {
            const status: SkillPassportItemStatus =
              readinessEngine.evaluateSkillPassportStatus(declared);
            const statusConfig = {
              "High Confidence": {
                color: "border-purple-500/40 bg-purple-500/15 text-purple-300",
                icon: Sparkles,
              },
              Strong: {
                color: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
                icon: CheckCircle2,
              },
              Developing: {
                color: "border-indigo-500/40 bg-indigo-500/15 text-indigo-300",
                icon: ShieldCheck,
              },
              "Needs Improvement": {
                color: "border-amber-500/40 bg-amber-500/15 text-amber-300",
                icon: AlertTriangle,
              },
              Unassessed: {
                color: "border-slate-700 bg-slate-800/80 text-slate-400",
                icon: HelpCircle,
              },
            }[status];
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={declared.id}
                className="glass-card-interactive rounded-3xl p-6 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-display text-lg font-bold text-white">
                          {declared.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className={cn("text-[10px] font-semibold", statusConfig.color)}
                        >
                          <StatusIcon className="size-3 mr-1" />
                          {status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{declared.category}</p>
                    </div>

                    <div className="text-right">
                      {declared.assessedScore !== undefined ? (
                        <span className="text-[11px] font-bold text-emerald-300 border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-0.5 rounded-md inline-flex items-center gap-1">
                          <CheckCircle2 className="size-3 text-emerald-400" /> Assessed:{" "}
                          {declared.assessedScore}%
                        </span>
                      ) : (
                        <Link
                          to="/student/assessment"
                          className="text-xs font-semibold text-amber-300 border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 rounded-md hover:bg-amber-500/20 transition flex items-center gap-1"
                        >
                          <Sparkles className="size-3 text-amber-400" /> Take Assessment
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Stage 3 Multi-Attribute Metric Grid */}
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-2xl border border-white/10 bg-slate-900/80 p-3 text-xs">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500">
                        Self Declared
                      </p>
                      <p className="font-semibold text-white mt-0.5 capitalize truncate">
                        {declared.proficiency} ({declared.proficiencyLevel}%)
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500">
                        Assessed Level
                      </p>
                      <p className="font-semibold text-indigo-300 mt-0.5 capitalize truncate">
                        {declared.assessedLevel ?? "Pending"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500">Score</p>
                      <p className="font-semibold text-emerald-400 mt-0.5">
                        {declared.assessedScore !== undefined ? `${declared.assessedScore}%` : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500">Confidence</p>
                      <p className="font-semibold text-purple-300 mt-0.5 truncate">
                        {declared.assessedScore !== undefined
                          ? declared.evidence.length >= 2
                            ? "High"
                            : "Medium"
                          : "Low"}
                      </p>
                    </div>
                  </div>

                  {/* Proficiency Gauge */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                      <span>Proficiency Baseline</span>
                      <span className="font-semibold text-indigo-300">
                        {declared.assessedScore ?? declared.proficiencyLevel}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-pink-500"
                        style={{
                          width: `${declared.assessedScore ?? declared.proficiencyLevel}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Linked Evidence Section */}
                  <div className="mt-5 border-t border-white/10 pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Evidence Linked ({declared.evidence.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenEvidence(declared)}
                        className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
                      >
                        <Plus className="size-3" /> Add Evidence
                      </button>
                    </div>

                    {declared.evidence.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">
                        No project or certificate linked yet. Click "+ Add Evidence" to back up this
                        skill.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {declared.evidence.map((ev) => (
                          <div
                            key={ev.id}
                            className="flex items-start justify-between gap-2 rounded-xl border border-white/10 bg-slate-900/90 p-2.5 text-xs"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <FileCheck className="size-3.5 text-emerald-400 shrink-0" />
                                <span className="font-semibold text-white truncate">
                                  {ev.title}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="text-[9px] border-white/10 bg-slate-800 text-slate-400"
                                >
                                  {EVIDENCE_TYPE_LABELS[ev.type]?.label || ev.type}
                                </Badge>
                              </div>
                              {ev.description && (
                                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                  {ev.description}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {ev.url && (
                                <a
                                  href={ev.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1 text-indigo-400 hover:text-white"
                                  title="Open Link"
                                >
                                  <ExternalLink className="size-3" />
                                </a>
                              )}
                              <button
                                type="button"
                                onClick={() => removeSkillEvidence(declared.name, ev.id)}
                                className="p-1 text-slate-500 hover:text-rose-400"
                                title="Delete Evidence"
                              >
                                <X className="size-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Progression Sequence */}
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-emerald-400 font-semibold">Self-Declared ✓</span>
                    <span>→</span>
                    {declared.assessedScore !== undefined ? (
                      <span className="text-indigo-300 font-semibold">
                        Assessed ({declared.assessedLevel}) ✓
                      </span>
                    ) : (
                      <Link
                        to="/student/assessment"
                        className="text-amber-400 hover:underline font-semibold"
                      >
                        Take Test →
                      </Link>
                    )}
                    <span>→</span>
                    <span className="text-slate-500">Verified (Pending)</span>
                  </div>
                </div>

                {/* Bottom Controls */}
                <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Self-Rating:</span>
                    <select
                      value={declared.proficiency}
                      onChange={(e) =>
                        updateDeclaredSkill(declared.name, {
                          proficiency: e.target.value as SkillProficiency,
                        })
                      }
                      className="rounded-lg border border-white/10 bg-slate-900 px-2 py-1 text-xs text-white capitalize"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeDeclaredSkill(declared.name)}
                    className="text-xs text-slate-500 hover:text-rose-400 flex items-center gap-1"
                  >
                    <Trash2 className="size-3.5" /> Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Add Skills From Extensible Library */}
      <Dialog open={addSkillModalOpen} onOpenChange={setAddSkillModalOpen}>
        <DialogContent className="border-white/10 bg-[#0E1322]/95 text-white sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="size-5 text-indigo-400" />
              Declare Skills from Library
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Browse our catalog of hundreds of skills across programming, frontend, cloud, AI, and
              infrastructure.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Search + Category Filter */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
                <Input
                  value={librarySearchQuery}
                  onChange={(e) => setLibrarySearchQuery(e.target.value)}
                  placeholder="Search skill library (e.g. React, Docker, PyTorch, Go)..."
                  className="pl-8 text-xs h-9 border-white/10 bg-slate-900/80 text-white"
                />
              </div>

              <select
                value={libraryCategoryFilter}
                onChange={(e) => setLibraryCategoryFilter(e.target.value)}
                className="rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white"
              >
                <option value="All">All Categories</option>
                {SKILL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Default Proficiency for Added Skills */}
            <div className="flex items-center gap-2 text-xs border border-white/10 bg-slate-900/60 p-2.5 rounded-xl">
              <span className="text-slate-400 font-medium">Default Proficiency:</span>
              {(["beginner", "intermediate", "advanced"] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setModalProficiency(lvl)}
                  className={cn(
                    "px-2.5 py-0.5 rounded-lg font-semibold capitalize transition",
                    modalProficiency === lvl
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:text-white",
                  )}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Library Grid */}
            <div className="grid gap-2 sm:grid-cols-2 max-h-[300px] overflow-y-auto pr-1">
              {availableLibrarySkills.map((def) => {
                const isDeclared = declaredSkills.some((s) => s.name === def.name);
                return (
                  <div
                    key={def.id}
                    className={cn(
                      "p-3 rounded-xl border flex items-center justify-between text-xs transition",
                      isDeclared
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                        : "border-white/10 bg-slate-900/70 text-slate-300 hover:border-white/20",
                    )}
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-bold text-white truncate">{def.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{def.category}</p>
                    </div>

                    <Button
                      size="sm"
                      variant={isDeclared ? "outline" : "default"}
                      onClick={() => handleAddSkillFromLibrary(def)}
                      className={cn(
                        "h-7 text-xs px-2.5 shrink-0",
                        isDeclared
                          ? "border-emerald-500/40 text-emerald-300 bg-transparent"
                          : "bg-indigo-600 hover:bg-indigo-500 text-white",
                      )}
                    >
                      {isDeclared ? (
                        <>
                          <Check className="size-3 mr-1" /> Added
                        </>
                      ) : (
                        <>
                          <Plus className="size-3 mr-1" /> Add
                        </>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          <DialogFooter className="border-t border-white/10 pt-3">
            <Button
              size="sm"
              onClick={() => setAddSkillModalOpen(false)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              Done Adding
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Add Evidence */}
      <Dialog open={evidenceModalOpen} onOpenChange={setEvidenceModalOpen}>
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

            <div className="space-y-1.5 pt-1 border-t border-white/10">
              <Label className="text-xs font-semibold text-slate-300">
                Attach Document / Project Artifact (PDF, PNG, JPG — Max 10MB)
              </Label>
              <Input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const res = validateDocumentFile(file);
                  if (!res.valid) {
                    toast.error(res.error || "Invalid file");
                    e.target.value = "";
                    setUploadedEvidenceName(null);
                    setUploadedEvidenceSize(null);
                  } else {
                    setUploadedEvidenceName(res.fileName || file.name);
                    setUploadedEvidenceSize(res.fileSizeFormatted || formatBytes(file.size));
                    toast.success(`Attached ${res.fileName} (${res.fileSizeFormatted})`);
                  }
                }}
                className="border-white/10 bg-slate-900/80 text-white text-xs h-9 cursor-pointer"
              />
              {uploadedEvidenceName && (
                <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="size-3" /> Attached: {uploadedEvidenceName} ({uploadedEvidenceSize})
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="border-t border-white/10 pt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEvidenceModalOpen(false)}
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
