import { useState, useRef } from "react";
import {
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  Code2,
  Download,
  Edit2,
  ExternalLink,
  Eye,
  FileDown,
  FileText,
  Github,
  Globe,
  GraduationCap,
  Layers,
  Layout,
  Linkedin,
  Mail,
  MapPin,
  Maximize2,
  Minus,
  Phone,
  Plus,
  Printer,
  RotateCcw,
  Sparkles,
  Trash2,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WorkspaceHeader } from "@/components/skillbridge/student-ui";
import { useAppState } from "@/context/app-state";
import type {
  Achievement,
  Certification,
  Education,
  Project,
  Skill,
  StudentProfile,
  WorkExperience,
} from "@/types";

type ResumeTemplateId = "modern" | "professional" | "minimal";

export function StudentResumeBuilder() {
  const {
    profile,
    updateProfile,
    addProject,
    updateProject,
    deleteProject,
    addSkill,
    deleteSkill,
    addCertificate,
    deleteCertificate,
    addAchievement,
    deleteAchievement,
    addExperience,
    updateExperience,
    deleteExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    resumeTemplate,
    setResumeTemplate,
  } = useAppState();

  const printAreaRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Modals for adding items inline
  const [addProjOpen, setAddProjOpen] = useState(false);
  const [newProjTitle, setNewProjTitle] = useState("");
  const [newProjDesc, setNewProjDesc] = useState("");
  const [newProjTech, setNewProjTech] = useState("");
  const [newProjDur, setNewProjDur] = useState("");

  const [addExpOpen, setAddExpOpen] = useState(false);
  const [newExpRole, setNewExpRole] = useState("");
  const [newExpCompany, setNewExpCompany] = useState("");
  const [newExpDuration, setNewExpDuration] = useState("");
  const [newExpDesc, setNewExpDesc] = useState("");

  const [addEduOpen, setAddEduOpen] = useState(false);
  const [newEduInst, setNewEduInst] = useState("");
  const [newEduDegree, setNewEduDegree] = useState("");
  const [newEduField, setNewEduField] = useState("");
  const [newEduYear, setNewEduYear] = useState("");
  const [newEduGrade, setNewEduGrade] = useState("");

  const [newSkillName, setNewSkillName] = useState("");

  const handlePrintPdf = () => {
    toast.info("Opening system print dialog. Choose 'Save as PDF' to download.", {
      duration: 4000,
    });
    window.print();
  };

  const handleCreateProject = () => {
    if (!newProjTitle.trim()) {
      toast.error("Project title is required");
      return;
    }
    const techArr = newProjTech
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    addProject({
      title: newProjTitle.trim(),
      description: newProjDesc.trim(),
      tech: techArr.length > 0 ? techArr : ["React", "TypeScript"],
      duration: newProjDur.trim() || "2025",
    });
    setNewProjTitle("");
    setNewProjDesc("");
    setNewProjTech("");
    setNewProjDur("");
    setAddProjOpen(false);
    toast.success("Project added to Resume and Portfolio");
  };

  const handleCreateExp = () => {
    if (!newExpRole.trim() || !newExpCompany.trim()) {
      toast.error("Role and Company are required");
      return;
    }
    addExperience({
      role: newExpRole.trim(),
      company: newExpCompany.trim(),
      duration: newExpDuration.trim() || "2025",
      description: newExpDesc.trim() || undefined,
      type: "Internship",
    });
    setNewExpRole("");
    setNewExpCompany("");
    setNewExpDuration("");
    setNewExpDesc("");
    setAddExpOpen(false);
    toast.success("Experience added to Resume and Portfolio");
  };

  const handleCreateEdu = () => {
    if (!newEduInst.trim() || !newEduDegree.trim()) {
      toast.error("Institution and Degree are required");
      return;
    }
    addEducation({
      institution: newEduInst.trim(),
      degree: newEduDegree.trim(),
      fieldOfStudy: newEduField.trim(),
      endYear: newEduYear.trim() || "2026",
      grade: newEduGrade.trim() || undefined,
    });
    setNewEduInst("");
    setNewEduDegree("");
    setNewEduField("");
    setNewEduYear("");
    setNewEduGrade("");
    setAddEduOpen(false);
    toast.success("Education record added");
  };

  const handleAddInlineSkill = () => {
    if (!newSkillName.trim()) return;
    addSkill({ name: newSkillName.trim(), score: 80 });
    setNewSkillName("");
    toast.success("Skill added across profile");
  };

  return (
    <div className="space-y-6">
      {/* Non-printable Screen Header & Controls */}
      <div className="no-print space-y-6">
        <WorkspaceHeader
          eyebrow="AI Resume Studio"
          title="Interactive Resume Builder"
          description="Live-edit your ATS-optimized resume, select curated templates, and export high-fidelity client-side PDF."
          action={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="gap-2 bg-card"
                onClick={() => {
                  toast.success("Profile data synchronized with resume");
                }}
              >
                <RotateCcw className="size-4" /> Auto-Sync
              </Button>
              <Button onClick={handlePrintPdf} className="gap-2 shadow-sm">
                <Printer className="size-4" /> Export PDF
              </Button>
            </div>
          }
        />

        {/* Template Selector Bar */}
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <Layout className="size-5 text-primary" />
            <div>
              <p className="font-semibold text-sm text-foreground">Selected Layout Template</p>
              <p className="text-xs text-muted-foreground">
                All templates preserve live content while adapting structural ATS typography.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-border bg-muted/40 p-1">
            {[
              { id: "modern", label: "Modern", desc: "Dual accent column" },
              { id: "professional", label: "Professional", desc: "Classic ATS serif" },
              { id: "minimal", label: "Minimal", desc: "Clean monochrome" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setResumeTemplate(t.id as ResumeTemplateId)}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                  resumeTemplate === t.id
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Dual-Pane Workspace */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Pane: Interactive Editor Forms (Hidden in print) */}
        <div className="no-print lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
              <h2 className="font-display text-base font-semibold text-foreground flex items-center gap-2">
                <Edit2 className="size-4 text-primary" /> Content Sections
              </h2>
              <span className="text-xs text-muted-foreground">Auto-saved to Profile</span>
            </div>

            <Accordion
              type="multiple"
              defaultValue={["personal", "summary", "experience", "projects"]}
              className="w-full"
            >
              {/* Personal Information */}
              <AccordionItem value="personal">
                <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                  <span className="flex items-center gap-2">
                    <User className="size-4 text-primary" /> Personal Information
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-2">
                  <div className="grid gap-2">
                    <Label htmlFor="res-name" className="text-xs">
                      Full Name
                    </Label>
                    <Input
                      id="res-name"
                      value={profile.name}
                      onChange={(e) => updateProfile({ name: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="res-head" className="text-xs">
                      Professional Title
                    </Label>
                    <Input
                      id="res-head"
                      value={profile.headline ?? ""}
                      onChange={(e) => updateProfile({ headline: e.target.value })}
                      placeholder="e.g. Full-Stack Software Engineer"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="grid gap-1.5">
                      <Label htmlFor="res-email" className="text-xs">
                        Email
                      </Label>
                      <Input
                        id="res-email"
                        value={profile.email}
                        onChange={(e) => updateProfile({ email: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="res-phone" className="text-xs">
                        Phone
                      </Label>
                      <Input
                        id="res-phone"
                        value={profile.phone ?? ""}
                        onChange={(e) => updateProfile({ phone: e.target.value })}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="res-loc" className="text-xs">
                      Location
                    </Label>
                    <Input
                      id="res-loc"
                      value={profile.location ?? ""}
                      onChange={(e) => updateProfile({ location: e.target.value })}
                      placeholder="City, Country"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="grid gap-1.5">
                      <Label htmlFor="res-gh" className="text-xs">
                        GitHub
                      </Label>
                      <Input
                        id="res-gh"
                        value={profile.socialLinks?.github ?? ""}
                        onChange={(e) =>
                          updateProfile({
                            socialLinks: { ...profile.socialLinks, github: e.target.value },
                          })
                        }
                        placeholder="https://github.com/..."
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="res-li" className="text-xs">
                        LinkedIn
                      </Label>
                      <Input
                        id="res-li"
                        value={profile.socialLinks?.linkedin ?? ""}
                        onChange={(e) =>
                          updateProfile({
                            socialLinks: { ...profile.socialLinks, linkedin: e.target.value },
                          })
                        }
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Professional Summary */}
              <AccordionItem value="summary">
                <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                  <span className="flex items-center gap-2">
                    <FileText className="size-4 text-primary" /> Professional Summary
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-2 pt-2">
                  <Label htmlFor="res-about" className="text-xs">
                    Summary / Objective
                  </Label>
                  <Textarea
                    id="res-about"
                    rows={4}
                    value={profile.about}
                    onChange={(e) => updateProfile({ about: e.target.value })}
                    placeholder="Concise 3-4 sentence overview of your technical background..."
                  />
                </AccordionContent>
              </AccordionItem>

              {/* Work Experience */}
              <AccordionItem value="experience">
                <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                  <span className="flex items-center gap-2">
                    <Briefcase className="size-4 text-primary" /> Work Experience (
                    {profile.experience?.length || 0})
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-2">
                  {profile.experience?.map((exp) => (
                    <div
                      key={exp.id}
                      className="rounded-xl border border-border p-3 space-y-2 bg-muted/20"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-foreground truncate">
                          {exp.role}
                        </span>
                        <button
                          type="button"
                          onClick={() => deleteExperience(exp.id)}
                          className="text-muted-foreground hover:text-destructive p-1 rounded"
                          aria-label="Delete experience"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        {exp.company} · {exp.duration}
                      </p>
                      <Textarea
                        rows={2}
                        value={exp.description ?? ""}
                        onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                        className="text-xs"
                        placeholder="Key impact bullets..."
                      />
                    </div>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs gap-1.5"
                    onClick={() => setAddExpOpen(true)}
                  >
                    <Plus className="size-3.5" /> Add Experience Entry
                  </Button>
                </AccordionContent>
              </AccordionItem>

              {/* Projects */}
              <AccordionItem value="projects">
                <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                  <span className="flex items-center gap-2">
                    <Code2 className="size-4 text-primary" /> Projects ({profile.projects.length})
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-2">
                  {profile.projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="rounded-xl border border-border p-3 space-y-2 bg-muted/20"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-foreground truncate">
                          {proj.title}
                        </span>
                        <button
                          type="button"
                          onClick={() => deleteProject(proj.id)}
                          className="text-muted-foreground hover:text-destructive p-1 rounded"
                          aria-label="Delete project"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                      <Textarea
                        rows={2}
                        value={proj.description}
                        onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                        className="text-xs"
                        placeholder="Project description..."
                      />
                      <Input
                        value={proj.tech.join(", ")}
                        onChange={(e) =>
                          updateProject(proj.id, {
                            tech: e.target.value
                              .split(",")
                              .map((t) => t.trim())
                              .filter(Boolean),
                          })
                        }
                        className="text-xs"
                        placeholder="Tech stack (comma-separated)"
                      />
                    </div>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs gap-1.5"
                    onClick={() => setAddProjOpen(true)}
                  >
                    <Plus className="size-3.5" /> Add Project Entry
                  </Button>
                </AccordionContent>
              </AccordionItem>

              {/* Education */}
              <AccordionItem value="education">
                <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                  <span className="flex items-center gap-2">
                    <GraduationCap className="size-4 text-primary" /> Education
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-2">
                  {profile.education && profile.education.length > 0 ? (
                    profile.education.map((edu) => (
                      <div
                        key={edu.id}
                        className="rounded-xl border border-border p-3 space-y-1.5 bg-muted/20"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs text-foreground truncate">
                            {edu.degree}
                          </span>
                          <button
                            type="button"
                            onClick={() => deleteEducation(edu.id)}
                            className="text-muted-foreground hover:text-destructive p-1 rounded"
                            aria-label="Delete education"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          {edu.institution} ({edu.startYear || ""}-{edu.endYear || ""})
                        </p>
                        {edu.grade && (
                          <p className="text-[11px] font-medium text-primary">Score: {edu.grade}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-border p-3 space-y-2 bg-muted/20">
                      <p className="text-xs font-semibold">
                        {profile.degree} - {profile.branch}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {profile.college} ({profile.year})
                      </p>
                    </div>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs gap-1.5"
                    onClick={() => setAddEduOpen(true)}
                  >
                    <Plus className="size-3.5" /> Add Education
                  </Button>
                </AccordionContent>
              </AccordionItem>

              {/* Skills */}
              <AccordionItem value="skills">
                <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                  <span className="flex items-center gap-2">
                    <Sparkles className="size-4 text-primary" /> Skills ({profile.skills.length})
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {profile.skills.map((skill) => (
                      <Badge key={skill.name} variant="secondary" className="gap-1 pr-1 text-xs">
                        {skill.name}
                        <button
                          type="button"
                          onClick={() => deleteSkill(skill.name)}
                          className="hover:text-destructive"
                          aria-label={`Remove ${skill.name}`}
                        >
                          <Trash2 className="size-2.5" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      placeholder="Add skill tag..."
                      className="text-xs h-8"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddInlineSkill();
                        }
                      }}
                    />
                    <Button size="sm" className="h-8 text-xs" onClick={handleAddInlineSkill}>
                      Add
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Certifications */}
              <AccordionItem value="certifications">
                <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                  <span className="flex items-center gap-2">
                    <Award className="size-4 text-primary" /> Certifications (
                    {profile.certifications.length})
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-2 pt-2">
                  {profile.certifications.map((cert) => (
                    <div
                      key={cert.id}
                      className="flex items-center justify-between rounded-lg border border-border p-2 text-xs bg-muted/20"
                    >
                      <div>
                        <p className="font-semibold text-foreground">{cert.name || cert.title}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {cert.issuer} · {cert.issueDate || cert.year}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteCertificate(cert.id)}
                        className="text-muted-foreground hover:text-destructive p-1 rounded"
                        aria-label="Remove certificate"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  ))}
                  <p className="text-[11px] text-muted-foreground italic pt-1">
                    Manage full credentials in the Certificates tab.
                  </p>
                </AccordionContent>
              </AccordionItem>

              {/* Achievements */}
              <AccordionItem value="achievements">
                <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                  <span className="flex items-center gap-2">
                    <Award className="size-4 text-primary" /> Achievements (
                    {profile.achievements?.length || 0})
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-2 pt-2">
                  {profile.achievements?.map((ach) => (
                    <div
                      key={ach.id}
                      className="flex items-center justify-between rounded-lg border border-border p-2 text-xs bg-muted/20"
                    >
                      <div>
                        <p className="font-semibold text-foreground">{ach.title}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {ach.issuer} · {ach.date}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteAchievement(ach.id)}
                        className="text-muted-foreground hover:text-destructive p-1 rounded"
                        aria-label="Remove achievement"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Right Pane: Live Rendered Paper Preview (Zoomable + Responsive) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          {/* Zoom & Screen Controls */}
          <div className="no-print w-full flex items-center justify-between mb-3 px-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs font-medium uppercase tracking-wider">
                Live {resumeTemplate.toUpperCase()} Preview
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
              >
                <Minus className="size-3 mr-1" /> Zoom
              </Button>
              <span className="text-xs font-mono text-muted-foreground">{zoomLevel}%</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
              >
                <Plus className="size-3 mr-1" /> Zoom
              </Button>
              <Button size="sm" className="h-7 text-xs gap-1 ml-2" onClick={handlePrintPdf}>
                <Download className="size-3" /> Save PDF
              </Button>
            </div>
          </div>

          {/* Paper Container - styled for A4 screen simulation & print target */}
          <div className="w-full overflow-x-auto pb-8 flex justify-center">
            <div
              ref={printAreaRef}
              id="resume-print-root"
              className="resume-paper bg-white text-neutral-900 shadow-2xl transition-transform origin-top border border-neutral-200"
              style={{
                width: "210mm",
                minHeight: "297mm",
                transform: `scale(${zoomLevel / 100})`,
                boxSizing: "border-box",
              }}
            >
              {resumeTemplate === "modern" && <ModernTemplate profile={profile} />}
              {resumeTemplate === "professional" && <ProfessionalTemplate profile={profile} />}
              {resumeTemplate === "minimal" && <MinimalTemplate profile={profile} />}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          INLINE ADD MODALS
         ======================================================== */}
      {/* Project Modal */}
      <Dialog open={addProjOpen} onOpenChange={setAddProjOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Project to Resume</DialogTitle>
            <DialogDescription>
              Synchronizes directly with your portfolio and profile.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid gap-2">
              <Label>Project Title *</Label>
              <Input
                value={newProjTitle}
                onChange={(e) => setNewProjTitle(e.target.value)}
                placeholder="e.g. AI Career Matcher"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Duration</Label>
                <Input
                  value={newProjDur}
                  onChange={(e) => setNewProjDur(e.target.value)}
                  placeholder="e.g. 2 months · 2025"
                />
              </div>
              <div className="grid gap-2">
                <Label>Tech Stack</Label>
                <Input
                  value={newProjTech}
                  onChange={(e) => setNewProjTech(e.target.value)}
                  placeholder="React, Python, FastAPI"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea
                rows={3}
                value={newProjDesc}
                onChange={(e) => setNewProjDesc(e.target.value)}
                placeholder="Key features and outcomes..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddProjOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject}>Add Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Experience Modal */}
      <Dialog open={addExpOpen} onOpenChange={setAddExpOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Work Experience</DialogTitle>
            <DialogDescription>Internship or professional work history entry.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Role Title *</Label>
                <Input
                  value={newExpRole}
                  onChange={(e) => setNewExpRole(e.target.value)}
                  placeholder="e.g. Software Intern"
                />
              </div>
              <div className="grid gap-2">
                <Label>Company *</Label>
                <Input
                  value={newExpCompany}
                  onChange={(e) => setNewExpCompany(e.target.value)}
                  placeholder="e.g. Nexora Labs"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Duration</Label>
              <Input
                value={newExpDuration}
                onChange={(e) => setNewExpDuration(e.target.value)}
                placeholder="May 2025 - Jul 2025"
              />
            </div>
            <div className="grid gap-2">
              <Label>Responsibilities</Label>
              <Textarea
                rows={3}
                value={newExpDesc}
                onChange={(e) => setNewExpDesc(e.target.value)}
                placeholder="Brief bullet points..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddExpOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateExp}>Add Experience</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Education Modal */}
      <Dialog open={addEduOpen} onOpenChange={setAddEduOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Education Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid gap-2">
              <Label>Institution *</Label>
              <Input
                value={newEduInst}
                onChange={(e) => setNewEduInst(e.target.value)}
                placeholder="e.g. NIT Raipur"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Degree *</Label>
                <Input
                  value={newEduDegree}
                  onChange={(e) => setNewEduDegree(e.target.value)}
                  placeholder="e.g. B.Tech"
                />
              </div>
              <div className="grid gap-2">
                <Label>Field of Study</Label>
                <Input
                  value={newEduField}
                  onChange={(e) => setNewEduField(e.target.value)}
                  placeholder="Computer Science"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Graduation Year</Label>
                <Input
                  value={newEduYear}
                  onChange={(e) => setNewEduYear(e.target.value)}
                  placeholder="2026"
                />
              </div>
              <div className="grid gap-2">
                <Label>CGPA / Grade</Label>
                <Input
                  value={newEduGrade}
                  onChange={(e) => setNewEduGrade(e.target.value)}
                  placeholder="8.72 CGPA"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddEduOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateEdu}>Add Education</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* =======================================================================
   RESUME TEMPLATE 1: MODERN (Two-column layout, primary header banner, tech badges)
   ======================================================================= */
function ModernTemplate({ profile }: { profile: StudentProfile }) {
  return (
    <div className="p-8 font-sans text-neutral-900 leading-normal text-xs">
      {/* Header */}
      <div className="border-b-2 border-primary/80 pb-5 mb-5 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{profile.name}</h1>
          <p className="text-sm font-semibold text-primary mt-0.5">
            {profile.headline || `${profile.degree} in ${profile.branch}`}
          </p>
        </div>
        <div className="text-right text-[11px] space-y-0.5 text-neutral-600">
          <p className="flex items-center justify-end gap-1 font-medium">
            <Mail className="size-3 text-primary" /> {profile.email}
          </p>
          {profile.phone && (
            <p className="flex items-center justify-end gap-1">
              <Phone className="size-3 text-primary" /> {profile.phone}
            </p>
          )}
          {profile.location && (
            <p className="flex items-center justify-end gap-1">
              <MapPin className="size-3 text-primary" /> {profile.location}
            </p>
          )}
          {profile.socialLinks?.github && (
            <p className="flex items-center justify-end gap-1">
              <Github className="size-3 text-neutral-700" />{" "}
              {profile.socialLinks.github.replace("https://", "")}
            </p>
          )}
          {profile.socialLinks?.linkedin && (
            <p className="flex items-center justify-end gap-1">
              <Linkedin className="size-3 text-[#0077b5]" />{" "}
              {profile.socialLinks.linkedin.replace("https://", "")}
            </p>
          )}
        </div>
      </div>

      {/* Summary */}
      {profile.about && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-neutral-200 pb-1 mb-2">
            Professional Summary
          </h2>
          <p className="text-neutral-700 leading-relaxed">{profile.about}</p>
        </div>
      )}

      {/* Two Column Grid: Main (Left 65%) vs Sidebar (Right 35%) */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Experience & Projects */}
        <div className="col-span-8 space-y-5">
          {/* Work Experience */}
          {profile.experience && profile.experience.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-neutral-200 pb-1 mb-3">
                Experience & Internships
              </h2>
              <div className="space-y-3">
                {profile.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-bold text-neutral-900 text-xs">{exp.role}</h3>
                      <span className="text-[10px] text-neutral-500 font-medium">
                        {exp.duration}
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-primary">
                      {exp.company}
                      {exp.location ? ` · ${exp.location}` : ""}
                    </p>
                    {exp.description && (
                      <p className="mt-1 text-[11px] text-neutral-700 leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Featured Projects */}
          {profile.projects.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-neutral-200 pb-1 mb-3">
                Projects
              </h2>
              <div className="space-y-3">
                {profile.projects.map((proj) => (
                  <div key={proj.id || proj.title}>
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-bold text-neutral-900 text-xs">{proj.title}</h3>
                      {proj.duration && (
                        <span className="text-[10px] text-neutral-500">{proj.duration}</span>
                      )}
                    </div>
                    <p className="text-[10px] font-medium text-neutral-600 mt-0.5">
                      Tech: {proj.tech.join(" · ")}
                    </p>
                    <p className="mt-1 text-[11px] text-neutral-700 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Skills, Education, Certifications, Achievements */}
        <div className="col-span-4 space-y-5 border-l border-neutral-200 pl-5">
          {/* Skills */}
          {profile.skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-neutral-200 pb-1 mb-2">
                Technical Skills
              </h2>
              <div className="flex flex-wrap gap-1">
                {profile.skills.map((s) => (
                  <span
                    key={s.name}
                    className="inline-block bg-neutral-100 border border-neutral-200 rounded px-1.5 py-0.5 text-[10px] font-medium text-neutral-800"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-neutral-200 pb-1 mb-2">
              Education
            </h2>
            {profile.education && profile.education.length > 0 ? (
              profile.education.map((edu) => (
                <div key={edu.id} className="mb-2">
                  <p className="font-bold text-neutral-900 text-xs">{edu.degree}</p>
                  <p className="text-[11px] text-neutral-700">{edu.institution}</p>
                  <p className="text-[10px] text-neutral-500">
                    {edu.startYear ? `${edu.startYear} - ` : ""}
                    {edu.endYear} {edu.grade ? `· ${edu.grade}` : ""}
                  </p>
                </div>
              ))
            ) : (
              <div>
                <p className="font-bold text-neutral-900 text-xs">{profile.degree}</p>
                <p className="text-[11px] text-neutral-700">{profile.branch}</p>
                <p className="text-[10px] text-neutral-500">
                  {profile.college} ({profile.year})
                </p>
              </div>
            )}
          </div>

          {/* Certifications */}
          {profile.certifications.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-neutral-200 pb-1 mb-2">
                Certifications
              </h2>
              <div className="space-y-2">
                {profile.certifications.map((c) => (
                  <div key={c.id || c.title}>
                    <p className="font-semibold text-neutral-900 text-[11px]">
                      {c.name || c.title}
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      {c.issuer} ({c.issueDate || c.year})
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {profile.achievements && profile.achievements.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-neutral-200 pb-1 mb-2">
                Achievements
              </h2>
              <div className="space-y-1.5">
                {profile.achievements.map((a) => (
                  <div key={a.id}>
                    <p className="font-medium text-neutral-900 text-[10px] leading-tight">
                      • {a.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =======================================================================
   RESUME TEMPLATE 2: PROFESSIONAL (Classic ATS single-column layout, horizontal dividers)
   ======================================================================= */
function ProfessionalTemplate({ profile }: { profile: StudentProfile }) {
  return (
    <div className="p-9 font-serif text-neutral-900 leading-normal text-xs">
      {/* Header Center Aligned */}
      <div className="text-center border-b border-neutral-800 pb-4 mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-950 font-serif">
          {profile.name.toUpperCase()}
        </h1>
        {profile.headline && (
          <p className="text-xs font-medium text-neutral-700 italic mt-0.5">{profile.headline}</p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-neutral-700 font-sans mt-2">
          <span>{profile.email}</span>
          {profile.phone && <span>• {profile.phone}</span>}
          {profile.location && <span>• {profile.location}</span>}
          {profile.socialLinks?.github && (
            <span>• {profile.socialLinks.github.replace("https://", "")}</span>
          )}
          {profile.socialLinks?.linkedin && (
            <span>• {profile.socialLinks.linkedin.replace("https://", "")}</span>
          )}
        </div>
      </div>

      {/* Summary */}
      {profile.about && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-400 pb-0.5 mb-1.5 font-sans">
            Executive Summary
          </h2>
          <p className="text-neutral-800 leading-relaxed font-sans text-[11px]">{profile.about}</p>
        </div>
      )}

      {/* Education */}
      <div className="mb-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-400 pb-0.5 mb-2 font-sans">
          Education
        </h2>
        {profile.education && profile.education.length > 0 ? (
          profile.education.map((edu) => (
            <div key={edu.id} className="mb-2 font-sans">
              <div className="flex justify-between font-bold text-xs text-neutral-950">
                <span>{edu.institution}</span>
                <span className="font-normal text-neutral-600 text-[11px]">
                  {edu.startYear ? `${edu.startYear} - ` : ""}
                  {edu.endYear}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-neutral-800 italic">
                <span>
                  {edu.degree} in {edu.fieldOfStudy}
                </span>
                {edu.grade && <span className="not-italic font-medium">{edu.grade}</span>}
              </div>
            </div>
          ))
        ) : (
          <div className="font-sans">
            <div className="flex justify-between font-bold text-xs text-neutral-950">
              <span>{profile.college}</span>
              <span className="font-normal text-neutral-600 text-[11px]">{profile.year}</span>
            </div>
            <p className="text-[11px] text-neutral-800 italic">
              {profile.degree} in {profile.branch}
            </p>
          </div>
        )}
      </div>

      {/* Skills */}
      {profile.skills.length > 0 && (
        <div className="mb-4 font-sans">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-400 pb-0.5 mb-1.5 font-sans">
            Core Competencies & Technical Skills
          </h2>
          <p className="text-[11px] text-neutral-800 leading-relaxed">
            <span className="font-semibold">Technologies: </span>
            {profile.skills.map((s) => s.name).join(" • ")}
          </p>
        </div>
      )}

      {/* Experience */}
      {profile.experience && profile.experience.length > 0 && (
        <div className="mb-4 font-sans">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-400 pb-0.5 mb-2 font-sans">
            Professional Experience
          </h2>
          <div className="space-y-3">
            {profile.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between font-bold text-xs text-neutral-950">
                  <span>
                    {exp.role} — <span className="font-normal">{exp.company}</span>
                  </span>
                  <span className="font-normal text-neutral-600 text-[11px]">{exp.duration}</span>
                </div>
                {exp.description && (
                  <p className="mt-1 text-[11px] text-neutral-800 leading-relaxed">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {profile.projects.length > 0 && (
        <div className="mb-4 font-sans">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-400 pb-0.5 mb-2 font-sans">
            Key Engineering Projects
          </h2>
          <div className="space-y-3">
            {profile.projects.map((proj) => (
              <div key={proj.id || proj.title}>
                <div className="flex justify-between font-bold text-xs text-neutral-950">
                  <span>{proj.title}</span>
                  {proj.duration && (
                    <span className="font-normal text-neutral-600 text-[11px]">
                      {proj.duration}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-neutral-600 italic">
                  Built with: {proj.tech.join(", ")}
                </p>
                <p className="mt-1 text-[11px] text-neutral-800 leading-relaxed">
                  {proj.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications & Honors */}
      {(profile.certifications.length > 0 ||
        (profile.achievements && profile.achievements.length > 0)) && (
        <div className="font-sans">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-400 pb-0.5 mb-2 font-sans">
            Certifications & Honors
          </h2>
          <div className="space-y-1 text-[11px] text-neutral-800">
            {profile.certifications.map((c) => (
              <p key={c.id || c.title}>
                • <span className="font-semibold">{c.name || c.title}</span> — {c.issuer} (
                {c.issueDate || c.year})
              </p>
            ))}
            {profile.achievements?.map((a) => (
              <p key={a.id}>
                • <span className="font-semibold">{a.title}</span> {a.issuer ? `(${a.issuer})` : ""}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* =======================================================================
   RESUME TEMPLATE 3: MINIMAL (Ultra clean monochrome typography, generous whitespace)
   ======================================================================= */
function MinimalTemplate({ profile }: { profile: StudentProfile }) {
  return (
    <div className="p-10 font-mono text-neutral-950 leading-relaxed text-[11px]">
      {/* Top Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight uppercase text-black">{profile.name}</h1>
        <p className="text-neutral-600 font-sans text-xs mt-0.5">
          {profile.headline || `${profile.degree} // ${profile.branch}`}
        </p>
        <div className="mt-2 text-[10px] text-neutral-500 space-x-2">
          <span>{profile.email}</span>
          {profile.phone && <span>| {profile.phone}</span>}
          {profile.location && <span>| {profile.location}</span>}
          {profile.socialLinks?.github && (
            <span>| {profile.socialLinks.github.replace("https://", "")}</span>
          )}
        </div>
      </div>

      {/* Summary */}
      {profile.about && (
        <div className="mb-6">
          <p className="text-neutral-800 font-sans text-xs leading-relaxed">{profile.about}</p>
        </div>
      )}

      {/* Skills */}
      {profile.skills.length > 0 && (
        <div className="mb-6">
          <p className="text-[10px] uppercase font-bold text-neutral-400 mb-1 tracking-widest">
            // SKILLS
          </p>
          <p className="font-sans text-xs text-neutral-900">
            {profile.skills.map((s) => s.name).join(" / ")}
          </p>
        </div>
      )}

      {/* Experience */}
      {profile.experience && profile.experience.length > 0 && (
        <div className="mb-6">
          <p className="text-[10px] uppercase font-bold text-neutral-400 mb-2 tracking-widest">
            // EXPERIENCE
          </p>
          <div className="space-y-3 font-sans">
            {profile.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between font-bold text-xs">
                  <span>
                    {exp.role} @ {exp.company}
                  </span>
                  <span className="font-normal font-mono text-[10px] text-neutral-500">
                    {exp.duration}
                  </span>
                </div>
                {exp.description && (
                  <p className="mt-1 text-xs text-neutral-700">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {profile.projects.length > 0 && (
        <div className="mb-6">
          <p className="text-[10px] uppercase font-bold text-neutral-400 mb-2 tracking-widest">
            // PROJECTS
          </p>
          <div className="space-y-3 font-sans">
            {profile.projects.map((proj) => (
              <div key={proj.id || proj.title}>
                <div className="flex justify-between font-bold text-xs">
                  <span>{proj.title}</span>
                  {proj.duration && (
                    <span className="font-normal font-mono text-[10px] text-neutral-500">
                      {proj.duration}
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-mono text-neutral-500 mt-0.5">
                  [{proj.tech.join(", ")}]
                </p>
                <p className="mt-1 text-xs text-neutral-700">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      <div className="mb-6">
        <p className="text-[10px] uppercase font-bold text-neutral-400 mb-2 tracking-widest">
          // EDUCATION
        </p>
        {profile.education && profile.education.length > 0 ? (
          profile.education.map((edu) => (
            <div key={edu.id} className="font-sans mb-1 text-xs">
              <span className="font-bold">{edu.degree}</span> · {edu.institution} ({edu.endYear}){" "}
              {edu.grade ? `[${edu.grade}]` : ""}
            </div>
          ))
        ) : (
          <div className="font-sans text-xs">
            <span className="font-bold">
              {profile.degree} in {profile.branch}
            </span>{" "}
            · {profile.college} ({profile.year})
          </div>
        )}
      </div>

      {/* Certifications */}
      {profile.certifications.length > 0 && (
        <div>
          <p className="text-[10px] uppercase font-bold text-neutral-400 mb-2 tracking-widest">
            // CERTIFICATIONS
          </p>
          <div className="space-y-1 font-sans text-xs text-neutral-800">
            {profile.certifications.map((c) => (
              <p key={c.id || c.title}>
                + <span className="font-semibold">{c.name || c.title}</span> — {c.issuer} (
                {c.issueDate || c.year})
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
