import { useState } from "react";
import {
  Award,
  Briefcase,
  Building2,
  Calendar,
  Check,
  Code2,
  Edit2,
  ExternalLink,
  Github,
  Globe,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Sparkles,
  Trash2,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { CompanyMark, SkillTag, StatusBadge } from "@/components/skillbridge/primitives";
import { SectionCard, WorkspaceHeader } from "@/components/skillbridge/student-ui";
import { useAppState } from "@/context/app-state";
import type { Achievement, Project, Skill, WorkExperience } from "@/types";

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
];

export function StudentPortfolio() {
  const {
    profile,
    updateProfile,
    addProject,
    updateProject,
    deleteProject,
    addSkill,
    updateSkill,
    deleteSkill,
    addAchievement,
    updateAchievement,
    deleteAchievement,
    addExperience,
    updateExperience,
    deleteExperience,
  } = useAppState();

  // Dialog states
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);

  // Profile Form State
  const [nameInput, setNameInput] = useState(profile.name);
  const [headlineInput, setHeadlineInput] = useState(profile.headline ?? "");
  const [aboutInput, setAboutInput] = useState(profile.about);
  const [phoneInput, setPhoneInput] = useState(profile.phone ?? "");
  const [locationInput, setLocationInput] = useState(profile.location ?? "");
  const [githubInput, setGithubInput] = useState(profile.socialLinks?.github ?? "");
  const [linkedinInput, setLinkedinInput] = useState(profile.socialLinks?.linkedin ?? "");
  const [websiteInput, setWebsiteInput] = useState(profile.socialLinks?.website ?? "");
  const [avatarInput, setAvatarInput] = useState(profile.avatar ?? AVATAR_PRESETS[0]!);

  // Project Dialog State
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectTech, setProjectTech] = useState("");
  const [projectDuration, setProjectDuration] = useState("");
  const [projectGithub, setProjectGithub] = useState("");
  const [projectLive, setProjectLive] = useState("");

  // Skill Dialog State
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillName, setSkillName] = useState("");
  const [skillScore, setSkillScore] = useState(75);

  // Experience Dialog State
  const [expDialogOpen, setExpDialogOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<WorkExperience | null>(null);
  const [expRole, setExpRole] = useState("");
  const [expCompany, setExpCompany] = useState("");
  const [expDuration, setExpDuration] = useState("");
  const [expLocation, setExpLocation] = useState("");
  const [expDesc, setExpDesc] = useState("");
  const [expType, setExpType] = useState<WorkExperience["type"]>("Internship");

  // Achievement Dialog State
  const [achDialogOpen, setAchDialogOpen] = useState(false);
  const [editingAch, setEditingAch] = useState<Achievement | null>(null);
  const [achTitle, setAchTitle] = useState("");
  const [achIssuer, setAchIssuer] = useState("");
  const [achDate, setAchDate] = useState("");
  const [achDesc, setAchDesc] = useState("");

  // Delete confirmation alert state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({ open: false, title: "", description: "", onConfirm: () => {} });

  const handleOpenProfileModal = () => {
    setNameInput(profile.name);
    setHeadlineInput(profile.headline ?? "");
    setAboutInput(profile.about);
    setPhoneInput(profile.phone ?? "");
    setLocationInput(profile.location ?? "");
    setGithubInput(profile.socialLinks?.github ?? "");
    setLinkedinInput(profile.socialLinks?.linkedin ?? "");
    setWebsiteInput(profile.socialLinks?.website ?? "");
    setProfileDialogOpen(true);
  };

  const handleSaveProfile = () => {
    if (!nameInput.trim()) {
      toast.error("Please provide your name");
      return;
    }
    updateProfile({
      name: nameInput.trim(),
      headline: headlineInput.trim(),
      about: aboutInput.trim(),
      phone: phoneInput.trim(),
      location: locationInput.trim(),
      socialLinks: {
        github: githubInput.trim(),
        linkedin: linkedinInput.trim(),
        website: websiteInput.trim(),
      },
    });
    toast.success("Profile updated successfully");
    setProfileDialogOpen(false);
  };

  const handleSaveAvatar = (url: string) => {
    updateProfile({ avatar: url });
    setAvatarDialogOpen(false);
    toast.success("Profile photo updated");
  };

  // Projects
  const handleOpenProjectModal = (p?: Project) => {
    if (p) {
      setEditingProject(p);
      setProjectTitle(p.title);
      setProjectDesc(p.description);
      setProjectTech(p.tech.join(", "));
      setProjectDuration(p.duration ?? "");
      setProjectGithub(p.githubUrl ?? "");
      setProjectLive(p.liveUrl ?? "");
    } else {
      setEditingProject(null);
      setProjectTitle("");
      setProjectDesc("");
      setProjectTech("");
      setProjectDuration("");
      setProjectGithub("");
      setProjectLive("");
    }
    setProjectDialogOpen(true);
  };

  const handleSaveProject = () => {
    if (!projectTitle.trim()) {
      toast.error("Please enter a project title");
      return;
    }
    const techArray = projectTech
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingProject) {
      updateProject(editingProject.id, {
        title: projectTitle.trim(),
        description: projectDesc.trim(),
        tech: techArray,
        duration: projectDuration.trim(),
        githubUrl: projectGithub.trim() || undefined,
        liveUrl: projectLive.trim() || undefined,
      });
      toast.success("Project updated");
    } else {
      addProject({
        title: projectTitle.trim(),
        description: projectDesc.trim(),
        tech: techArray.length > 0 ? techArray : ["React", "TypeScript"],
        duration: projectDuration.trim() || "Recent",
        githubUrl: projectGithub.trim() || undefined,
        liveUrl: projectLive.trim() || undefined,
      });
      toast.success("Project added to portfolio & resume");
    }
    setProjectDialogOpen(false);
  };

  // Skills
  const handleOpenSkillModal = (s?: Skill) => {
    if (s) {
      setEditingSkill(s);
      setSkillName(s.name);
      setSkillScore(s.score);
    } else {
      setEditingSkill(null);
      setSkillName("");
      setSkillScore(80);
    }
    setSkillDialogOpen(true);
  };

  const handleSaveSkill = () => {
    if (!skillName.trim()) {
      toast.error("Please enter a skill name");
      return;
    }
    if (editingSkill) {
      updateSkill(editingSkill.name, { score: skillScore });
      toast.success(`Updated ${editingSkill.name} score to ${skillScore}%`);
    } else {
      addSkill({ name: skillName.trim(), score: skillScore });
      toast.success(`Added ${skillName.trim()} to your skills`);
    }
    setSkillDialogOpen(false);
  };

  // Experience
  const handleOpenExpModal = (exp?: WorkExperience) => {
    if (exp) {
      setEditingExp(exp);
      setExpRole(exp.role);
      setExpCompany(exp.company);
      setExpDuration(exp.duration);
      setExpLocation(exp.location ?? "");
      setExpDesc(exp.description ?? "");
      setExpType(exp.type ?? "Internship");
    } else {
      setEditingExp(null);
      setExpRole("");
      setExpCompany("");
      setExpDuration("");
      setExpLocation("");
      setExpDesc("");
      setExpType("Internship");
    }
    setExpDialogOpen(true);
  };

  const handleSaveExp = () => {
    if (!expRole.trim() || !expCompany.trim()) {
      toast.error("Role and Company are required");
      return;
    }
    if (editingExp) {
      updateExperience(editingExp.id, {
        role: expRole.trim(),
        company: expCompany.trim(),
        duration: expDuration.trim() || "Present",
        location: expLocation.trim() || undefined,
        description: expDesc.trim() || undefined,
        type: expType,
      });
      toast.success("Experience updated");
    } else {
      addExperience({
        role: expRole.trim(),
        company: expCompany.trim(),
        duration: expDuration.trim() || "2025",
        location: expLocation.trim() || undefined,
        description: expDesc.trim() || undefined,
        type: expType,
      });
      toast.success("Experience added to profile & resume");
    }
    setExpDialogOpen(false);
  };

  // Achievements
  const handleOpenAchModal = (ach?: Achievement) => {
    if (ach) {
      setEditingAch(ach);
      setAchTitle(ach.title);
      setAchIssuer(ach.issuer ?? "");
      setAchDate(ach.date ?? "");
      setAchDesc(ach.description ?? "");
    } else {
      setEditingAch(null);
      setAchTitle("");
      setAchIssuer("");
      setAchDate("");
      setAchDesc("");
    }
    setAchDialogOpen(true);
  };

  const handleSaveAch = () => {
    if (!achTitle.trim()) {
      toast.error("Achievement title is required");
      return;
    }
    if (editingAch) {
      updateAchievement(editingAch.id, {
        title: achTitle.trim(),
        issuer: achIssuer.trim() || undefined,
        date: achDate.trim() || undefined,
        description: achDesc.trim() || undefined,
      });
      toast.success("Achievement updated");
    } else {
      addAchievement({
        title: achTitle.trim(),
        issuer: achIssuer.trim() || undefined,
        date: achDate.trim() || "2025",
        description: achDesc.trim() || undefined,
      });
      toast.success("Achievement added");
    }
    setAchDialogOpen(false);
  };

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        eyebrow="Public Identity & Credentials"
        title="Digital Portfolio"
        description="Showcase verified skills, shipped projects, work history, and achievements in one living profile."
        action={
          <Button onClick={handleOpenProfileModal} className="gap-2">
            <Pencil className="size-4" /> Edit Profile
          </Button>
        }
      />

      {/* Hero Profile Card */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-primary/5 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="group relative size-24 shrink-0 overflow-hidden rounded-2xl border-2 border-primary/20 bg-muted shadow-md">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="size-full object-cover" />
              ) : (
                <div className="grid size-full place-items-center bg-primary/10 text-primary font-display text-2xl font-bold">
                  {profile.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  setAvatarInput(profile.avatar ?? AVATAR_PRESETS[0]!);
                  setAvatarDialogOpen(true);
                }}
                className="absolute inset-0 grid place-items-center bg-black/60 opacity-0 backdrop-blur-xs transition-opacity group-hover:opacity-100 text-white text-xs font-semibold"
                aria-label="Change photo"
              >
                Change Photo
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {profile.name}
                </h1>
                <Badge className="bg-primary/10 text-primary hover:bg-primary/15 font-medium">
                  {profile.degree} · {profile.year}
                </Badge>
              </div>

              <p className="text-sm font-medium text-primary">
                {profile.headline || `${profile.degree} in ${profile.branch}`}
              </p>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1">
                  <GraduationCap className="size-3.5 text-primary" />
                  {profile.college}
                </span>
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5 text-amber-600" />
                    {profile.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Mail className="size-3.5 text-primary" />
                  {profile.email}
                </span>
                {profile.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="size-3.5 text-emerald-600" />
                    {profile.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:self-start">
            {profile.socialLinks?.github && (
              <Button asChild size="sm" variant="outline" className="gap-1.5">
                <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer">
                  <Github className="size-3.5" /> GitHub
                </a>
              </Button>
            )}
            {profile.socialLinks?.linkedin && (
              <Button asChild size="sm" variant="outline" className="gap-1.5">
                <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="size-3.5 text-[#0077b5]" /> LinkedIn
                </a>
              </Button>
            )}
            {profile.socialLinks?.website && (
              <Button asChild size="sm" variant="outline" className="gap-1.5">
                <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="size-3.5 text-primary" /> Website
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6 border-t border-border/80 pt-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              About & Career Focus
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs gap-1"
              onClick={handleOpenProfileModal}
            >
              <Edit2 className="size-3" /> Edit Bio
            </Button>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">{profile.about}</p>
        </div>
      </section>

      {/* Skills Section */}
      <SectionCard
        title={
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            <h2 className="font-display text-lg font-semibold">Verified Skills & Proficiency</h2>
          </div>
        }
        action={
          <Button size="sm" onClick={() => handleOpenSkillModal()} className="gap-1">
            <Plus className="size-3.5" /> Add Skill
          </Button>
        }
      >
        <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {profile.skills.map((skill) => (
            <div
              key={skill.name}
              className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-3.5 transition hover:border-primary/40 hover:shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-medium text-sm text-foreground">{skill.name}</span>
                <span className="text-xs font-semibold tabular-nums text-primary">
                  {skill.score}%
                </span>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${skill.score}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => handleOpenSkillModal(skill)}
                  className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label={`Edit ${skill.name}`}
                >
                  <Edit2 className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDeleteConfirm({
                      open: true,
                      title: `Delete ${skill.name}?`,
                      description: "This will remove the skill from your portfolio and resume.",
                      onConfirm: () => {
                        deleteSkill(skill.name);
                        toast.success(`Removed ${skill.name}`);
                      },
                    });
                  }}
                  className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  aria-label={`Delete ${skill.name}`}
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Projects Section */}
      <SectionCard
        title={
          <div className="flex items-center gap-2">
            <Code2 className="size-5 text-primary" />
            <h2 className="font-display text-lg font-semibold">Featured Projects</h2>
          </div>
        }
        action={
          <Button size="sm" onClick={() => handleOpenProjectModal()} className="gap-1">
            <Plus className="size-3.5" /> Add Project
          </Button>
        }
      >
        {profile.projects.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">No projects added yet.</p>
            <Button size="sm" className="mt-3 gap-1" onClick={() => handleOpenProjectModal()}>
              <Plus className="size-3.5" /> Add your first project
            </Button>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {profile.projects.map((project) => (
              <div
                key={project.id || project.title}
                className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-base font-semibold text-foreground leading-snug">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => handleOpenProjectModal(project)}
                        className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                        aria-label="Edit project"
                      >
                        <Edit2 className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteConfirm({
                            open: true,
                            title: `Delete project "${project.title}"?`,
                            description:
                              "This project will be removed from your portfolio and resume.",
                            onConfirm: () => {
                              deleteProject(project.id);
                              toast.success("Project deleted");
                            },
                          });
                        }}
                        className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Delete project"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  {project.duration && (
                    <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="size-3" /> {project.duration}
                    </p>
                  )}

                  <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {project.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {project.tech.map((t) => (
                      <SkillTag key={t} muted>
                        {t}
                      </SkillTag>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-border/80 pt-3">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      <Github className="size-3.5" /> Code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline ml-auto"
                    >
                      <ExternalLink className="size-3.5" /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Internship & Work History Section */}
      <SectionCard
        title={
          <div className="flex items-center gap-2">
            <Briefcase className="size-5 text-primary" />
            <h2 className="font-display text-lg font-semibold">Internship & Experience History</h2>
          </div>
        }
        action={
          <Button size="sm" onClick={() => handleOpenExpModal()} className="gap-1">
            <Plus className="size-3.5" /> Add Experience
          </Button>
        }
      >
        {!profile.experience || profile.experience.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No work experience or internships listed yet.
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {profile.experience.map((exp) => (
              <div
                key={exp.id}
                className="group flex flex-col justify-between gap-3 rounded-xl border border-border bg-card p-4 transition hover:border-primary/40 sm:flex-row sm:items-start"
              >
                <div className="flex items-start gap-3">
                  <CompanyMark name={exp.company} hue={220} />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-foreground text-sm">{exp.role}</h3>
                      <Badge variant="outline" className="text-xs">
                        {exp.type ?? "Internship"}
                      </Badge>
                    </div>
                    <p className="text-xs text-primary font-medium mt-0.5">{exp.company}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" /> {exp.duration}
                      </span>
                      {exp.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3" /> {exp.location}
                        </span>
                      )}
                    </div>
                    {exp.description && (
                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 self-end sm:self-start opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => handleOpenExpModal(exp)}
                    className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label="Edit experience"
                  >
                    <Edit2 className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteConfirm({
                        open: true,
                        title: `Delete experience at ${exp.company}?`,
                        description: "This entry will be removed from your profile and resume.",
                        onConfirm: () => {
                          deleteExperience(exp.id);
                          toast.success("Experience removed");
                        },
                      });
                    }}
                    className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Delete experience"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Achievements Section */}
      <SectionCard
        title={
          <div className="flex items-center gap-2">
            <Award className="size-5 text-primary" />
            <h2 className="font-display text-lg font-semibold">Honors & Achievements</h2>
          </div>
        }
        action={
          <Button size="sm" onClick={() => handleOpenAchModal()} className="gap-1">
            <Plus className="size-3.5" /> Add Achievement
          </Button>
        }
      >
        {!profile.achievements || profile.achievements.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No achievements added yet.
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {profile.achievements.map((ach) => (
              <div
                key={ach.id}
                className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-4 transition hover:border-primary/40 hover:shadow-xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-sm text-foreground leading-snug">
                      {ach.title}
                    </h3>
                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => handleOpenAchModal(ach)}
                        className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                        aria-label="Edit achievement"
                      >
                        <Edit2 className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteConfirm({
                            open: true,
                            title: "Delete achievement?",
                            description: "This achievement will be removed from your profile.",
                            onConfirm: () => {
                              deleteAchievement(ach.id);
                              toast.success("Achievement removed");
                            },
                          });
                        }}
                        className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Delete achievement"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                  {ach.issuer && (
                    <p className="mt-1 text-xs text-primary font-medium">{ach.issuer}</p>
                  )}
                  {ach.date && (
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{ach.date}</p>
                  )}
                  {ach.description && (
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      {ach.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* ========================================================
          DIALOGS
         ======================================================== */}

      {/* Profile Edit Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Profile Information</DialogTitle>
            <DialogDescription>
              Update your name, bio, and social channels. Changes synchronize with your resume.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="prof-name">Full Name</Label>
              <Input
                id="prof-name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. Sanket Kumar Rana"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="prof-headline">Professional Headline / Role Title</Label>
              <Input
                id="prof-headline"
                value={headlineInput}
                onChange={(e) => setHeadlineInput(e.target.value)}
                placeholder="e.g. Full-Stack Engineer & Machine Learning"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="prof-phone">Phone Number</Label>
                <Input
                  id="prof-phone"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="prof-loc">Location</Label>
                <Input
                  id="prof-loc"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder="Raipur, India"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="prof-about">Bio / Professional Summary</Label>
              <Textarea
                id="prof-about"
                rows={4}
                value={aboutInput}
                onChange={(e) => setAboutInput(e.target.value)}
                placeholder="Tell recruiters about your background, key strengths, and goals..."
              />
            </div>
            <div className="space-y-2 pt-2 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Social Links
              </p>
              <div className="grid gap-2">
                <Label htmlFor="prof-gh" className="text-xs">
                  GitHub Profile URL
                </Label>
                <Input
                  id="prof-gh"
                  value={githubInput}
                  onChange={(e) => setGithubInput(e.target.value)}
                  placeholder="https://github.com/username"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="prof-li" className="text-xs">
                  LinkedIn Profile URL
                </Label>
                <Input
                  id="prof-li"
                  value={linkedinInput}
                  onChange={(e) => setLinkedinInput(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="prof-web" className="text-xs">
                  Portfolio Website URL
                </Label>
                <Input
                  id="prof-web"
                  value={websiteInput}
                  onChange={(e) => setWebsiteInput(e.target.value)}
                  placeholder="https://yourportfolio.dev"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProfileDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Avatar Dialog */}
      <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choose Profile Photo</DialogTitle>
            <DialogDescription>
              Select a preset avatar or paste a custom image URL.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Preset Avatars
              </Label>
              <div className="mt-2 flex gap-3 overflow-x-auto pb-2">
                {AVATAR_PRESETS.map((preset, idx) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleSaveAvatar(preset)}
                    className="relative size-14 shrink-0 overflow-hidden rounded-xl border-2 transition hover:scale-105"
                    style={{
                      borderColor: profile.avatar === preset ? "var(--primary)" : "transparent",
                    }}
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
            <div className="grid gap-2 pt-2 border-t border-border">
              <Label htmlFor="custom-avatar">Custom Image URL</Label>
              <div className="flex gap-2">
                <Input
                  id="custom-avatar"
                  value={avatarInput}
                  onChange={(e) => setAvatarInput(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                />
                <Button onClick={() => handleSaveAvatar(avatarInput)}>Apply</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Project Modal */}
      <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
            <DialogDescription>
              Details about your engineering project. Automatically updates Resume Builder.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3.5 py-2">
            <div className="grid gap-2">
              <Label htmlFor="proj-title">Project Title *</Label>
              <Input
                id="proj-title"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="e.g. CampusFlow — Placement Tracker"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="proj-dur">Duration</Label>
                <Input
                  id="proj-dur"
                  value={projectDuration}
                  onChange={(e) => setProjectDuration(e.target.value)}
                  placeholder="e.g. 3 months · 2025"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="proj-tech">Technologies (comma-separated)</Label>
                <Input
                  id="proj-tech"
                  value={projectTech}
                  onChange={(e) => setProjectTech(e.target.value)}
                  placeholder="React, TypeScript, SQL"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="proj-desc">Description</Label>
              <Textarea
                id="proj-desc"
                rows={3}
                value={projectDesc}
                onChange={(e) => setProjectDesc(e.target.value)}
                placeholder="Briefly describe what problem this project solves, key features, and outcomes..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="proj-gh">GitHub Link (optional)</Label>
                <Input
                  id="proj-gh"
                  value={projectGithub}
                  onChange={(e) => setProjectGithub(e.target.value)}
                  placeholder="https://github.com/..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="proj-live">Demo / Live URL (optional)</Label>
                <Input
                  id="proj-live"
                  value={projectLive}
                  onChange={(e) => setProjectLive(e.target.value)}
                  placeholder="https://demo.app"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProjectDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProject}>
              {editingProject ? "Save Changes" : "Add Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Skill Modal */}
      <Dialog open={skillDialogOpen} onOpenChange={setSkillDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingSkill ? `Edit ${editingSkill.name}` : "Add Skill"}</DialogTitle>
            <DialogDescription>
              Specify the skill name and your assessed confidence level (0-100%).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="sk-name">Skill Name</Label>
              <Input
                id="sk-name"
                disabled={!!editingSkill}
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                placeholder="e.g. Next.js, Docker, Python"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <Label>Proficiency Score</Label>
                <span className="font-semibold text-primary">{skillScore}%</span>
              </div>
              <Slider
                value={[skillScore]}
                onValueChange={(val) => setSkillScore(val[0] ?? 75)}
                min={10}
                max={100}
                step={1}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSkillDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSkill}>{editingSkill ? "Update Score" : "Add Skill"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Experience Modal */}
      <Dialog open={expDialogOpen} onOpenChange={setExpDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingExp ? "Edit Experience" : "Add Work Experience"}</DialogTitle>
            <DialogDescription>
              Document your internships, full-time, or club leadership roles.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3.5 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="exp-role">Role Title *</Label>
                <Input
                  id="exp-role"
                  value={expRole}
                  onChange={(e) => setExpRole(e.target.value)}
                  placeholder="e.g. Frontend Engineering Intern"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="exp-company">Company / Organization *</Label>
                <Input
                  id="exp-company"
                  value={expCompany}
                  onChange={(e) => setExpCompany(e.target.value)}
                  placeholder="e.g. Nexora Labs"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="exp-dur">Duration</Label>
                <Input
                  id="exp-dur"
                  value={expDuration}
                  onChange={(e) => setExpDuration(e.target.value)}
                  placeholder="May 2025 - Jul 2025"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="exp-loc">Location</Label>
                <Input
                  id="exp-loc"
                  value={expLocation}
                  onChange={(e) => setExpLocation(e.target.value)}
                  placeholder="Bengaluru (Hybrid)"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="exp-type">Type</Label>
                <select
                  id="exp-type"
                  value={expType}
                  onChange={(e) => setExpType(e.target.value as WorkExperience["type"])}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="Internship">Internship</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="exp-desc">Responsibilities & Key Highlights</Label>
              <Textarea
                id="exp-desc"
                rows={3}
                value={expDesc}
                onChange={(e) => setExpDesc(e.target.value)}
                placeholder="Bullet points or short description of what you accomplished..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExpDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveExp}>
              {editingExp ? "Save Changes" : "Add Experience"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Achievement Modal */}
      <Dialog open={achDialogOpen} onOpenChange={setAchDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingAch ? "Edit Achievement" : "Add Achievement"}</DialogTitle>
            <DialogDescription>
              Highlight hackathon awards, academic honors, or contest rankings.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid gap-2">
              <Label htmlFor="ach-title">Title *</Label>
              <Input
                id="ach-title"
                value={achTitle}
                onChange={(e) => setAchTitle(e.target.value)}
                placeholder="e.g. 1st Place — National Hackathon"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="ach-issuer">Issuing Body</Label>
                <Input
                  id="ach-issuer"
                  value={achIssuer}
                  onChange={(e) => setAchIssuer(e.target.value)}
                  placeholder="e.g. AICTE / NIT"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ach-date">Date / Year</Label>
                <Input
                  id="ach-date"
                  value={achDate}
                  onChange={(e) => setAchDate(e.target.value)}
                  placeholder="e.g. Oct 2024"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ach-desc">Description</Label>
              <Textarea
                id="ach-desc"
                rows={2}
                value={achDesc}
                onChange={(e) => setAchDesc(e.target.value)}
                placeholder="Short summary of the achievement..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAchDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAch}>
              {editingAch ? "Save Changes" : "Add Achievement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm((prev) => ({ ...prev, open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{deleteConfirm.title}</AlertDialogTitle>
            <AlertDialogDescription>{deleteConfirm.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                deleteConfirm.onConfirm();
                setDeleteConfirm((prev) => ({ ...prev, open: false }));
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
