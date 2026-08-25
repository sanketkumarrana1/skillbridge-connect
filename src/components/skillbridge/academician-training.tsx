import { useState } from "react";
import {
  Award,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  GraduationCap,
  Layers,
  MapPin,
  Play,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
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
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionCard, Stat, WorkspaceHeader } from "@/components/skillbridge/student-ui";
import { useAppState } from "@/context/app-state";
import type { FacultyTraining } from "@/types";

export function AcademicianTraining() {
  const { facultyTrainings, registerFacultyTraining, updateTrainingProgress, profile } =
    useAppState();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTraining, setSelectedTraining] = useState<FacultyTraining | null>(null);
  const [certificateModal, setCertificateModal] = useState<FacultyTraining | null>(null);

  const handleRegister = (id: string, title: string) => {
    registerFacultyTraining(id);
    toast.success(`🎉 Successfully enrolled in "${title}"!`);
    if (selectedTraining && selectedTraining.id === id) {
      setSelectedTraining((prev) =>
        prev
          ? { ...prev, registered: true, enrolledCount: prev.enrolledCount + 1, progress: 10 }
          : null,
      );
    }
  };

  const handleAdvanceProgress = (id: string, current: number) => {
    const next = Math.min(100, current + 25);
    updateTrainingProgress(id, next);
    if (next === 100) {
      toast.success("🏆 Program completed! Your Certificate of Mastery is now ready.");
    } else {
      toast.success(`Progress updated to ${next}%.`);
    }
  };

  const filtered = facultyTrainings.filter((t) => {
    return (
      searchQuery.trim() === "" ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.domain.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const enrolledCount = facultyTrainings.filter((t) => t.registered).length;
  const completedCount = facultyTrainings.filter((t) => (t.progress ?? 0) >= 100).length;

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        eyebrow="Pedagogical Upskilling"
        title="Industrial Faculty Training Programs"
        description="Upskill in enterprise tech stacks with structured syllabi curated by AWS, Microsoft, NVIDIA, IBM, and Cisco."
      />

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Total Programs"
          value={facultyTrainings.length.toString()}
          trend="Certified curriculums"
          icon={BookOpen}
        />
        <Stat
          label="My Enrollments"
          value={enrolledCount.toString()}
          trend="Active tracks"
          icon={Award}
        />
        <Stat
          label="Completed Tracks"
          value={completedCount.toString()}
          trend="Certifications unlocked"
          icon={CheckCircle2}
        />
        <Stat
          label="Industry Providers"
          value="5 Global Leaders"
          trend="AWS, NVIDIA, MS, IBM, Cisco"
          icon={GraduationCap}
        />
      </div>

      {/* Main Training Programs Directory */}
      <SectionCard
        title={
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold">
              Available Training Tracks ({filtered.length})
            </h2>
            <div className="relative w-48 sm:w-64">
              <Search className="absolute left-2.5 top-2 size-3.5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by topic, provider..."
                className="pl-8 h-8 text-xs"
              />
            </div>
          </div>
        }
      >
        <div className="grid gap-5 md:grid-cols-2 pt-2">
          {filtered.map((item) => {
            const isRegistered = item.registered;
            const progress = item.progress ?? 0;
            const isCompleted = progress >= 100;

            return (
              <Card
                key={item.id}
                className="flex flex-col justify-between border border-border bg-card transition hover:border-primary/40 hover:shadow-md"
              >
                <CardContent className="p-5 space-y-4 flex flex-col justify-between h-full">
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <Badge
                        variant="outline"
                        className="text-[10px] text-primary border-primary/30"
                      >
                        {item.domain}
                      </Badge>
                      <Badge
                        variant={isCompleted ? "default" : isRegistered ? "secondary" : "outline"}
                        className={
                          isCompleted
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]"
                            : isRegistered
                              ? "bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px]"
                              : "text-[10px]"
                        }
                      >
                        {isCompleted ? "Certificate Ready" : isRegistered ? "Enrolled" : item.mode}
                      </Badge>
                    </div>

                    <h3 className="font-display text-base font-bold text-foreground line-clamp-2 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs font-semibold text-primary">{item.provider}</p>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3 text-primary" /> {item.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3 text-primary" /> {item.startDate} -{" "}
                        {item.endDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="size-3 text-emerald-600" /> {item.enrolledCount}/
                        {item.capacity} Seats
                      </span>
                    </div>

                    {/* Progress Bar if Registered */}
                    {isRegistered && (
                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Course Completion</span>
                          <span className="font-bold text-foreground">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-1.5" />
                      </div>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs"
                      onClick={() => setSelectedTraining(item)}
                    >
                      View Syllabus ({item.syllabus.length} Weeks)
                    </Button>

                    <div className="flex items-center gap-2">
                      {isCompleted ? (
                        <Button
                          size="sm"
                          className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                          onClick={() => setCertificateModal(item)}
                        >
                          <Award className="size-3.5" /> Certificate
                        </Button>
                      ) : isRegistered ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs text-primary border-primary/30 hover:bg-primary/10 gap-1"
                          onClick={() => handleAdvanceProgress(item.id, progress)}
                        >
                          <Play className="size-3" /> Advance Progress
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => handleRegister(item.id, item.title)}
                        >
                          Enroll Now
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </SectionCard>

      {/* Syllabus Modal */}
      <Dialog open={!!selectedTraining} onOpenChange={(open) => !open && setSelectedTraining(null)}>
        {selectedTraining && (
          <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-primary text-[10px]">
                  {selectedTraining.domain}
                </Badge>
                <Badge variant="secondary" className="text-[10px]">
                  {selectedTraining.mode}
                </Badge>
              </div>
              <DialogTitle className="text-lg font-bold font-display text-foreground">
                {selectedTraining.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Curriculum provided by {selectedTraining.provider} • {selectedTraining.duration}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="rounded-xl border border-border bg-muted/20 p-3 text-xs space-y-1">
                <p className="font-semibold text-foreground">Cohort Schedule:</p>
                <p className="text-muted-foreground">{selectedTraining.schedule}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
                  Weekly Syllabus Breakdown
                </h4>
                <div className="space-y-2.5">
                  {selectedTraining.syllabus.map((syl) => (
                    <div
                      key={syl.week}
                      className="rounded-xl border border-border p-3 space-y-1 bg-card"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-foreground">
                        <span>
                          Week {syl.week}: {syl.topic}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{syl.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="border-t border-border pt-3">
              <Button variant="outline" onClick={() => setSelectedTraining(null)}>
                Close
              </Button>
              {!selectedTraining.registered && (
                <Button
                  onClick={() => handleRegister(selectedTraining.id, selectedTraining.title)}
                  className="gap-1.5"
                >
                  <Sparkles className="size-4" /> Enroll in Cohort
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Completion Certificate Modal */}
      <Dialog open={!!certificateModal} onOpenChange={(open) => !open && setCertificateModal(null)}>
        {certificateModal && (
          <DialogContent className="sm:max-w-xl p-0 overflow-hidden">
            <div className="bg-gradient-to-br from-primary/15 via-background to-accent/15 p-8 border-b border-border text-center space-y-4">
              <div className="inline-flex size-14 place-items-center rounded-2xl bg-primary/20 text-primary border border-primary/30 mx-auto">
                <Award className="size-7 mx-auto" />
              </div>

              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-widest font-bold text-primary">
                  Certificate of Industrial Mastery
                </p>
                <h2 className="text-2xl font-bold font-display text-foreground">
                  {certificateModal.title}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Certified by {certificateModal.provider}
                </p>
              </div>

              <div className="border-y border-border/80 py-4 max-w-md mx-auto space-y-1">
                <p className="text-xs text-muted-foreground">This is proudly awarded to</p>
                <p className="text-xl font-bold text-foreground font-display">
                  Dr. Faculty Member / Academician
                </p>
                <p className="text-xs text-muted-foreground">
                  for successfully completing 40 hours of advanced hands-on enterprise technical
                  training.
                </p>
              </div>

              <div className="flex items-center justify-center gap-6 text-[11px] text-muted-foreground pt-1">
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <ShieldCheck className="size-3.5" /> Verified Credential
                </span>
                <span>Issue Date: 30 Sep 2026</span>
                <span>ID: SKB-FAC-{certificateModal.id.toUpperCase()}</span>
              </div>
            </div>

            <div className="p-4 bg-muted/40 flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={() => setCertificateModal(null)}>
                Close
              </Button>
              <Button
                size="sm"
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => {
                  toast.success("📄 Downloading Certificate PDF...");
                  setCertificateModal(null);
                }}
              >
                <Download className="size-3.5" /> Download Official PDF
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
