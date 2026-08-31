import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Edit2,
  ExternalLink,
  FileText,
  Globe,
  GraduationCap,
  Layers,
  LineChart,
  Link as LinkIcon,
  MessageSquare,
  Plus,
  Radio,
  Search,
  Sparkles,
  Trash2,
  TrendingUp,
  UserCheck,
  Users,
  Video,
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
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { SkillTag } from "@/components/skillbridge/primitives";
import { SectionCard, Stat, WorkspaceHeader } from "@/components/skillbridge/student-ui";
import { useAppState } from "@/context/app-state";
import { matchFacultyToOpportunity } from "@/utils/faculty-matching";

export function AcademicianOverview() {
  const {
    facultyProfile,
    updateFacultyProfile,
    addFacultyPublication,
    removeFacultyPublication,
    addFacultyExpertise,
    removeFacultyExpertise,
    addFacultyResearchInterest,
    removeFacultyResearchInterest,
    facultyInternships,
    facultyTrainings,
    facultyFDPs,
    consultancyProjects,
    researchProjects,
    guestLectures,
    studentMentorships,
    collaborations,
    opportunities,
  } = useAppState();

  // Profile Edit Modals
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [name, setName] = useState(facultyProfile.name);
  const [institution, setInstitution] = useState(facultyProfile.institution);
  const [department, setDepartment] = useState(facultyProfile.department);
  const [designation, setDesignation] = useState(facultyProfile.designation);
  const [industryExp, setIndustryExp] = useState(facultyProfile.industryExperience);
  const [yearsExp, setYearsExp] = useState(String(facultyProfile.yearsOfExperience));
  const [googleScholar, setGoogleScholar] = useState(facultyProfile.links.googleScholar || "");
  const [linkedIn, setLinkedIn] = useState(facultyProfile.links.linkedIn || "");
  const [orcid, setOrcid] = useState(facultyProfile.links.orcid || "");

  // Tag Manager Modal
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [newExpertise, setNewExpertise] = useState("");
  const [newResearch, setNewResearch] = useState("");

  // Publication Modal
  const [pubModalOpen, setPubModalOpen] = useState(false);
  const [pubTitle, setPubTitle] = useState("");
  const [pubVenue, setPubVenue] = useState("");
  const [pubYear, setPubYear] = useState("2026");
  const [pubDoi, setPubDoi] = useState("");

  // KPI Calculations
  const activeInternshipsCount = facultyInternships.filter(
    (i) => i.registered || i.applicationStatus === "Accepted" || i.applicationStatus === "Under Review",
  ).length;
  const activeTrainingCount = facultyTrainings.filter((t) => t.registered).length;
  const fdpEnrollmentsCount = facultyFDPs.filter((f) => f.registered).length;
  const activeConsultancyCount = consultancyProjects.filter(
    (c) => c.applied || c.participationStatus === "In Progress",
  ).length;
  const activeResearchCount = researchProjects.filter(
    (r) => r.applied || r.participationStatus === "In Progress",
  ).length;
  const mentorshipSessionsCount = studentMentorships.filter((m) => m.status === "Active").length;
  const activeCollabsCount = collaborations.filter((c) => c.status === "Active").length;

  // Compute Live AI Opportunity Matches for Faculty
  const facultyOpportunityMatches = opportunities.map((opp) => {
    const match = matchFacultyToOpportunity(facultyProfile, {
      title: opp.title,
      requiredSkills: opp.requiredSkills,
      domain: opp.domain,
      description: opp.description,
      type: opp.type,
    });
    return { opportunity: opp, match };
  }).sort((a, b) => b.match.matchScore - a.match.matchScore).slice(0, 3);

  const handleSaveProfile = () => {
    updateFacultyProfile({
      name: name.trim() || facultyProfile.name,
      institution: institution.trim() || facultyProfile.institution,
      department: department.trim() || facultyProfile.department,
      designation: designation.trim() || facultyProfile.designation,
      industryExperience: industryExp.trim() || facultyProfile.industryExperience,
      yearsOfExperience: parseInt(yearsExp, 10) || facultyProfile.yearsOfExperience,
      links: {
        ...facultyProfile.links,
        googleScholar: googleScholar.trim() || undefined,
        linkedIn: linkedIn.trim() || undefined,
        orcid: orcid.trim() || undefined,
      },
    });
    setEditProfileOpen(false);
    toast.success("Faculty profile updated successfully.");
  };

  const handleAddPublication = () => {
    if (!pubTitle.trim() || !pubVenue.trim()) {
      toast.error("Please fill in publication title and venue/journal.");
      return;
    }
    addFacultyPublication({
      title: pubTitle.trim(),
      journalOrConference: pubVenue.trim(),
      year: pubYear.trim() || "2026",
      doiOrUrl: pubDoi.trim() || undefined,
      citations: 0,
      authors: [facultyProfile.name],
    });
    setPubTitle("");
    setPubVenue("");
    setPubDoi("");
    toast.success("Publication added to profile ledger.");
  };

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        eyebrow="Faculty & Academic Leadership"
        title="Academician Collaboration Hub"
        description="Bridge academic research and pedagogy with cutting-edge industry practice through corporate fellowships, funded consultancy, FDPs, and active student mentorship."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                setName(facultyProfile.name);
                setInstitution(facultyProfile.institution);
                setDepartment(facultyProfile.department);
                setDesignation(facultyProfile.designation);
                setIndustryExp(facultyProfile.industryExperience);
                setYearsExp(String(facultyProfile.yearsOfExperience));
                setGoogleScholar(facultyProfile.links.googleScholar || "");
                setLinkedIn(facultyProfile.links.linkedIn || "");
                setOrcid(facultyProfile.links.orcid || "");
                setEditProfileOpen(true);
              }}
            >
              <Edit2 className="size-3.5" /> Edit Profile
            </Button>
            <Button size="sm" className="gap-1.5" onClick={() => setTagModalOpen(true)}>
              <Sparkles className="size-3.5" /> Research & Expertise
            </Button>
          </div>
        }
      />

      {/* 6 Real KPI Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Stat
          label="Fellowships"
          value={activeInternshipsCount.toString()}
          trend="Active Fellowships"
          icon={Briefcase}
        />
        <Stat
          label="Training"
          value={activeTrainingCount.toString()}
          trend="Active Tracks"
          icon={Award}
        />
        <Stat
          label="FDPs"
          value={fdpEnrollmentsCount.toString()}
          trend="National Programs"
          icon={BookOpen}
        />
        <Stat
          label="Consultancy"
          value={activeConsultancyCount.toString()}
          trend="Funded Grants"
          icon={Building2}
        />
        <Stat
          label="Research"
          value={activeResearchCount.toString()}
          trend="Joint R&D"
          icon={Sparkles}
        />
        <Stat
          label="Mentees"
          value={mentorshipSessionsCount.toString()}
          trend="Active Guidance"
          icon={Users}
        />
      </div>

      {/* Faculty Profile Hero Card */}
      <Card className="overflow-hidden border-border/80 bg-gradient-to-r from-primary/10 via-card to-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <Avatar className="size-16 border-2 border-primary/30 shadow-md shrink-0">
                {facultyProfile.avatar ? <AvatarImage src={facultyProfile.avatar} /> : null}
                <AvatarFallback className="bg-primary/20 text-primary font-bold text-xl">
                  {facultyProfile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold font-display text-foreground">
                    {facultyProfile.name}
                  </h2>
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                    {facultyProfile.yearsOfExperience}+ Years Experience
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {facultyProfile.designation} • {facultyProfile.department}
                </p>
                <p className="text-xs text-foreground/80 font-medium">
                  {facultyProfile.institution}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
                  {facultyProfile.links.googleScholar && (
                    <a
                      href={facultyProfile.links.googleScholar}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      <GraduationCap className="size-3" /> Google Scholar
                    </a>
                  )}
                  {facultyProfile.links.linkedIn && (
                    <a
                      href={facultyProfile.links.linkedIn}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-blue-500 hover:underline"
                    >
                      <Globe className="size-3" /> LinkedIn
                    </a>
                  )}
                  {facultyProfile.links.orcid && (
                    <span className="flex items-center gap-1 text-emerald-600">
                      <Radio className="size-3" /> ORCID: {facultyProfile.links.orcid.slice(-19)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
              <Button size="sm" variant="outline" onClick={() => setPubModalOpen(true)}>
                <FileText className="size-3.5 mr-1.5" /> Publications ({facultyProfile.publications.length})
              </Button>
              <Button asChild size="sm">
                <Link to="/academician/mentorship">
                  <Users className="size-3.5 mr-1.5" /> Manage Mentees ({mentorshipSessionsCount})
                </Link>
              </Button>
            </div>
          </div>

          {/* Areas of Expertise & Research Interests */}
          <div className="mt-5 pt-4 border-t border-border grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                Areas of Academic & Technical Expertise
              </span>
              <div className="flex flex-wrap gap-1">
                {facultyProfile.areasOfExpertise.map((e) => (
                  <Badge key={e} variant="outline" className="bg-primary/5 text-xs text-foreground">
                    {e}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">
                Active Research & Joint R&D Interests
              </span>
              <div className="flex flex-wrap gap-1">
                {facultyProfile.researchInterests.map((r) => (
                  <Badge key={r} variant="outline" className="bg-emerald-500/5 text-emerald-600 border-emerald-500/20 text-xs">
                    {r}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid: AI Matched Opportunities + Active Industry Collaborations */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* AI Matched Industry Opportunities for Faculty */}
        <div className="lg:col-span-6 space-y-6">
          <SectionCard
            title={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-5 text-primary" />
                  <h3 className="font-display text-base font-semibold">
                    AI Matched Industry Programs
                  </h3>
                </div>
                <Button asChild variant="ghost" size="sm" className="text-xs gap-1">
                  <Link to="/academician/internships">
                    Explore all <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            }
          >
            <div className="space-y-3 pt-2">
              {facultyOpportunityMatches.map(({ opportunity, match }) => (
                <div
                  key={opportunity.id}
                  className="rounded-xl border border-border/80 bg-card p-4 space-y-2 hover:border-primary/40 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm text-foreground">{opportunity.title}</h4>
                        <Badge variant="outline" className="text-[10px] uppercase font-bold">
                          {opportunity.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {opportunity.company} • {opportunity.location} ({opportunity.workMode})
                      </p>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-display font-bold text-xs shrink-0">
                      {match.matchScore}% Fit
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {match.relevanceReason}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {match.matchingSkills.map((s) => (
                      <SkillTag key={s} muted>
                        {s}
                      </SkillTag>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-xs font-semibold text-foreground">
                      {opportunity.compensation.formatted}
                    </span>
                    <Button asChild size="sm" variant="outline" className="h-7 text-xs">
                      <Link to="/academician/internships">View & Express Interest</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Active Industry Collaborations */}
        <div className="lg:col-span-6 space-y-6">
          <SectionCard
            title={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="size-5 text-primary" />
                  <h3 className="font-display text-base font-semibold">
                    Active Academia–Industry Collaborations ({activeCollabsCount})
                  </h3>
                </div>
              </div>
            }
          >
            <div className="space-y-3 pt-2">
              {collaborations.map((collab) => (
                <div
                  key={collab.id}
                  className="rounded-xl border border-border/80 bg-card p-4 space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm text-foreground">{collab.title}</h4>
                        <Badge
                          className={`text-[10px] ${
                            collab.status === "Active"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : collab.status === "Completed" || collab.status === "Outcome Recorded"
                                ? "bg-purple-500/10 text-purple-600 border-purple-500/20"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {collab.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Partner: <strong className="text-foreground">{collab.partnerCompany}</strong> • Lead: {collab.facultyLead}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px]">{collab.type}</Badge>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {collab.description}
                  </p>

                  {collab.fundingOrBudget && (
                    <div className="text-[11px] text-primary font-medium">
                      💰 {collab.fundingOrBudget}
                    </div>
                  )}

                  {collab.outcome && (
                    <div className="rounded-lg bg-primary/5 border border-primary/20 p-2 text-xs space-y-1">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Participants: {collab.outcome.participantsCount} Students</span>
                        <span>Industry Score: ⭐ {collab.outcome.industryFeedbackScore} / 5</span>
                      </div>
                      {collab.outcome.placementImpactNotes && (
                        <p className="text-[11px] text-emerald-600 italic">
                          "{collab.outcome.placementImpactNotes}"
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Edit Faculty Profile Modal */}
      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Academician Profile</DialogTitle>
            <DialogDescription>Update institutional designation, department, and scholarly coordinates.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="grid gap-1">
              <Label className="text-xs">Full Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="h-9 text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-1">
                <Label className="text-xs">Designation</Label>
                <Input value={designation} onChange={(e) => setDesignation(e.target.value)} className="h-9 text-xs" />
              </div>
              <div className="grid gap-1">
                <Label className="text-xs">Department</Label>
                <Input value={department} onChange={(e) => setDepartment(e.target.value)} className="h-9 text-xs" />
              </div>
            </div>
            <div className="grid gap-1">
              <Label className="text-xs">Institution / University</Label>
              <Input value={institution} onChange={(e) => setInstitution(e.target.value)} className="h-9 text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-1">
                <Label className="text-xs">Years of Experience</Label>
                <Input type="number" value={yearsExp} onChange={(e) => setYearsExp(e.target.value)} className="h-9 text-xs" />
              </div>
              <div className="grid gap-1">
                <Label className="text-xs">Google Scholar Link</Label>
                <Input value={googleScholar} onChange={(e) => setGoogleScholar(e.target.value)} className="h-9 text-xs" />
              </div>
            </div>
            <div className="grid gap-1">
              <Label className="text-xs">Industry & Advisory Experience</Label>
              <Textarea rows={2} value={industryExp} onChange={(e) => setIndustryExp(e.target.value)} className="text-xs" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProfileOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveProfile}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Expertise & Research Interests Modal */}
      <Dialog open={tagModalOpen} onOpenChange={setTagModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Manage Expertise & Research Domains</DialogTitle>
            <DialogDescription>Add or remove technical competencies and joint R&D domains.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 text-xs">
            {/* Expertise Section */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-primary">Technical Expertise Tags</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. Distributed Consensus"
                  value={newExpertise}
                  onChange={(e) => setNewExpertise(e.target.value)}
                  className="h-8 text-xs"
                />
                <Button
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => {
                    addFacultyExpertise(newExpertise);
                    setNewExpertise("");
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {facultyProfile.areasOfExpertise.map((e) => (
                  <Badge key={e} variant="outline" className="flex items-center gap-1 text-xs">
                    {e}
                    <button
                      type="button"
                      onClick={() => removeFacultyExpertise(e)}
                      className="hover:text-rose-500 cursor-pointer ml-1"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Research Section */}
            <div className="space-y-2 pt-2 border-t border-border">
              <Label className="text-xs font-semibold text-emerald-600">Research & Joint R&D Domains</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. Zero-Trust Cloud Architectures"
                  value={newResearch}
                  onChange={(e) => setNewResearch(e.target.value)}
                  className="h-8 text-xs"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 text-xs"
                  onClick={() => {
                    addFacultyResearchInterest(newResearch);
                    setNewResearch("");
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {facultyProfile.researchInterests.map((r) => (
                  <Badge key={r} variant="outline" className="flex items-center gap-1 text-xs text-emerald-600 border-emerald-500/30">
                    {r}
                    <button
                      type="button"
                      onClick={() => removeFacultyResearchInterest(r)}
                      className="hover:text-rose-500 cursor-pointer ml-1"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setTagModalOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Publications Modal */}
      <Dialog open={pubModalOpen} onOpenChange={setPubModalOpen}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Scholarly Publications ({facultyProfile.publications.length})</span>
            </DialogTitle>
            <DialogDescription>Peer-reviewed journal papers and conference proceedings.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 text-xs">
            {/* Add Publication Form */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 space-y-2">
              <h4 className="font-semibold text-xs text-foreground">Add New Publication</h4>
              <div className="grid gap-2">
                <Input
                  placeholder="Paper Title *"
                  value={pubTitle}
                  onChange={(e) => setPubTitle(e.target.value)}
                  className="h-8 text-xs"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Journal / Conference Name *"
                    value={pubVenue}
                    onChange={(e) => setPubVenue(e.target.value)}
                    className="h-8 text-xs"
                  />
                  <Input
                    placeholder="Year (e.g. 2026)"
                    value={pubYear}
                    onChange={(e) => setPubYear(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <Input
                  placeholder="DOI or URL (e.g. https://doi.org/...)"
                  value={pubDoi}
                  onChange={(e) => setPubDoi(e.target.value)}
                  className="h-8 text-xs"
                />
                <Button size="sm" className="h-8 text-xs" onClick={handleAddPublication}>
                  Add Publication
                </Button>
              </div>
            </div>

            {/* Existing Publications List */}
            <div className="divide-y divide-border space-y-2">
              {facultyProfile.publications.map((pub) => (
                <div key={pub.id} className="pt-2 flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-foreground text-xs leading-snug">{pub.title}</p>
                    <p className="text-muted-foreground text-[11px]">
                      {pub.journalOrConference} • {pub.year}
                    </p>
                    {pub.doiOrUrl && (
                      <a
                        href={pub.doiOrUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline text-[10px] flex items-center gap-1"
                      >
                        <LinkIcon className="size-2.5" /> View Paper
                      </a>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="size-7 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                    onClick={() => removeFacultyPublication(pub.id)}
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setPubModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
