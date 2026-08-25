import { useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck,
  FileText,
  IndianRupee,
  MapPin,
  Microscope,
  Plus,
  Search,
  Send,
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionCard, Stat, WorkspaceHeader } from "@/components/skillbridge/student-ui";
import { useAppState } from "@/context/app-state";
import type { ResearchProject } from "@/types";

export function AcademicianResearch() {
  const { researchProjects, applyResearchProject } = useAppState();

  const [activeTab, setActiveTab] = useState<"grants" | "active">("grants");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<ResearchProject | null>(null);

  // Application Modal
  const [applyModal, setApplyModal] = useState<ResearchProject | null>(null);
  const [coPIName, setCoPIName] = useState("");
  const [studentSlots, setStudentSlots] = useState("3");
  const [researchSummary, setResearchSummary] = useState("");

  const handleApply = (id: string, title: string) => {
    applyResearchProject(id);
    setApplyModal(null);
    setCoPIName("");
    setResearchSummary("");
    toast.success(`🎉 Joint R&D grant application submitted for "${title}"!`);
  };

  const filtered = useMemo(() => {
    return researchProjects.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.domain.toLowerCase().includes(searchQuery.toLowerCase());

      if (activeTab === "active") {
        return matchesSearch && (item.applied || item.participationStatus === "In Progress");
      }

      return matchesSearch;
    });
  }, [researchProjects, searchQuery, activeTab]);

  const activeCount = researchProjects.filter(
    (r) => r.applied || r.participationStatus === "In Progress",
  ).length;

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        eyebrow="Funded Industry-Academia R&D"
        title="Collaborative Research Initiatives"
        description="Co-author high-impact research, secure government & corporate grants, and mentor graduate research fellows with global laboratories."
      />

      {/* KPI Ribbon */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Total R&D Grants"
          value={researchProjects.length.toString()}
          trend="Funded consortia"
          icon={Microscope}
        />
        <Stat
          label="Active Joint Projects"
          value={activeCount.toString()}
          trend="Ongoing investigations"
          icon={Briefcase}
        />
        <Stat
          label="Total Funding Pool"
          value="₹1.19 Crore"
          trend="DRDO, CSIR, ICMR, DoT"
          icon={IndianRupee}
        />
        <Stat
          label="Student Fellowships"
          value="12 Positions"
          trend="Funded PhD & PG slots"
          icon={Users}
        />
      </div>

      {/* Main Tabs & Directory */}
      <SectionCard
        title={
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "grants" | "active")}>
              <TabsList className="grid w-full grid-cols-2 sm:w-80">
                <TabsTrigger value="grants">
                  Available Grants ({researchProjects.length})
                </TabsTrigger>
                <TabsTrigger value="active">Active Projects ({activeCount})</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative w-48 sm:w-64">
              <Search className="absolute left-2.5 top-2 size-3.5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search grant, domain..."
                className="pl-8 h-8 text-xs"
              />
            </div>
          </div>
        }
      >
        <div className="grid gap-5 md:grid-cols-2 pt-2">
          {filtered.length === 0 ? (
            <div className="col-span-full py-12 text-center text-xs text-muted-foreground">
              No research projects match your filter.
            </div>
          ) : (
            filtered.map((proj) => {
              const isInProgress = proj.applied || proj.participationStatus === "In Progress";

              return (
                <Card
                  key={proj.id}
                  className="flex flex-col justify-between border border-border bg-card transition hover:border-primary/40 hover:shadow-md"
                >
                  <CardContent className="p-5 space-y-4 flex flex-col justify-between h-full">
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <Badge
                          variant="outline"
                          className="text-[10px] text-primary border-primary/30"
                        >
                          {proj.domain}
                        </Badge>
                        <Badge
                          variant={isInProgress ? "default" : "secondary"}
                          className={
                            isInProgress
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]"
                              : "text-[10px]"
                          }
                        >
                          {isInProgress ? "In Progress" : "Accepting Proposals"}
                        </Badge>
                      </div>

                      <h3 className="font-display text-base font-bold text-foreground line-clamp-2 leading-snug">
                        {proj.title}
                      </h3>

                      <p className="text-xs font-semibold text-primary">{proj.organization}</p>

                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                        {proj.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3 text-primary" /> {proj.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3 text-primary" /> Deadline: {proj.deadline}
                        </span>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-border flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase font-semibold text-muted-foreground">
                          R&D Grant Value
                        </p>
                        <p className="text-sm font-bold text-emerald-600">{proj.funding}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs"
                          onClick={() => setSelectedProject(proj)}
                        >
                          Outcomes
                        </Button>

                        {isInProgress ? (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 text-xs text-muted-foreground cursor-default"
                          >
                            <Check className="size-3.5 mr-1 text-emerald-600" /> Active R&D
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => {
                              setApplyModal(proj);
                              setResearchSummary(
                                "Establish university testbed and co-publish research in top IEEE/ACM journals.",
                              );
                            }}
                          >
                            Apply as PI / Co-PI
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </SectionCard>

      {/* Research Outcomes Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
        {selectedProject && (
          <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-primary text-[10px]">
                  {selectedProject.domain}
                </Badge>
              </div>
              <DialogTitle className="text-lg font-bold font-display text-foreground">
                {selectedProject.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Sponsored by {selectedProject.organization} • Grant: {selectedProject.funding}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-1.5">
                  Scope of Investigation
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-1.5">
                  Expected Research Outcomes
                </h4>
                <ul className="space-y-1.5 text-xs text-muted-foreground list-disc list-inside">
                  {selectedProject.keyOutcomes.map((out, i) => (
                    <li key={i} className="leading-relaxed">
                      {out}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-muted/30 rounded-xl border border-border text-xs">
                <div>
                  <span className="text-muted-foreground">Timeline:</span>{" "}
                  <strong className="text-foreground">{selectedProject.duration}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Application Deadline:</span>{" "}
                  <strong className="text-foreground">{selectedProject.deadline}</strong>
                </div>
              </div>
            </div>

            <DialogFooter className="border-t border-border pt-3">
              <Button variant="outline" onClick={() => setSelectedProject(null)}>
                Close
              </Button>
              {!selectedProject.applied && (
                <Button
                  onClick={() => {
                    setSelectedProject(null);
                    setApplyModal(selectedProject);
                    setResearchSummary(
                      "Establish university testbed and co-publish research in top IEEE/ACM journals.",
                    );
                  }}
                  className="gap-1.5"
                >
                  <Sparkles className="size-4" /> Apply for Grant
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Grant Application Modal */}
      <Dialog open={!!applyModal} onOpenChange={(open) => !open && setApplyModal(null)}>
        {applyModal && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Apply for R&D Collaboration Grant</DialogTitle>
              <DialogDescription>
                Submit proposal for <strong className="text-foreground">{applyModal.title}</strong>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label>Co-Principal Investigator</Label>
                  <Input
                    value={coPIName}
                    onChange={(e) => setCoPIName(e.target.value)}
                    placeholder="e.g. Dr. A. Sharma"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Student Research Slots</Label>
                  <Input
                    type="number"
                    value={studentSlots}
                    onChange={(e) => setStudentSlots(e.target.value)}
                    placeholder="3"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Research Plan & Lab Facility Access</Label>
                <Textarea
                  rows={4}
                  value={researchSummary}
                  onChange={(e) => setResearchSummary(e.target.value)}
                  placeholder="Describe your lab equipment, PhD students available, and expected publication timeline..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setApplyModal(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => handleApply(applyModal.id, applyModal.title)}
                className="gap-1.5"
              >
                <Send className="size-3.5" /> Submit Grant Application
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
