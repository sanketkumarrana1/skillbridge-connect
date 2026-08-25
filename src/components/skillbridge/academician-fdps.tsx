import { useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  Layers,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
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
import type { FacultyFDP } from "@/types";

export function AcademicianFDPs() {
  const { facultyFDPs, registerFacultyFDP } = useAppState();

  const [activeTab, setActiveTab] = useState<"catalog" | "my-fdps">("catalog");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFDP, setSelectedFDP] = useState<FacultyFDP | null>(null);

  const handleRegister = (id: string, title: string) => {
    registerFacultyFDP(id);
    toast.success(`🎉 Registered for "${title}"!`);
    if (selectedFDP && selectedFDP.id === id) {
      setSelectedFDP((prev) =>
        prev
          ? {
              ...prev,
              registered: true,
              enrolledCount: prev.enrolledCount + 1,
              status: "In Progress",
            }
          : null,
      );
    }
  };

  const filtered = useMemo(() => {
    return facultyFDPs.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.domain.toLowerCase().includes(searchQuery.toLowerCase());

      if (activeTab === "my-fdps") {
        return matchesSearch && item.registered;
      }

      return matchesSearch;
    });
  }, [facultyFDPs, searchQuery, activeTab]);

  const totalFDPs = facultyFDPs.length;
  const myFDPsCount = facultyFDPs.filter((f) => f.registered).length;
  const completedCount = facultyFDPs.filter((f) => f.status === "Completed" && f.registered).length;

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        eyebrow="National Pedagogy Initiatives"
        title="Faculty Development Programs (FDPs)"
        description="Participate in AICTE & Premier Institute recognized development programs to master emerging frontiers in computing and core engineering."
      />

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Total FDPs"
          value={totalFDPs.toString()}
          trend="National initiatives"
          icon={BookOpen}
        />
        <Stat
          label="Enrolled FDPs"
          value={myFDPsCount.toString()}
          trend="Active & upcoming"
          icon={GraduationCap}
        />
        <Stat
          label="Completed FDPs"
          value={completedCount.toString()}
          trend="Certified credits earned"
          icon={Award}
        />
        <Stat
          label="Host Institutes"
          value="IITs & NITs"
          trend="Premier accreditation"
          icon={ShieldCheck}
        />
      </div>

      {/* Main FDPs Tabs & Filter */}
      <SectionCard
        title={
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "catalog" | "my-fdps")}>
              <TabsList className="grid w-full grid-cols-2 sm:w-80">
                <TabsTrigger value="catalog">Explore All ({totalFDPs})</TabsTrigger>
                <TabsTrigger value="my-fdps">My FDPs ({myFDPsCount})</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative w-48 sm:w-64">
              <Search className="absolute left-2.5 top-2 size-3.5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search FDPs, institutes..."
                className="pl-8 h-8 text-xs"
              />
            </div>
          </div>
        }
      >
        <div className="grid gap-5 md:grid-cols-2 pt-2">
          {filtered.length === 0 ? (
            <div className="col-span-full py-12 text-center text-xs text-muted-foreground">
              No faculty development programs match the current filter.
            </div>
          ) : (
            filtered.map((fdp) => {
              const isEnrolled = fdp.registered;
              const isCompleted = fdp.status === "Completed" && isEnrolled;
              const seatsLeft = Math.max(0, fdp.capacity - fdp.enrolledCount);
              const seatPercent = Math.round((fdp.enrolledCount / fdp.capacity) * 100);

              return (
                <Card
                  key={fdp.id}
                  className="flex flex-col justify-between border border-border bg-card transition hover:border-primary/40 hover:shadow-md"
                >
                  <CardContent className="p-5 space-y-4 flex flex-col justify-between h-full">
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <Badge
                          variant="outline"
                          className="text-[10px] text-primary border-primary/30"
                        >
                          {fdp.domain}
                        </Badge>
                        <Badge
                          variant={isCompleted ? "default" : isEnrolled ? "secondary" : "outline"}
                          className={
                            isCompleted
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]"
                              : isEnrolled
                                ? "bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px]"
                                : "text-[10px]"
                          }
                        >
                          {isCompleted
                            ? "Completed"
                            : isEnrolled
                              ? "Enrolled"
                              : fdp.status || fdp.mode}
                        </Badge>
                      </div>

                      <h3 className="font-display text-base font-bold text-foreground line-clamp-2 leading-snug">
                        {fdp.title}
                      </h3>

                      <p className="text-xs font-semibold text-primary">{fdp.organizer}</p>

                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {fdp.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3 text-primary" /> {fdp.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3 text-primary" /> {fdp.startDate} -{" "}
                          {fdp.endDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="size-3 text-emerald-600" /> {fdp.mode}
                        </span>
                      </div>

                      {/* Seat Availability Gauge */}
                      <div className="space-y-1 pt-1.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-muted-foreground">Seat Availability</span>
                          <span className="font-semibold text-foreground">
                            {seatsLeft} / {fdp.capacity} Left ({seatPercent}%)
                          </span>
                        </div>
                        <Progress value={seatPercent} className="h-1.5" />
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-border flex items-center justify-between">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs"
                        onClick={() => setSelectedFDP(fdp)}
                      >
                        Outcomes & Details
                      </Button>

                      {isCompleted ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs py-1 px-2.5">
                          <CheckCircle2 className="size-3.5 mr-1" /> Certificate Earned
                        </Badge>
                      ) : isEnrolled ? (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 text-xs text-muted-foreground cursor-default"
                        >
                          <Check className="size-3.5 mr-1 text-emerald-600" /> Registered
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => handleRegister(fdp.id, fdp.title)}
                        >
                          Register Free
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </SectionCard>

      {/* Details Dialog */}
      <Dialog open={!!selectedFDP} onOpenChange={(open) => !open && setSelectedFDP(null)}>
        {selectedFDP && (
          <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-primary text-[10px]">
                  {selectedFDP.domain}
                </Badge>
                <Badge variant="secondary" className="text-[10px]">
                  {selectedFDP.mode}
                </Badge>
              </div>
              <DialogTitle className="text-lg font-bold font-display text-foreground">
                {selectedFDP.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Organized by {selectedFDP.organizer} • {selectedFDP.duration}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3 p-3 bg-muted/30 rounded-xl border border-border text-xs">
                <div>
                  <span className="text-muted-foreground">Timeline:</span>{" "}
                  <strong className="text-foreground">
                    {selectedFDP.startDate} - {selectedFDP.endDate}
                  </strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Capacity:</span>{" "}
                  <strong className="text-foreground">{selectedFDP.capacity} Seats</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Mode:</span>{" "}
                  <strong className="text-foreground">{selectedFDP.mode}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Certification:</span>{" "}
                  <strong className="text-emerald-600">AICTE / Joint Industry</strong>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-1.5">
                  Program Overview
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {selectedFDP.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-1.5">
                  Core Learning Outcomes
                </h4>
                <ul className="space-y-1.5 text-xs text-muted-foreground list-disc list-inside">
                  {selectedFDP.learningOutcomes.map((out, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {out}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <DialogFooter className="border-t border-border pt-3">
              <Button variant="outline" onClick={() => setSelectedFDP(null)}>
                Close
              </Button>
              {!selectedFDP.registered && (
                <Button
                  onClick={() => handleRegister(selectedFDP.id, selectedFDP.title)}
                  className="gap-1.5"
                >
                  <Sparkles className="size-4" /> Confirm Registration
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
