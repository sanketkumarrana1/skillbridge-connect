import { useState } from "react";
import {
  AlertCircle,
  Briefcase,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  DollarSign,
  Edit2,
  Eye,
  FileText,
  IndianRupee,
  Layers,
  MapPin,
  Plus,
  Radio,
  Sparkles,
  Trash2,
  Users,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { SkillTag } from "@/components/skillbridge/primitives";
import { SectionCard, WorkspaceHeader } from "@/components/skillbridge/student-ui";
import { useAppState } from "@/context/app-state";
import type { Internship, Job } from "@/types";

export function IndustryPostOpportunity() {
  const {
    companyProfile,
    internships,
    addInternship,
    updateInternship,
    deleteInternship,
    jobs,
    addJob,
    updateJob,
    deleteJob,
    industryApps,
  } = useAppState();

  const [activeTab, setActiveTab] = useState<"internship" | "job">("internship");

  // Internship Form State
  const [intTitle, setIntTitle] = useState("");
  const [intDesc, setIntDesc] = useState("");
  const [intSkills, setIntSkills] = useState("");
  const [intEligibility, setIntEligibility] = useState("");
  const [intLocation, setIntLocation] = useState("");
  const [intType, setIntType] = useState<"Remote" | "Hybrid" | "On-site">("Hybrid");
  const [intDuration, setIntDuration] = useState("");
  const [intStipend, setIntStipend] = useState("");
  const [intDeadline, setIntDeadline] = useState("");

  // Job Form State
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobSkills, setJobSkills] = useState("");
  const [jobQualifications, setJobQualifications] = useState("");
  const [jobExperience, setJobExperience] = useState("Freshers");
  const [jobCTC, setJobCTC] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobWorkType, setJobWorkType] = useState<"Remote" | "Hybrid" | "On-site">("Hybrid");
  const [jobDeadline, setJobDeadline] = useState("");

  // Edit / Delete Modal States
  const [editingInt, setEditingInt] = useState<Internship | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: "internship" | "job";
    id: string;
    title: string;
  }>({ open: false, type: "internship", id: "", title: "" });

  const resetIntForm = () => {
    setIntTitle("");
    setIntDesc("");
    setIntSkills("");
    setIntEligibility("");
    setIntLocation("");
    setIntType("Hybrid");
    setIntDuration("");
    setIntStipend("");
    setIntDeadline("");
  };

  const resetJobForm = () => {
    setJobTitle("");
    setJobDesc("");
    setJobSkills("");
    setJobQualifications("");
    setJobExperience("Freshers");
    setJobCTC("");
    setJobLocation("");
    setJobWorkType("Hybrid");
    setJobDeadline("");
  };

  const handlePostInternship = (asDraft = false) => {
    if (!intTitle.trim() || !intDesc.trim() || !intSkills.trim()) {
      toast.error("Please fill in the title, description, and required skills.");
      return;
    }

    const skillsArr = intSkills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const newInternship: Internship = {
      id: `int-${Date.now()}`,
      title: intTitle.trim(),
      company: companyProfile.name,
      companyLogoHue: companyProfile.logoHue,
      description: intDesc.trim(),
      requiredSkills: skillsArr,
      eligibility: intEligibility.trim() || "B.Tech / MCA / Equivalent (Pre-final & Final Year)",
      duration: intDuration.trim() || "3 - 6 Months",
      location: intLocation.trim() || companyProfile.location,
      type: intType,
      stipend: intStipend.trim() || "₹25,000 / month",
      match: 88,
      posted: "Just now",
      reasons: ["Direct recruiter posting", "Matches technical proficiency"],
      deadline: intDeadline.trim() || "30 Sep 2026",
      paid: !intStipend.toLowerCase().includes("unpaid"),
      status: asDraft ? "Draft" : "Published",
    };

    addInternship(newInternship);
    resetIntForm();
    toast.success(
      asDraft
        ? "Internship saved as draft."
        : "Internship published successfully! Visible in Student Marketplace.",
    );
  };

  const handlePostJob = (asDraft = false) => {
    if (!jobTitle.trim() || !jobDesc.trim() || !jobSkills.trim()) {
      toast.error("Please fill in the job title, description, and required skills.");
      return;
    }

    const skillsArr = jobSkills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const qualsArr = jobQualifications.trim()
      ? jobQualifications
          .split(",")
          .map((q) => q.trim())
          .filter(Boolean)
      : ["B.Tech / B.E in CS/IT or related discipline", "Minimum 7.0 CGPA"];

    const newJob: Job = {
      id: `job-${Date.now()}`,
      title: jobTitle.trim(),
      company: companyProfile.name,
      companyLogoHue: companyProfile.logoHue,
      description: jobDesc.trim(),
      requiredSkills: skillsArr,
      qualifications: qualsArr,
      experience: jobExperience,
      ctc: jobCTC.trim() || "₹10 - 14 LPA",
      location: jobLocation.trim() || companyProfile.location,
      workType: jobWorkType,
      deadline: jobDeadline.trim() || "30 Oct 2026",
      posted: "Just now",
      reasons: ["High compensation bracket", "Fast-track technical interview"],
      status: asDraft ? "Draft" : "Published",
    };

    addJob(newJob);
    resetJobForm();
    toast.success(
      asDraft
        ? "Job opportunity saved as draft."
        : "Job published successfully! Visible in Student Job Search.",
    );
  };

  const handleSaveEditInternship = () => {
    if (!editingInt) return;
    updateInternship(editingInt.id, {
      ...editingInt,
    });
    setEditingInt(null);
    toast.success("Internship updated successfully");
  };

  const handleSaveEditJob = () => {
    if (!editingJob) return;
    updateJob(editingJob.id, {
      ...editingJob,
    });
    setEditingJob(null);
    toast.success("Job posting updated successfully");
  };

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        eyebrow="Opportunity Studio"
        title="Post Internship / Job"
        description="Publish openings directly to verified candidates across partner institutions."
      />

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "internship" | "job")}>
        <TabsList className="grid w-full grid-cols-2 sm:max-w-md">
          <TabsTrigger value="internship" className="gap-2">
            <Briefcase className="size-4" /> Post Internship
          </TabsTrigger>
          <TabsTrigger value="job" className="gap-2">
            <Building2 className="size-4" /> Post Full-Time Job
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Post Internship */}
        <TabsContent value="internship" className="space-y-6 pt-4">
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Form */}
            <div className="lg:col-span-7">
              <SectionCard
                title={
                  <div className="flex items-center gap-2">
                    <Briefcase className="size-5 text-primary" />
                    <h2 className="font-display text-lg font-semibold">
                      Internship Opportunity Details
                    </h2>
                  </div>
                }
              >
                <div className="space-y-4 pt-2">
                  <div className="grid gap-2">
                    <Label htmlFor="int-title">Internship Title *</Label>
                    <Input
                      id="int-title"
                      value={intTitle}
                      onChange={(e) => setIntTitle(e.target.value)}
                      placeholder="e.g. Frontend Engineering Intern, AI/ML Research Intern"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="int-type">Work Mode</Label>
                      <select
                        id="int-type"
                        value={intType}
                        onChange={(e) =>
                          setIntType(e.target.value as "Remote" | "Hybrid" | "On-site")
                        }
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="Hybrid">Hybrid</option>
                        <option value="Remote">Remote</option>
                        <option value="On-site">On-site</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="int-loc">Location</Label>
                      <Input
                        id="int-loc"
                        value={intLocation}
                        onChange={(e) => setIntLocation(e.target.value)}
                        placeholder="e.g. Bengaluru / Pune"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="int-dur">Duration</Label>
                      <Input
                        id="int-dur"
                        value={intDuration}
                        onChange={(e) => setIntDuration(e.target.value)}
                        placeholder="e.g. 6 Months (Jan - Jun)"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="int-stipend">Stipend / Compensation</Label>
                      <Input
                        id="int-stipend"
                        value={intStipend}
                        onChange={(e) => setIntStipend(e.target.value)}
                        placeholder="e.g. ₹25,000 - ₹35,000 / month"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="int-skills">Required Skills * (comma-separated)</Label>
                    <Input
                      id="int-skills"
                      value={intSkills}
                      onChange={(e) => setIntSkills(e.target.value)}
                      placeholder="React, TypeScript, Tailwind CSS, REST APIs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="int-elig">Eligibility Criteria</Label>
                      <Input
                        id="int-elig"
                        value={intEligibility}
                        onChange={(e) => setIntEligibility(e.target.value)}
                        placeholder="e.g. 3rd & 4th Year B.Tech CSE/IT"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="int-dead">Application Deadline</Label>
                      <Input
                        id="int-dead"
                        value={intDeadline}
                        onChange={(e) => setIntDeadline(e.target.value)}
                        placeholder="e.g. 15 Oct 2026"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="int-desc">Role Description & Responsibilities *</Label>
                    <Textarea
                      id="int-desc"
                      rows={4}
                      value={intDesc}
                      onChange={(e) => setIntDesc(e.target.value)}
                      placeholder="Outline key projects, tech stack, and what the intern will learn and deliver..."
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-border">
                    <Button variant="outline" onClick={() => handlePostInternship(true)}>
                      Save as Draft
                    </Button>
                    <Button onClick={() => handlePostInternship(false)} className="gap-2">
                      <Sparkles className="size-4" /> Publish to Marketplace
                    </Button>
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* Live Preview Card */}
            <div className="lg:col-span-5">
              <SectionCard title="Live Student Card Preview">
                <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-card to-primary/5 p-5 shadow-xs">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-base font-bold text-foreground">
                        {intTitle || "Frontend Engineering Intern"}
                      </h3>
                      <p className="text-xs text-primary font-semibold mt-0.5">
                        {companyProfile.name}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs bg-card">
                      {intType}
                    </Badge>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3 text-primary" />
                      {intLocation || companyProfile.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3 text-primary" />
                      {intDuration || "3 - 6 Months"}
                    </span>
                    <span className="flex items-center gap-1">
                      <IndianRupee className="size-3 text-emerald-600" />
                      {intStipend || "₹25,000 / mo"}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {intDesc ||
                      "Collaborate with our core engineering team building web applications, microservices, and internal tooling."}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1">
                    {(intSkills
                      ? intSkills
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean)
                      : ["React", "TypeScript", "Tailwind"]
                    ).map((s) => (
                      <SkillTag key={s} muted>
                        {s}
                      </SkillTag>
                    ))}
                  </div>
                </div>
              </SectionCard>
            </div>
          </div>

          {/* Manage Posted Internships Table */}
          <SectionCard
            title={
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">
                  Your Posted Internships ({internships.length})
                </h2>
              </div>
            }
          >
            <div className="divide-y divide-border">
              {internships.map((item) => {
                const isDraft = item.status === "Draft";
                const applicantsCount = industryApps.filter(
                  (a) => a.internshipId === item.id,
                ).length;
                return (
                  <div
                    key={item.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm text-foreground">{item.title}</h3>
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
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span>{item.type}</span>
                        <span>•</span>
                        <span>{item.location}</span>
                        <span>•</span>
                        <span>{item.stipend}</span>
                        <span>•</span>
                        <span className="font-semibold text-primary">
                          {applicantsCount} Applicants
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs"
                        onClick={() => {
                          updateInternship(item.id, { status: isDraft ? "Published" : "Draft" });
                          toast.success(`Internship moved to ${isDraft ? "Published" : "Draft"}`);
                        }}
                      >
                        {isDraft ? "Publish" : "Move to Draft"}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 text-muted-foreground hover:text-foreground"
                        onClick={() => setEditingInt(item)}
                        aria-label="Edit internship"
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
                            type: "internship",
                            id: item.id,
                            title: item.title,
                          })
                        }
                        aria-label="Delete internship"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </TabsContent>

        {/* Tab 2: Post Job */}
        <TabsContent value="job" className="space-y-6 pt-4">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <SectionCard
                title={
                  <div className="flex items-center gap-2">
                    <Building2 className="size-5 text-primary" />
                    <h2 className="font-display text-lg font-semibold">
                      Full-Time Job Posting Details
                    </h2>
                  </div>
                }
              >
                <div className="space-y-4 pt-2">
                  <div className="grid gap-2">
                    <Label htmlFor="job-title">Job Title *</Label>
                    <Input
                      id="job-title"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Associate Software Engineer, Cloud DevOps Engineer"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="job-wtype">Work Type</Label>
                      <select
                        id="job-wtype"
                        value={jobWorkType}
                        onChange={(e) =>
                          setJobWorkType(e.target.value as "Remote" | "Hybrid" | "On-site")
                        }
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="Hybrid">Hybrid</option>
                        <option value="Remote">Remote</option>
                        <option value="On-site">On-site</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="job-loc">Location</Label>
                      <Input
                        id="job-loc"
                        value={jobLocation}
                        onChange={(e) => setJobLocation(e.target.value)}
                        placeholder="e.g. Bengaluru, India"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="job-exp">Experience Bracket</Label>
                      <select
                        id="job-exp"
                        value={jobExperience}
                        onChange={(e) => setJobExperience(e.target.value)}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="Freshers">Freshers / 2026 Batch</option>
                        <option value="0-1 yr">0 - 1 Year</option>
                        <option value="1-2 yr">1 - 2 Years</option>
                        <option value="2+ yrs">2+ Years</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="job-ctc">Salary / CTC Package</Label>
                      <Input
                        id="job-ctc"
                        value={jobCTC}
                        onChange={(e) => setJobCTC(e.target.value)}
                        placeholder="e.g. ₹12 - 16 LPA"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="job-skills">Required Skills * (comma-separated)</Label>
                    <Input
                      id="job-skills"
                      value={jobSkills}
                      onChange={(e) => setJobSkills(e.target.value)}
                      placeholder="React, TypeScript, Node.js, PostgreSQL, Docker"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="job-qual">Qualifications</Label>
                      <Input
                        id="job-qual"
                        value={jobQualifications}
                        onChange={(e) => setJobQualifications(e.target.value)}
                        placeholder="e.g. B.Tech in CSE/IT, 7+ CGPA"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="job-dead">Deadline</Label>
                      <Input
                        id="job-dead"
                        value={jobDeadline}
                        onChange={(e) => setJobDeadline(e.target.value)}
                        placeholder="e.g. 30 Oct 2026"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="job-desc">Job Description & Expectations *</Label>
                    <Textarea
                      id="job-desc"
                      rows={4}
                      value={jobDesc}
                      onChange={(e) => setJobDesc(e.target.value)}
                      placeholder="Describe the engineering role, team structure, and career growth..."
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-border">
                    <Button variant="outline" onClick={() => handlePostJob(true)}>
                      Save as Draft
                    </Button>
                    <Button onClick={() => handlePostJob(false)} className="gap-2">
                      <Sparkles className="size-4" /> Publish Job
                    </Button>
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* Live Student Job Preview */}
            <div className="lg:col-span-5">
              <SectionCard title="Live Student Card Preview">
                <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-card to-primary/5 p-5 shadow-xs">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-base font-bold text-foreground">
                        {jobTitle || "Associate Software Engineer"}
                      </h3>
                      <p className="text-xs text-primary font-semibold mt-0.5">
                        {companyProfile.name}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs bg-card">
                      {jobWorkType}
                    </Badge>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3 text-primary" />
                      {jobLocation || companyProfile.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="size-3 text-primary" />
                      {jobExperience || "Freshers"}
                    </span>
                    <span className="flex items-center gap-1">
                      <IndianRupee className="size-3 text-emerald-600" />
                      {jobCTC || "₹12 - 16 LPA"}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {jobDesc ||
                      "Build and scale high-availability customer-facing features and API microservices."}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1">
                    {(jobSkills
                      ? jobSkills
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean)
                      : ["React", "TypeScript", "Node.js"]
                    ).map((s) => (
                      <SkillTag key={s} muted>
                        {s}
                      </SkillTag>
                    ))}
                  </div>
                </div>
              </SectionCard>
            </div>
          </div>

          {/* Manage Posted Jobs Table */}
          <SectionCard
            title={
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">
                  Your Posted Jobs ({jobs.length})
                </h2>
              </div>
            }
          >
            <div className="divide-y divide-border">
              {jobs.map((item) => {
                const isDraft = item.status === "Draft";
                const applicantsCount = industryApps.filter(
                  (a) => a.internshipId === item.id,
                ).length;
                return (
                  <div
                    key={item.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm text-foreground">{item.title}</h3>
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
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span>{item.workType}</span>
                        <span>•</span>
                        <span>{item.location}</span>
                        <span>•</span>
                        <span>{item.ctc}</span>
                        <span>•</span>
                        <span>{item.experience}</span>
                        <span>•</span>
                        <span className="font-semibold text-primary">
                          {applicantsCount} Applicants
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs"
                        onClick={() => {
                          updateJob(item.id, { status: isDraft ? "Published" : "Draft" });
                          toast.success(`Job moved to ${isDraft ? "Published" : "Draft"}`);
                        }}
                      >
                        {isDraft ? "Publish" : "Move to Draft"}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 text-muted-foreground hover:text-foreground"
                        onClick={() => setEditingJob(item)}
                        aria-label="Edit job"
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
                            type: "job",
                            id: item.id,
                            title: item.title,
                          })
                        }
                        aria-label="Delete job"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>

      {/* Edit Internship Modal */}
      <Dialog open={!!editingInt} onOpenChange={(open) => !open && setEditingInt(null)}>
        {editingInt && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Internship: {editingInt.title}</DialogTitle>
              <DialogDescription>
                Modify requirements, compensation, or active dates.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="grid gap-2">
                <Label>Title</Label>
                <Input
                  value={editingInt.title}
                  onChange={(e) => setEditingInt({ ...editingInt, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label>Stipend</Label>
                  <Input
                    value={editingInt.stipend}
                    onChange={(e) => setEditingInt({ ...editingInt, stipend: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Location</Label>
                  <Input
                    value={editingInt.location}
                    onChange={(e) => setEditingInt({ ...editingInt, location: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Required Skills (comma-separated)</Label>
                <Input
                  value={editingInt.requiredSkills.join(", ")}
                  onChange={(e) =>
                    setEditingInt({
                      ...editingInt,
                      requiredSkills: e.target.value
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
                  value={editingInt.description}
                  onChange={(e) => setEditingInt({ ...editingInt, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingInt(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEditInternship}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Edit Job Modal */}
      <Dialog open={!!editingJob} onOpenChange={(open) => !open && setEditingJob(null)}>
        {editingJob && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Job: {editingJob.title}</DialogTitle>
              <DialogDescription>Modify salary bracket, experience, or skills.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="grid gap-2">
                <Label>Title</Label>
                <Input
                  value={editingJob.title}
                  onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label>CTC</Label>
                  <Input
                    value={editingJob.ctc}
                    onChange={(e) => setEditingJob({ ...editingJob, ctc: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Location</Label>
                  <Input
                    value={editingJob.location}
                    onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Required Skills (comma-separated)</Label>
                <Input
                  value={editingJob.requiredSkills.join(", ")}
                  onChange={(e) =>
                    setEditingJob({
                      ...editingJob,
                      requiredSkills: e.target.value
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
                  value={editingJob.description}
                  onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingJob(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEditJob}>Save Changes</Button>
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
            <AlertDialogTitle>Delete Opportunity?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">"{deleteDialog.title}"</span>? This
              will remove the listing from both recruiter and student portals.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteDialog.type === "internship") {
                  deleteInternship(deleteDialog.id);
                  toast.success("Internship deleted");
                } else {
                  deleteJob(deleteDialog.id);
                  toast.success("Job deleted");
                }
                setDeleteDialog((prev) => ({ ...prev, open: false }));
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
