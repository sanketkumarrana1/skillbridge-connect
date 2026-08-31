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
  Eye,
  FileCheck,
  FileText,
  Filter,
  GraduationCap,
  MapPin,
  Search,
  Sparkles,
  UserCheck,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionCard, Stat, WorkspaceHeader } from "@/components/skillbridge/student-ui";
import { useAppState } from "@/context/app-state";
import { matchFacultyToOpportunity } from "@/utils/faculty-matching";
import type { FacultyInternship } from "@/types";

export function AcademicianInternships() {
  const { facultyInternships, applyFacultyInternship, facultyProfile } = useAppState();

  const [activeTab, setActiveTab] = useState<"marketplace" | "my-applications">("marketplace");
  const [searchQuery, setSearchQuery] = useState("");
  const [domainFilter, setDomainFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState("all");

  // Selected Opportunity Detail Modal
  const [selectedOpportunity, setSelectedOpportunity] = useState<FacultyInternship | null>(null);

  // Domains list for filter
  const domains = useMemo(() => {
    const set = new Set<string>();
    facultyInternships.forEach((item) => set.add(item.domain));
    return Array.from(set);
  }, [facultyInternships]);

  const filteredInternships = useMemo(() => {
    return facultyInternships
      .map((item) => {
        const match = matchFacultyToOpportunity(facultyProfile, {
          title: item.title,
          domain: item.domain,
          description: item.description,
          type: "Faculty Internship",
        });
        return { item, match };
      })
      .filter(({ item }) => {
        const matchesSearch =
          searchQuery.trim() === "" ||
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.domain.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDomain = domainFilter === "all" || item.domain === domainFilter;
        const matchesMode = modeFilter === "all" || item.mode === modeFilter;

        if (activeTab === "my-applications") {
          return matchesSearch && (item.registered || item.applicationStatus);
        }

        return matchesSearch && matchesDomain && matchesMode;
      });
  }, [facultyInternships, facultyProfile, searchQuery, domainFilter, modeFilter, activeTab]);

  const handleApply = (id: string, title: string) => {
    applyFacultyInternship(id);
    toast.success(`🎉 Application submitted for "${title}"!`);
    if (selectedOpportunity && selectedOpportunity.id === id) {
      setSelectedOpportunity((prev) =>
        prev ? { ...prev, registered: true, applicationStatus: "Under Review" } : null,
      );
    }
  };

  const myApplicationsCount = facultyInternships.filter(
    (i) => i.registered || i.applicationStatus,
  ).length;

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        eyebrow="Corporate & R&D Fellowships"
        title="Faculty Industry Internships"
        description="Immerse in corporate R&D laboratories, modern semiconductor tape-outs, and cloud engineering deployments to upgrade academic pedagogy."
      />

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Total Fellowships"
          value={facultyInternships.length.toString()}
          trend="Corporate programs"
          icon={Briefcase}
        />
        <Stat
          label="My Applications"
          value={myApplicationsCount.toString()}
          trend="Active submissions"
          icon={FileText}
        />
        <Stat
          label="Avg Honorarium"
          value="₹46,000 / mo"
          trend="Corporate sponsored"
          icon={Award}
        />
        <Stat
          label="Accepted Fellowships"
          value={facultyInternships
            .filter((i) => i.applicationStatus === "Accepted")
            .length.toString()}
          trend="Confirmed placements"
          icon={CheckCircle2}
        />
      </div>

      {/* Tab Controls & Filters */}
      <SectionCard
        title={
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as "marketplace" | "my-applications")}
            >
              <TabsList className="grid w-full grid-cols-2 sm:w-80">
                <TabsTrigger value="marketplace">
                  Explore Fellowships ({facultyInternships.length})
                </TabsTrigger>
                <TabsTrigger value="my-applications">
                  My Applications ({myApplicationsCount})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {activeTab === "marketplace" && (
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative w-48 sm:w-60">
                  <Search className="absolute left-2.5 top-2 size-3.5 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, org..."
                    className="pl-8 h-8 text-xs"
                  />
                </div>

                <select
                  value={domainFilter}
                  onChange={(e) => setDomainFilter(e.target.value)}
                  className="h-8 rounded-md border border-input bg-transparent px-2 text-xs shadow-xs"
                >
                  <option value="all">All Domains</option>
                  {domains.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>

                <select
                  value={modeFilter}
                  onChange={(e) => setModeFilter(e.target.value)}
                  className="h-8 rounded-md border border-input bg-transparent px-2 text-xs shadow-xs"
                >
                  <option value="all">All Modes</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>
            )}
          </div>
        }
      >
        {/* Cards Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-2">
          {filteredInternships.length === 0 ? (
            <div className="col-span-full py-12 text-center text-xs text-muted-foreground">
              No faculty internships match the current filter or application history.
            </div>
          ) : (
            filteredInternships.map(({ item: opp, match }) => {
              const isApplied = opp.registered || opp.applicationStatus;

              return (
                <Card
                  key={opp.id}
                  className="flex flex-col justify-between border border-border bg-card transition hover:border-primary/40 hover:shadow-md"
                >
                  <CardContent className="p-5 space-y-3.5 flex flex-col justify-between h-full">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <Badge
                            variant="outline"
                            className="text-[10px] text-primary border-primary/30"
                          >
                            {opp.domain}
                          </Badge>
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                            {match.matchScore}% Fit
                          </Badge>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            opp.applicationStatus === "Accepted"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]"
                              : opp.applicationStatus === "Under Review"
                                ? "bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px]"
                                : opp.mode === "Remote"
                                  ? "bg-purple-500/10 text-purple-600 border-purple-500/20 text-[10px]"
                                  : "text-[10px]"
                          }
                        >
                          {opp.applicationStatus || opp.mode}
                        </Badge>
                      </div>

                      <h3 className="font-display text-sm font-bold text-foreground line-clamp-2 leading-snug">
                        {opp.title}
                      </h3>

                      <p className="text-xs font-semibold text-muted-foreground">
                        {opp.organization}
                      </p>

                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                        {opp.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3 text-primary" /> {opp.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3 text-primary" /> {opp.duration}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase font-semibold text-muted-foreground">
                          Honorarium
                        </p>
                        <p className="text-xs font-bold text-emerald-600">
                          {opp.stipendOrHonorarium}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs"
                          onClick={() => setSelectedOpportunity(opp)}
                        >
                          Details
                        </Button>
                        {isApplied ? (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 text-xs text-muted-foreground cursor-default"
                          >
                            <Check className="size-3.5 mr-1 text-emerald-600" /> Applied
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => handleApply(opp.id, opp.title)}
                          >
                            Apply Now
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

      {/* Detail Dialog */}
      <Dialog
        open={!!selectedOpportunity}
        onOpenChange={(open) => !open && setSelectedOpportunity(null)}
      >
        {selectedOpportunity && (
          <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-primary text-[10px]">
                  {selectedOpportunity.domain}
                </Badge>
                <Badge variant="secondary" className="text-[10px]">
                  {selectedOpportunity.mode}
                </Badge>
              </div>
              <DialogTitle className="text-lg font-bold font-display text-foreground">
                {selectedOpportunity.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {selectedOpportunity.organization} • {selectedOpportunity.industry}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3 p-3 bg-muted/30 rounded-xl border border-border text-xs">
                <div>
                  <span className="text-muted-foreground">Location:</span>{" "}
                  <strong className="text-foreground">{selectedOpportunity.location}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Duration:</span>{" "}
                  <strong className="text-foreground">{selectedOpportunity.duration}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Honorarium:</span>{" "}
                  <strong className="text-emerald-600">
                    {selectedOpportunity.stipendOrHonorarium}
                  </strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Deadline:</span>{" "}
                  <strong className="text-foreground">{selectedOpportunity.deadline}</strong>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-1.5">
                  Overview
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {selectedOpportunity.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-1.5">
                  Key Deliverables & Objectives
                </h4>
                <ul className="space-y-1 text-xs text-muted-foreground list-disc list-inside">
                  {selectedOpportunity.objectives.map((obj, i) => (
                    <li key={i} className="leading-relaxed">
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
                  Eligibility
                </h4>
                <p className="text-xs text-muted-foreground">{selectedOpportunity.eligibility}</p>
              </div>
            </div>

            <DialogFooter className="border-t border-border pt-3">
              <Button variant="outline" onClick={() => setSelectedOpportunity(null)}>
                Close
              </Button>
              {selectedOpportunity.registered || selectedOpportunity.applicationStatus ? (
                <Button variant="secondary" disabled className="gap-1.5">
                  <Check className="size-4 text-emerald-600" /> Application Active
                </Button>
              ) : (
                <Button
                  onClick={() => handleApply(selectedOpportunity.id, selectedOpportunity.title)}
                  className="gap-1.5"
                >
                  <Sparkles className="size-4" /> Submit Application
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
