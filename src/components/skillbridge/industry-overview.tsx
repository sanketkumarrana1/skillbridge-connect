import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bell,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Edit2,
  FileCheck,
  FileText,
  GraduationCap,
  Layers,
  MapPin,
  Plus,
  Radio,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserPlus,
  Users,
  XCircle,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SkillTag } from "@/components/skillbridge/primitives";
import { CandidateDetailsModal } from "@/components/skillbridge/industry-candidate-modal";
import { SectionCard, Stat, WorkspaceHeader } from "@/components/skillbridge/student-ui";
import { useAppState } from "@/context/app-state";
import type { Candidate, CompanyVerificationStatus } from "@/types";

export function IndustryOverview() {
  const {
    companyProfile,
    updateCompanyProfile,
    setCompanyVerificationStatus,
    opportunities,
    industryApps,
    candidates,
    shortlistCandidate,
    recruiterNotifications,
    markRecruiterNotificationRead,
    recruiterKPIs,
  } = useAppState();

  const [editCompanyModal, setEditCompanyModal] = useState(false);
  const [compName, setCompName] = useState(companyProfile.name);
  const [compIndustry, setCompIndustry] = useState(companyProfile.industry);
  const [compLocation, setCompLocation] = useState(companyProfile.location);
  const [compDesc, setCompDesc] = useState(companyProfile.description);
  const [compWebsite, setCompWebsite] = useState(companyProfile.website || "");
  const [compSize, setCompSize] = useState(companyProfile.companySize || "1,000 - 5,000 Employees");
  const [compYear, setCompYear] = useState(companyProfile.foundedYear || "2014");

  // Candidate Dossier Modal State
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [dossierOpen, setDossierOpen] = useState(false);

  const topCandidates = candidates
    .slice()
    .sort((a, b) => (b.match ?? 0) - (a.match ?? 0))
    .slice(0, 4);

  const recentApplications = industryApps.slice(0, 5);

  const unreadNotifsCount = recruiterNotifications.filter((n) => !n.read).length;

  const handleSaveCompany = () => {
    updateCompanyProfile({
      name: compName.trim() || companyProfile.name,
      industry: compIndustry.trim() || companyProfile.industry,
      location: compLocation.trim() || companyProfile.location,
      description: compDesc.trim() || companyProfile.description,
      website: compWebsite.trim() || companyProfile.website,
      companySize: compSize.trim() || companyProfile.companySize,
      foundedYear: compYear.trim() || companyProfile.foundedYear,
    });
    setEditCompanyModal(false);
    toast.success("Company profile updated successfully");
  };

  const handleVerificationChange = (status: CompanyVerificationStatus) => {
    setCompanyVerificationStatus(status);
    toast.success(`Company verification status switched to: ${status} (Demo Mode)`);
  };

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        eyebrow="Industry Portal"
        title="Recruiter Overview & Talent Command"
        description="Real-time candidate telemetry, applicant pipelines, and AI match intelligence directly connected to campus talent."
        action={
          <div className="flex flex-wrap items-center gap-2">
            {/* Notification Bell Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="relative gap-1.5">
                  <Bell className="size-3.5" />
                  <span>Activity</span>
                  {unreadNotifsCount > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                      {unreadNotifsCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-2">
                <DropdownMenuLabel className="text-xs font-bold font-display flex items-center justify-between">
                  <span>Recruitment Events</span>
                  <span className="text-[10px] font-normal text-muted-foreground">Live Telemetry</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-72 overflow-y-auto space-y-1.5 py-1">
                  {recruiterNotifications.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">No recent activity</p>
                  ) : (
                    recruiterNotifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markRecruiterNotificationRead(n.id)}
                        className={`rounded-lg p-2.5 text-xs transition cursor-pointer ${
                          n.read ? "bg-muted/30 opacity-75" : "bg-primary/10 border border-primary/20"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <p className="font-semibold text-foreground">{n.title}</p>
                          <span className="text-[10px] text-muted-foreground">{n.timestamp}</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed text-[11px]">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

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
                setCompSize(companyProfile.companySize || "1,000 - 5,000 Employees");
                setCompYear(companyProfile.foundedYear || "2014");
                setEditCompanyModal(true);
              }}
            >
              <Edit2 className="size-3.5" /> Edit Profile
            </Button>
            <Button asChild size="sm" className="gap-1.5">
              <Link to="/industry/post">
                <Plus className="size-3.5" /> Post Opportunity
              </Link>
            </Button>
          </div>
        }
      />

      {/* 6 Real-Time Recruiter KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Stat
          label="Active Postings"
          value={recruiterKPIs.activeOpportunities.toString()}
          trend="Active Roles"
          icon={Briefcase}
        />
        <Stat
          label="Applicants"
          value={recruiterKPIs.totalApplicants.toString()}
          trend="Campus Pipeline"
          icon={Users}
        />
        <Stat
          label="Shortlisted"
          value={recruiterKPIs.shortlistedCount.toString()}
          trend={`${recruiterKPIs.shortlistRate}% Rate`}
          icon={UserCheck}
        />
        <Stat
          label="Interviews"
          value={recruiterKPIs.interviewsCount.toString()}
          trend={`${recruiterKPIs.interviewConversion}% Rate`}
          icon={Calendar}
        />
        <Stat
          label="Offers Sent"
          value={recruiterKPIs.offersCount.toString()}
          trend={`${recruiterKPIs.offerConversion}% Rate`}
          icon={FileCheck}
        />
        <Stat
          label="Hired"
          value={recruiterKPIs.hiresCount.toString()}
          trend={`${recruiterKPIs.hiringConversion}% Rate`}
          icon={CheckCircle2}
        />
      </div>

      {/* Company Profile Hero Banner with Controlled Verification Switcher */}
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

                  {/* Verification Badge with Demo Switcher */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="cursor-pointer">
                        {companyProfile.verificationStatus === "Verified" ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs gap-1 hover:bg-emerald-500/20">
                            <ShieldCheck className="size-3" /> Verified Enterprise
                          </Badge>
                        ) : companyProfile.verificationStatus === "Pending" ? (
                          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs gap-1 hover:bg-amber-500/20">
                            <Clock className="size-3" /> Verification Pending
                          </Badge>
                        ) : (
                          <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/20 text-xs gap-1 hover:bg-rose-500/20">
                            <XCircle className="size-3" /> Unverified / Rejected
                          </Badge>
                        )}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <DropdownMenuLabel className="text-xs">Demo: Switch Verification State</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleVerificationChange("Verified")}>
                        <ShieldCheck className="size-3.5 mr-2 text-emerald-600" /> Verified Enterprise
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleVerificationChange("Pending")}>
                        <Clock className="size-3.5 mr-2 text-amber-600" /> Verification Pending
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleVerificationChange("Rejected")}>
                        <XCircle className="size-3.5 mr-2 text-rose-600" /> Rejected / Unverified
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-xs text-muted-foreground">{companyProfile.industry}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3 text-primary" /> {companyProfile.location}
                  </span>
                  {companyProfile.companySize && (
                    <span className="flex items-center gap-1">
                      <Users className="size-3 text-muted-foreground" /> {companyProfile.companySize}
                    </span>
                  )}
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
                  <Sparkles className="size-3.5 mr-1.5 text-primary" /> Candidate Explorer
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/industry/applications">
                  <FileText className="size-3.5 mr-1.5" /> Applications Inbox ({recruiterKPIs.totalApplicants})
                </Link>
              </Button>
            </div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground leading-relaxed border-t border-border pt-3">
            {companyProfile.description}
          </p>
        </CardContent>
      </Card>

      {/* Visual 7-Stage Recruitment Pipeline Summary Bar */}
      <Card className="border-border/80 bg-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="size-4 text-primary" />
            <h3 className="font-display text-sm font-semibold text-foreground">Live Recruitment Pipeline</h3>
          </div>
          <Link to="/industry/applications" className="text-xs text-primary hover:underline flex items-center gap-1">
            Open Full Inbox <ChevronRight className="size-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {[
            { label: "Applied", count: recruiterKPIs.underReviewCount, color: "border-slate-500/30 bg-slate-500/5 text-slate-400" },
            { label: "Shortlisted", count: recruiterKPIs.shortlistedCount, color: "border-emerald-500/30 bg-emerald-500/5 text-emerald-400" },
            { label: "Assessment", count: recruiterKPIs.assessmentCount, color: "border-amber-500/30 bg-amber-500/5 text-amber-400" },
            { label: "Interviews", count: recruiterKPIs.interviewsCount, color: "border-blue-500/30 bg-blue-500/5 text-blue-400" },
            { label: "Offers", count: recruiterKPIs.offersCount, color: "border-indigo-500/30 bg-indigo-500/5 text-indigo-400" },
            { label: "Hired", count: recruiterKPIs.hiresCount, color: "border-purple-500/30 bg-purple-500/5 text-purple-400" },
            { label: "Rejected", count: recruiterKPIs.rejectedCount, color: "border-rose-500/30 bg-rose-500/5 text-rose-400" },
          ].map((stage) => (
            <Link
              key={stage.label}
              to="/industry/applications"
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition hover:scale-[1.02] ${stage.color}`}
            >
              <span className="text-xl font-bold font-display">{stage.count}</span>
              <span className="text-[11px] font-medium mt-0.5">{stage.label}</span>
            </Link>
          ))}
        </div>
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
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border/80 bg-card p-4 transition hover:border-primary/40 hover:shadow-xs cursor-pointer"
                    onClick={() => {
                      setSelectedCandidate(cand);
                      setDossierOpen(true);
                    }}
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

                    <div
                      className="flex items-center justify-between sm:flex-col sm:items-end gap-2 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="font-display text-sm font-bold text-emerald-600">
                        {match}% Match
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => {
                            setSelectedCandidate(cand);
                            setDossierOpen(true);
                          }}
                        >
                          Dossier
                        </Button>
                        <Button
                          size="sm"
                          variant={cand.shortlisted ? "secondary" : "default"}
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
                <div
                  key={app.id}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-muted/20 px-2 rounded-lg transition cursor-pointer"
                  onClick={() => {
                    const matchCand = candidates.find(
                      (c) =>
                        c.name.toLowerCase() === app.candidate?.toLowerCase() ||
                        c.id === app.candidate ||
                        c.id === app.id,
                    );
                    if (matchCand) {
                      setSelectedCandidate(matchCand);
                      setDossierOpen(true);
                    }
                  }}
                >
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
                        : app.status === "Interview Scheduled" || app.status === "Interview"
                          ? "bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px]"
                          : app.status === "Offered"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]"
                            : app.status === "Hired"
                              ? "bg-purple-500/10 text-purple-600 border-purple-500/20 text-[10px]"
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
              Update your corporate identity, location, and enterprise specifications.
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
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Company Size</Label>
                <Input value={compSize} onChange={(e) => setCompSize(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Founded Year</Label>
                <Input value={compYear} onChange={(e) => setCompYear(e.target.value)} />
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

      {/* Candidate Evaluation Dossier Modal */}
      {selectedCandidate && (
        <CandidateDetailsModal
          candidate={selectedCandidate}
          open={dossierOpen}
          onOpenChange={setDossierOpen}
        />
      )}
    </div>
  );
}
