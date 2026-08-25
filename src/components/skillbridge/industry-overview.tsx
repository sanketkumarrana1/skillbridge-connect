import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Award,
  BarChart3,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Edit2,
  Eye,
  FileCheck,
  FileText,
  GraduationCap,
  IndianRupee,
  MapPin,
  Plus,
  Radio,
  Search,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { SkillTag } from "@/components/skillbridge/primitives";
import { SectionCard, Stat, WorkspaceHeader } from "@/components/skillbridge/student-ui";
import { useAppState } from "@/context/app-state";

export function IndustryOverview() {
  const {
    companyProfile,
    updateCompanyProfile,
    internships,
    jobs,
    industryApps,
    candidates,
    shortlistCandidate,
  } = useAppState();

  const [editCompanyModal, setEditCompanyModal] = useState(false);
  const [compName, setCompName] = useState(companyProfile.name);
  const [compIndustry, setCompIndustry] = useState(companyProfile.industry);
  const [compLocation, setCompLocation] = useState(companyProfile.location);
  const [compDesc, setCompDesc] = useState(companyProfile.description);
  const [compWebsite, setCompWebsite] = useState(companyProfile.website || "");

  // Calculated Real-time KPIs
  const activeJobsCount = jobs.filter((j) => j.status !== "Draft").length;
  const activeInternshipsCount = internships.filter((i) => i.status !== "Draft").length;
  const totalApplicantsCount = industryApps.length;
  const shortlistedCount = industryApps.filter((a) => a.status === "Shortlisted").length;
  const interviewsCount = industryApps.filter((a) => a.status === "Interview").length;
  const hiresCount = industryApps.filter((a) => a.status === "Selected").length;

  const topCandidates = candidates
    .slice()
    .sort((a, b) => (b.match ?? 0) - (a.match ?? 0))
    .slice(0, 4);

  const recentApplications = industryApps.slice(0, 5);

  const handleSaveCompany = () => {
    updateCompanyProfile({
      name: compName.trim() || companyProfile.name,
      industry: compIndustry.trim() || companyProfile.industry,
      location: compLocation.trim() || companyProfile.location,
      description: compDesc.trim() || companyProfile.description,
      website: compWebsite.trim() || companyProfile.website,
    });
    setEditCompanyModal(false);
    toast.success("Company profile updated successfully");
  };

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        eyebrow="Industry Portal"
        title="Company Overview"
        description="A real-time snapshot of your recruitment pipeline, active listings, and high-match campus talent."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                setCompName(companyProfile.name);
                setCompIndustry(companyProfile.industry);
                setCompLocation(companyProfile.location);
                setCompDesc(companyProfile.description);
                setCompWebsite(companyProfile.website || "");
                setEditCompanyModal(true);
              }}
            >
              <Edit2 className="size-3.5" /> Edit Company
            </Button>
            <Button asChild size="sm" className="gap-1.5">
              <Link to="/industry/post">
                <Plus className="size-3.5" /> Post Opportunity
              </Link>
            </Button>
          </div>
        }
      />

      {/* 6 Real-Time KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Stat
          label="Active Jobs"
          value={activeJobsCount.toString()}
          trend={`${jobs.length} total postings`}
          icon={Briefcase}
        />
        <Stat
          label="Active Internships"
          value={activeInternshipsCount.toString()}
          trend={`${internships.length} total offerings`}
          icon={Building2}
        />
        <Stat
          label="Total Applicants"
          value={totalApplicantsCount.toString()}
          trend="Live submissions"
          icon={Users}
        />
        <Stat
          label="Shortlisted"
          value={shortlistedCount.toString()}
          trend="High fit pool"
          icon={UserCheck}
        />
        <Stat
          label="Interviews"
          value={interviewsCount.toString()}
          trend="In schedule"
          icon={Calendar}
        />
        <Stat
          label="Hires / Selected"
          value={hiresCount.toString()}
          trend="Offers made"
          icon={CheckCircle2}
        />
      </div>

      {/* Company Bio & Highlights Strip */}
      <Card className="overflow-hidden border-border/80 bg-gradient-to-r from-primary/10 via-card to-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground font-bold text-xl shadow-md">
                {companyProfile.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold font-display text-foreground">
                    {companyProfile.name}
                  </h2>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
                    Verified Enterprise
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{companyProfile.industry}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3 text-primary" /> {companyProfile.location}
                  </span>
                  {companyProfile.website && (
                    <span className="flex items-center gap-1">
                      <Radio className="size-3 text-emerald-600" /> {companyProfile.website}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/industry/candidates">
                  <Sparkles className="size-3.5 mr-1.5 text-primary" /> AI Match Explorer
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/industry/applications">
                  <FileText className="size-3.5 mr-1.5" /> Review Applicants ({totalApplicantsCount}
                  )
                </Link>
              </Button>
            </div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground leading-relaxed border-t border-border pt-3">
            {companyProfile.description}
          </p>
        </CardContent>
      </Card>

      {/* Grid: Top AI Matches + Recent Applications */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Top Matched Candidates */}
        <div className="lg:col-span-7">
          <SectionCard
            title={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-5 text-primary" />
                  <h3 className="font-display text-base font-semibold">
                    Top AI Matched Candidates
                  </h3>
                </div>
                <Button asChild variant="ghost" size="sm" className="text-xs gap-1">
                  <Link to="/industry/candidates">
                    View all <ChevronRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            }
          >
            <div className="space-y-3 pt-2">
              {topCandidates.map((cand) => {
                const match = cand.match ?? 85;
                return (
                  <div
                    key={cand.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border/80 bg-card p-4 transition hover:border-primary/40 hover:shadow-xs"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="size-11 border border-border">
                        {cand.avatar ? <AvatarImage src={cand.avatar} /> : null}
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                          {cand.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-foreground">{cand.name}</h4>
                          {cand.shortlisted && (
                            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                              Shortlisted
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {cand.college} • {cand.branch}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {cand.skills.slice(0, 4).map((s) => (
                            <SkillTag key={s} muted>
                              {s}
                            </SkillTag>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 shrink-0">
                      <span className="font-display text-sm font-bold text-emerald-600">
                        {match}% Match
                      </span>
                      <Button
                        size="sm"
                        variant={cand.shortlisted ? "outline" : "default"}
                        className="h-7 text-xs"
                        onClick={() => {
                          shortlistCandidate(cand.id);
                          toast.success(`Candidate ${cand.name} shortlisted`);
                        }}
                      >
                        {cand.shortlisted ? "Shortlisted" : "Shortlist"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>

        {/* Recent Applications Feed */}
        <div className="lg:col-span-5">
          <SectionCard
            title={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="size-5 text-primary" />
                  <h3 className="font-display text-base font-semibold">Recent Applications</h3>
                </div>
                <Button asChild variant="ghost" size="sm" className="text-xs gap-1">
                  <Link to="/industry/applications">
                    Pipeline <ChevronRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            }
          >
            <div className="divide-y divide-border pt-1">
              {recentApplications.map((app) => (
                <div key={app.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {app.candidate || "Student Applicant"}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">{app.internship}</p>
                    <p className="text-[10px] text-muted-foreground">{app.appliedDate}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      app.status === "Shortlisted"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]"
                        : app.status === "Interview"
                          ? "bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px]"
                          : "text-muted-foreground text-[10px]"
                    }
                  >
                    {app.status}
                  </Badge>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Edit Company Profile Modal */}
      <Dialog open={editCompanyModal} onOpenChange={setEditCompanyModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Company Profile</DialogTitle>
            <DialogDescription>
              Update your enterprise information and branding description.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid gap-2">
              <Label>Company Name</Label>
              <Input value={compName} onChange={(e) => setCompName(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Industry Sector</Label>
                <Input value={compIndustry} onChange={(e) => setCompIndustry(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Headquarters / Location</Label>
                <Input value={compLocation} onChange={(e) => setCompLocation(e.target.value)} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Website URL</Label>
              <Input value={compWebsite} onChange={(e) => setCompWebsite(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Company Description</Label>
              <Textarea rows={3} value={compDesc} onChange={(e) => setCompDesc(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCompanyModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCompany}>Save Company Profile</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
