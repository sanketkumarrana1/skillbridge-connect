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
  DollarSign,
  ExternalLink,
  FileCheck,
  FileText,
  IndianRupee,
  MapPin,
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
import type { ConsultancyProject } from "@/types";

export function AcademicianConsultancy() {
  const { consultancyProjects, applyConsultancy } = useAppState();

  const [activeTab, setActiveTab] = useState<"opportunities" | "active">("opportunities");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<ConsultancyProject | null>(null);

  // Proposal modal state
  const [proposalModal, setProposalModal] = useState<ConsultancyProject | null>(null);
  const [methodology, setMethodology] = useState("");
  const [timeline, setTimeline] = useState("");

  const handleApply = (id: string, title: string) => {
    applyConsultancy(id);
    setProposalModal(null);
    setMethodology("");
    setTimeline("");
    toast.success(`🎉 Consultancy proposal submitted for "${title}"!`);
  };

  const filtered = useMemo(() => {
    return consultancyProjects.filter((item) => {
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
  }, [consultancyProjects, searchQuery, activeTab]);

  const activeCount = consultancyProjects.filter(
    (c) => c.applied || c.participationStatus === "In Progress",
  ).length;

  const totalFunding = consultancyProjects
    .map((c) => parseInt(c.funding.replace(/[^0-9]/g, ""), 10) || 0)
    .reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        eyebrow="Industrial Problem Solving"
        title="Industrial Consultancy Engagements"
        description="Solve high-impact enterprise engineering and digital transformation challenges with funded industry grants."
      />

      {/* KPI Ribbon */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Total Problem Statements"
          value={consultancyProjects.length.toString()}
          trend="Industry RFPs"
          icon={Building2}
        />
        <Stat
          label="Active Engagements"
          value={activeCount.toString()}
          trend="In Progress"
          icon={Briefcase}
        />
        <Stat
          label="Total Grant Pool"
          value="₹39,00,000"
          trend="Corporate funded"
          icon={IndianRupee}
        />
        <Stat
          label="Partner Enterprises"
          value="BHEL, Siemens, NIC"
          trend="Public & Private"
          icon={Award}
        />
      </div>

      {/* Main Tabs & Directory */}
      <SectionCard
        title={
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as "opportunities" | "active")}
            >
              <TabsList className="grid w-full grid-cols-2 sm:w-80">
                <TabsTrigger value="opportunities">
                  All Projects ({consultancyProjects.length})
                </TabsTrigger>
                <TabsTrigger value="active">My Engagements ({activeCount})</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative w-48 sm:w-64">
              <Search className="absolute left-2.5 top-2 size-3.5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search RFP, company..."
                className="pl-8 h-8 text-xs"
              />
            </div>
          </div>
        }
      >
        <div className="grid gap-5 md:grid-cols-2 pt-2">
          {filtered.length === 0 ? (
            <div className="col-span-full py-12 text-center text-xs text-muted-foreground">
              No consultancy projects match your filter.
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
                          {isInProgress ? "In Progress" : "Open for Bid"}
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
                          Consultancy Grant
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
                          Deliverables
                        </Button>

                        {isInProgress ? (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 text-xs text-muted-foreground cursor-default"
                          >
                            <Check className="size-3.5 mr-1 text-emerald-600" /> Active Lead
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => {
                              setProposalModal(proj);
                              setTimeline(proj.duration);
                              setMethodology(
                                "Propose mathematical modelling, experimental testbench validation, and milestone deliverables.",
                              );
                            }}
                          >
                            Submit Proposal
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

      {/* Deliverables Dialog */}
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
                Issued by {selectedProject.organization} • Grant: {selectedProject.funding}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-1.5">
                  Problem Statement
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-1.5">
                  Required Deliverables
                </h4>
                <ul className="space-y-1.5 text-xs text-muted-foreground list-disc list-inside">
                  {selectedProject.deliverables.map((del, i) => (
                    <li key={i} className="leading-relaxed">
                      {del}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-muted/30 rounded-xl border border-border text-xs">
                <div>
                  <span className="text-muted-foreground">Engagement:</span>{" "}
                  <strong className="text-foreground">{selectedProject.duration}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Proposal Deadline:</span>{" "}
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
                    setProposalModal(selectedProject);
                    setTimeline(selectedProject.duration);
                    setMethodology("Propose mathematical modelling and milestone deliverables.");
                  }}
                  className="gap-1.5"
                >
                  <Sparkles className="size-4" /> Submit Proposal
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Proposal Submission Modal */}
      <Dialog open={!!proposalModal} onOpenChange={(open) => !open && setProposalModal(null)}>
        {proposalModal && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Submit Consultancy Proposal</DialogTitle>
              <DialogDescription>
                Submit your research approach for{" "}
                <strong className="text-foreground">{proposalModal.title}</strong>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="grid gap-2">
                <Label>Proposed Methodology & Technical Architecture</Label>
                <Textarea
                  rows={4}
                  value={methodology}
                  onChange={(e) => setMethodology(e.target.value)}
                  placeholder="Outline key algorithmic strategies, lab instruments to be used, and milestone timelines..."
                />
              </div>
              <div className="grid gap-2">
                <Label>Estimated Project Duration</Label>
                <Input value={timeline} onChange={(e) => setTimeline(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setProposalModal(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => handleApply(proposalModal.id, proposalModal.title)}
                className="gap-1.5"
              >
                <Send className="size-3.5" /> Submit Proposal
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
