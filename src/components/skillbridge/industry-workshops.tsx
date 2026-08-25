import { useState } from "react";
import {
  Award,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  Edit2,
  GraduationCap,
  Layers,
  MapPin,
  Plus,
  Radio,
  Search,
  Sparkles,
  Trash2,
  Users,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { SkillTag } from "@/components/skillbridge/primitives";
import { SectionCard, Stat, WorkspaceHeader } from "@/components/skillbridge/student-ui";
import { useAppState } from "@/context/app-state";
import type { TrainingProgram, TrainingProgramType } from "@/types";

const PROGRAM_TYPES: TrainingProgramType[] = [
  "Workshop",
  "Bootcamp",
  "Certification Program",
  "Mentorship Program",
  "Live Industry Project",
];

export function IndustryWorkshops() {
  const {
    companyProfile,
    trainingPrograms,
    addTrainingProgram,
    updateTrainingProgram,
    deleteTrainingProgram,
  } = useAppState();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Create Form State
  const [title, setTitle] = useState("");
  const [progType, setProgType] = useState<TrainingProgramType>("Workshop");
  const [desc, setDesc] = useState("");
  const [skills, setSkills] = useState("");
  const [duration, setDuration] = useState("");
  const [capacity, setCapacity] = useState("50");
  const [mode, setMode] = useState<"Online" | "Hybrid" | "In-person">("Online");
  const [startDate, setStartDate] = useState("");
  const [instructor, setInstructor] = useState("");
  const [deadline, setDeadline] = useState("");

  // Edit / Delete Modal State
  const [editingProgram, setEditingProgram] = useState<TrainingProgram | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string; title: string }>({
    open: false,
    id: "",
    title: "",
  });

  // KPI Metrics
  const totalPrograms = trainingPrograms.length;
  const publishedPrograms = trainingPrograms.filter((p) => p.status !== "Draft").length;
  const totalEnrolled = trainingPrograms.reduce((acc, p) => acc + (p.enrolledCount || 0), 0);
  const totalCapacity = trainingPrograms.reduce((acc, p) => acc + (p.capacity || 0), 0);

  const resetForm = () => {
    setTitle("");
    setProgType("Workshop");
    setDesc("");
    setSkills("");
    setDuration("");
    setCapacity("50");
    setMode("Online");
    setStartDate("");
    setInstructor("");
    setDeadline("");
  };

  const handlePublish = (asDraft = false) => {
    if (!title.trim() || !desc.trim() || !skills.trim()) {
      toast.error("Please fill in title, description, and required skills.");
      return;
    }

    const skillsArr = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const capNum = parseInt(capacity, 10) || 50;

    const newProgram: TrainingProgram = {
      id: `train-${Date.now()}`,
      company: companyProfile.name,
      companyLogoHue: companyProfile.logoHue,
      title: title.trim(),
      type: progType,
      description: desc.trim(),
      skills: skillsArr,
      duration: duration.trim() || "4 Weeks",
      capacity: capNum,
      enrolledCount: 0,
      mode,
      startDate: startDate.trim() || "15 Oct 2026",
      instructor: instructor.trim() || `${companyProfile.name} Engineering Team`,
      status: asDraft ? "Draft" : "Published",
      registrationDeadline: deadline.trim() || "10 Oct 2026",
    };

    addTrainingProgram(newProgram);
    resetForm();
    toast.success(
      asDraft
        ? "Training program saved as draft."
        : "🎉 Program published successfully! Visible to students across partner universities.",
    );
  };

  const handleSaveEdit = () => {
    if (!editingProgram) return;
    updateTrainingProgram(editingProgram.id, editingProgram);
    setEditingProgram(null);
    toast.success("Training program updated successfully.");
  };

  const filteredPrograms = trainingPrograms.filter((p) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.instructor && p.instructor.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = typeFilter === "all" || p.type === typeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        eyebrow="Talent Upskilling"
        title="Workshops & Training Programs"
        description="Publish industry-standard bootcamps, masterclasses, and mentorship programs to upskill partner campus talent."
      />

      {/* KPI Ribbon */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Total Programs"
          value={totalPrograms.toString()}
          trend={`${publishedPrograms} published`}
          icon={BookOpen}
        />
        <Stat
          label="Active Students"
          value={totalEnrolled.toString()}
          trend="Enrolled across cohorts"
          icon={Users}
        />
        <Stat
          label="Total Cohort Seats"
          value={totalCapacity.toString()}
          trend="Available capacity"
          icon={Layers}
        />
        <Stat
          label="Seat Utilization"
          value={totalCapacity > 0 ? `${Math.round((totalEnrolled / totalCapacity) * 100)}%` : "0%"}
          trend="Enrollment rate"
          icon={Sparkles}
        />
      </div>

      {/* Post Program Form & Preview */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Form */}
        <div className="lg:col-span-7">
          <SectionCard
            title={
              <div className="flex items-center gap-2">
                <GraduationCap className="size-5 text-primary" />
                <h2 className="font-display text-lg font-semibold">Publish New Training Program</h2>
              </div>
            }
          >
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label>Program Track / Type *</Label>
                  <select
                    value={progType}
                    onChange={(e) => setProgType(e.target.value as TrainingProgramType)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {PROGRAM_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-2">
                  <Label>Delivery Mode</Label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as "Online" | "Hybrid" | "In-person")}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="Online">Online / Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="In-person">In-person Campus</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Program Title *</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Distributed Cloud Architecture & Kubernetes Masterclass"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label>Duration</Label>
                  <Input
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 4 Weeks (Sat & Sun)"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Student Capacity (Max Seats)</Label>
                  <Input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label>Cohort Start Date</Label>
                  <Input
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="e.g. 15 Oct 2026"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Lead Instructor / Speaker</Label>
                  <Input
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                    placeholder="e.g. Vikram Sharma, Principal Architect"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Skills & Technologies Covered * (comma-separated)</Label>
                <Input
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="React, TypeScript, Docker, Kubernetes, AWS"
                />
              </div>

              <div className="grid gap-2">
                <Label>Program Description & Curriculum Highlights *</Label>
                <Textarea
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Outline syllabus, weekly modules, live project capstone, and certifications awarded..."
                />
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-border">
                <Button variant="outline" onClick={() => handlePublish(true)}>
                  Save as Draft
                </Button>
                <Button onClick={() => handlePublish(false)} className="gap-2">
                  <Sparkles className="size-4" /> Publish Program
                </Button>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Live Card Preview */}
        <div className="lg:col-span-5">
          <SectionCard title="Live Student Marketplace Preview">
            <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-card to-primary/5 p-5 shadow-xs space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Badge
                    variant="outline"
                    className="text-[10px] text-primary border-primary/30 mb-1"
                  >
                    {progType}
                  </Badge>
                  <h3 className="font-display text-base font-bold text-foreground">
                    {title || "Distributed Cloud Architecture Masterclass"}
                  </h3>
                  <p className="text-xs text-muted-foreground font-semibold">
                    {companyProfile.name}
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {mode}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="size-3 text-primary" /> {duration || "4 Weeks"}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="size-3 text-primary" /> Starts {startDate || "15 Oct 2026"}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="size-3 text-emerald-600" /> Max {capacity || "50"} Seats
                </span>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                {desc ||
                  "Master enterprise architecture patterns, containerized deployments on Kubernetes, and real-time streaming architectures with direct mentorship from industry engineers."}
              </p>

              <div className="flex flex-wrap gap-1 pt-1">
                {(skills
                  ? skills
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean)
                  : ["React", "Kubernetes", "AWS"]
                ).map((s) => (
                  <SkillTag key={s} muted>
                    {s}
                  </SkillTag>
                ))}
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <span>Instructor: {instructor || "Principal Architect"}</span>
                <span className="text-emerald-600 font-semibold">Free Industry Access</span>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Manage Published Programs Table */}
      <SectionCard
        title={
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold">
              Your Published Programs ({filteredPrograms.length})
            </h2>
            <div className="flex items-center gap-2">
              <div className="relative w-48 sm:w-60">
                <Search className="absolute left-2.5 top-2 size-3.5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search programs..."
                  className="pl-8 h-8 text-xs"
                />
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-8 rounded-md border border-input bg-transparent px-2 text-xs shadow-xs"
              >
                <option value="all">All Types</option>
                {PROGRAM_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        }
      >
        <div className="divide-y divide-border pt-2">
          {filteredPrograms.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No training programs match your filter.
            </div>
          ) : (
            filteredPrograms.map((prog) => {
              const isDraft = prog.status === "Draft";
              const percent =
                prog.capacity > 0 ? Math.round((prog.enrolledCount / prog.capacity) * 100) : 0;

              return (
                <div
                  key={prog.id}
                  className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className="text-[10px] text-primary border-primary/30"
                      >
                        {prog.type}
                      </Badge>
                      <h3 className="font-semibold text-sm text-foreground">{prog.title}</h3>
                      <Badge
                        variant={isDraft ? "outline" : "default"}
                        className={
                          isDraft
                            ? "text-muted-foreground text-[10px]"
                            : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]"
                        }
                      >
                        {isDraft ? "Draft" : "Published"}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-1">{prog.description}</p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-0.5">
                      <span>{prog.mode}</span>
                      <span>•</span>
                      <span>{prog.duration}</span>
                      <span>•</span>
                      <span>Starts {prog.startDate}</span>
                      <span>•</span>
                      <span>Lead: {prog.instructor}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {prog.skills.map((s) => (
                        <SkillTag key={s} muted>
                          {s}
                        </SkillTag>
                      ))}
                    </div>
                  </div>

                  {/* Seat Enrollment Gauge & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6 shrink-0">
                    <div className="w-36 space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-muted-foreground">Enrollment</span>
                        <span className="font-bold text-foreground">
                          {prog.enrolledCount}/{prog.capacity}
                        </span>
                      </div>
                      <Progress value={percent} className="h-1.5" />
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs"
                        onClick={() => {
                          updateTrainingProgram(prog.id, {
                            status: isDraft ? "Published" : "Draft",
                          });
                          toast.success(`Program moved to ${isDraft ? "Published" : "Draft"}`);
                        }}
                      >
                        {isDraft ? "Publish" : "Move to Draft"}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 text-muted-foreground hover:text-foreground"
                        onClick={() => setEditingProgram(prog)}
                        aria-label="Edit program"
                      >
                        <Edit2 className="size-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        onClick={() =>
                          setDeleteDialog({
                            open: true,
                            id: prog.id,
                            title: prog.title,
                          })
                        }
                        aria-label="Delete program"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </SectionCard>

      {/* Edit Program Modal */}
      <Dialog open={!!editingProgram} onOpenChange={(open) => !open && setEditingProgram(null)}>
        {editingProgram && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Training Program</DialogTitle>
              <DialogDescription>Modify curriculum details, capacity, or dates.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="grid gap-2">
                <Label>Title</Label>
                <Input
                  value={editingProgram.title}
                  onChange={(e) => setEditingProgram({ ...editingProgram, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label>Track Type</Label>
                  <select
                    value={editingProgram.type}
                    onChange={(e) =>
                      setEditingProgram({
                        ...editingProgram,
                        type: e.target.value as TrainingProgramType,
                      })
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                  >
                    {PROGRAM_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label>Capacity</Label>
                  <Input
                    type="number"
                    value={editingProgram.capacity}
                    onChange={(e) =>
                      setEditingProgram({
                        ...editingProgram,
                        capacity: parseInt(e.target.value, 10) || 50,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label>Start Date</Label>
                  <Input
                    value={editingProgram.startDate}
                    onChange={(e) =>
                      setEditingProgram({ ...editingProgram, startDate: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Instructor</Label>
                  <Input
                    value={editingProgram.instructor || ""}
                    onChange={(e) =>
                      setEditingProgram({ ...editingProgram, instructor: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Skills (comma-separated)</Label>
                <Input
                  value={editingProgram.skills.join(", ")}
                  onChange={(e) =>
                    setEditingProgram({
                      ...editingProgram,
                      skills: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea
                  rows={3}
                  value={editingProgram.description}
                  onChange={(e) =>
                    setEditingProgram({ ...editingProgram, description: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingProgram(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Training Program?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">"{deleteDialog.title}"</span>? This
              will remove the program from student course enrollment directories.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                deleteTrainingProgram(deleteDialog.id);
                setDeleteDialog({ open: false, id: "", title: "" });
                toast.success("Training program deleted.");
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
