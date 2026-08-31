import { useState } from "react";
import {
  AlertCircle,
  Award,
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
  FileCheck,
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
import { Card } from "@/components/ui/card";
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
import type { Opportunity, OpportunityType, OpportunityWorkMode, SkillCategory } from "@/types";

export function IndustryPostOpportunity() {
  const {
    companyProfile,
    opportunities,
    addCorporateOpportunity,
    updateCorporateOpportunity,
    deleteCorporateOpportunity,
    publishCorporateOpportunity,
    closeCorporateOpportunity,
    industryApps,
  } = useAppState();

  const [oppType, setOppType] = useState<OpportunityType>("Internship");

  // General Form Fields
  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState("Software Engineering");
  const [category, setCategory] = useState<SkillCategory>("Web & Frontend");
  const [description, setDescription] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [preferredSkills, setPreferredSkills] = useState("");
  const [degreeReq, setDegreeReq] = useState("B.Tech, MCA, B.E.");
  const [deptReq, setDeptReq] = useState("Computer Science, Information Technology");
  const [gradYears, setGradYears] = useState("2025, 2026, 2027");
  const [minCgpa, setMinCgpa] = useState("7.0");
  const [location, setLocation] = useState(companyProfile.location || "Bengaluru, Karnataka");
  const [workMode, setWorkMode] = useState<OpportunityWorkMode>("Hybrid");
  const [duration, setDuration] = useState("6 Months");
  const [compensationFormatted, setCompensationFormatted] = useState("₹35,000 / mo");
  const [deadline, setDeadline] = useState("2026-11-30");
  const [openings, setOpenings] = useState("2");

  // Live Project Specific
  const [problemStatement, setProblemStatement] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [mentorName, setMentorName] = useState(companyProfile.name + " Engineering Lead");
  const [mentorRole, setMentorRole] = useState("Staff Software Engineer");
  const [teamSize, setTeamSize] = useState("2-4 Students");

  // Edit / Delete State
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string; title: string }>({
    open: false,
    id: "",
    title: "",
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setResponsibilities("");
    setRequiredSkills("");
    setPreferredSkills("");
    setProblemStatement("");
    setDeliverables("");
    setCompensationFormatted(
      oppType === "Job" ? "₹12 - ₹16 LPA" : oppType === "Live Project" ? "₹20,000 Bonus + Certificate" : "₹35,000 / mo",
    );
  };

  const handlePost = (asDraft = false) => {
    if (!title.trim() || !description.trim() || !requiredSkills.trim()) {
      toast.error("Please fill in the title, description, and required core skills.");
      return;
    }

    const reqSkillsArr = requiredSkills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const prefSkillsArr = preferredSkills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const respArr = responsibilities
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const created = addCorporateOpportunity({
      title: title.trim(),
      company: companyProfile.name,
      companyWebsite: companyProfile.website,
      companyLogoHue: companyProfile.logoHue,
      type: oppType,
      domain: domain.trim(),
      category: category,
      experienceLevel: oppType === "Job" ? "Fresher" : "Fresher",
      description: description.trim(),
      responsibilities: respArr.length > 0 ? respArr : [description.trim()],
      requiredSkills: reqSkillsArr,
      preferredSkills: prefSkillsArr,
      eligibility: {
        degreeRequirements: degreeReq.split(",").map((s) => s.trim()).filter(Boolean),
        departmentRequirements: deptReq.split(",").map((s) => s.trim()).filter(Boolean),
        graduationRequirements: gradYears.split(",").map((s) => s.trim()).filter(Boolean),
        minCgpa: parseFloat(minCgpa) || 7.0,
      },
      location: location.trim(),
      workMode: workMode,
      duration: duration.trim(),
      compensation: {
        type: oppType === "Job" ? "Salary" : oppType === "Live Project" ? "Completion Bonus" : "Stipend",
        formatted: compensationFormatted.trim() || (oppType === "Job" ? "₹14 LPA" : "₹35,000 / mo"),
        amount: compensationFormatted.trim(),
        currency: "INR",
      },
      applicationDeadline: deadline.trim() || "2026-11-30",
      openings: parseInt(openings, 10) || 2,
      status: asDraft ? "Draft" : "Published",
      liveProjectDetails:
        oppType === "Live Project"
          ? {
              problemStatement: problemStatement.trim() || description.trim(),
              expectedOutcome: "Production-ready functional implementation with comprehensive unit tests.",
              mentorName: mentorName.trim(),
              mentorRole: mentorRole.trim(),
              mentorCompany: companyProfile.name,
              teamSize: teamSize.trim(),
              deliverables: deliverables.split("\n").map((s) => s.trim()).filter(Boolean),
            }
          : undefined,
    });

    toast.success(
      asDraft
        ? `Draft "${created.title}" saved successfully.`
        : `🎉 Opportunity "${created.title}" published! It is now live for students.`,
    );

    resetForm();
  };

  const handleUpdate = () => {
    if (!editingOpp) return;
    updateCorporateOpportunity(editingOpp.id, {
      title: editingOpp.title,
      description: editingOpp.description,
      location: editingOpp.location,
      duration: editingOpp.duration,
      workMode: editingOpp.workMode,
      status: editingOpp.status,
    });
    toast.success("Opportunity updated successfully.");
    setEditingOpp(null);
  };

  const myCompanyOpportunities = opportunities.filter(
    (o) =>
      o.company.toLowerCase() === companyProfile.name.toLowerCase() ||
      o.companyId === "comp-corp" ||
      o.company === "Razorpay",
  );

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        eyebrow="Industry Portal"
        title="Post Opportunity"
        description="Publish campus recruitment listings, full-time jobs, and live industry projects with precision skill requirements."
      />

      {/* Main Creation Card */}
      <Card className="border-border/80 bg-card p-6 shadow-sm">
        <div className="space-y-6">
          {/* Opportunity Type Selector */}
          <div>
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              Select Opportunity Type
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "Internship", label: "Internship", icon: Building2 },
                { id: "Job", label: "Full-Time Job", icon: Briefcase },
                { id: "Live Project", label: "Live Project", icon: Layers },
                { id: "Apprenticeship", label: "Apprenticeship", icon: Award },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = oppType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setOppType(item.id as OpportunityType);
                      setCompensationFormatted(
                        item.id === "Job"
                          ? "₹14 - ₹18 LPA"
                          : item.id === "Live Project"
                            ? "₹20,000 Bonus + Certificate"
                            : "₹35,000 / mo",
                      );
                    }}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition cursor-pointer ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "bg-card hover:bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="size-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>Opportunity Title *</Label>
              <Input
                placeholder="e.g. Lead Frontend Engineer Intern"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label>Domain / Function</Label>
              <Input
                placeholder="e.g. Frontend Engineering, Distributed Systems"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              />
            </div>

            <div className="grid gap-2 md:col-span-2">
              <Label>Role Overview & Description *</Label>
              <Textarea
                rows={3}
                placeholder="Describe the mission, key technologies, and day-to-day focus of the role..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid gap-2 md:col-span-2">
              <Label>Key Responsibilities (One per line)</Label>
              <Textarea
                rows={2}
                placeholder="Build responsive React components&#10;Optimize Core Web Vitals&#10;Collaborate on API contracts"
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label>Mandatory Required Skills (Comma separated) *</Label>
              <Input
                placeholder="React, TypeScript, Tailwind CSS, REST APIs"
                value={requiredSkills}
                onChange={(e) => setRequiredSkills(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label>Preferred / Bonus Skills</Label>
              <Input
                placeholder="Next.js, WebSockets, Redux, Jest"
                value={preferredSkills}
                onChange={(e) => setPreferredSkills(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label>Eligible Degrees</Label>
              <Input
                placeholder="B.Tech, B.E., MCA, M.Tech"
                value={degreeReq}
                onChange={(e) => setDegreeReq(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label>Eligible Branches / Departments</Label>
              <Input
                placeholder="Computer Science, Information Technology, Electronics"
                value={deptReq}
                onChange={(e) => setDeptReq(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-1">
                <Label>Eligible Batches</Label>
                <Input
                  placeholder="2025, 2026, 2027"
                  value={gradYears}
                  onChange={(e) => setGradYears(e.target.value)}
                />
              </div>
              <div className="grid gap-1">
                <Label>Min CGPA</Label>
                <Input
                  placeholder="7.0"
                  value={minCgpa}
                  onChange={(e) => setMinCgpa(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-1">
                <Label>Work Mode</Label>
                <select
                  aria-label="Work Mode"
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value as OpportunityWorkMode)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>
              <div className="grid gap-1">
                <Label>Duration</Label>
                <Input
                  placeholder="6 Months / Full Time"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Compensation / Stipend</Label>
              <Input
                placeholder="e.g. ₹35,000 / mo or ₹14 LPA"
                value={compensationFormatted}
                onChange={(e) => setCompensationFormatted(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-1">
                <Label>Deadline</Label>
                <Input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
              <div className="grid gap-1">
                <Label>Openings</Label>
                <Input
                  type="number"
                  min="1"
                  value={openings}
                  onChange={(e) => setOpenings(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Live Project Extension Fields */}
          {oppType === "Live Project" && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-primary" />
                <h4 className="font-semibold text-sm text-foreground">Live Industry Project Parameters</h4>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="grid gap-1 md:col-span-2">
                  <Label>Problem Statement</Label>
                  <Textarea
                    rows={2}
                    placeholder="Describe the specific real-world corporate challenge..."
                    value={problemStatement}
                    onChange={(e) => setProblemStatement(e.target.value)}
                  />
                </div>
                <div className="grid gap-1 md:col-span-2">
                  <Label>Milestone Deliverables (One per line)</Label>
                  <Textarea
                    rows={2}
                    placeholder="1. Architecture RFC document&#10;2. Interactive Prototype on GitHub&#10;3. Benchmark test report"
                    value={deliverables}
                    onChange={(e) => setDeliverables(e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label>Industry Mentor Name</Label>
                  <Input value={mentorName} onChange={(e) => setMentorName(e.target.value)} />
                </div>
                <div className="grid gap-1">
                  <Label>Mentor Role / Designation</Label>
                  <Input value={mentorRole} onChange={(e) => setMentorRole(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => handlePost(true)}>
              Save as Draft
            </Button>
            <Button onClick={() => handlePost(false)} className="gap-1.5">
              <Sparkles className="size-4" /> Publish Live Opportunity
            </Button>
          </div>
        </div>
      </Card>

      {/* Managed Opportunities List */}
      <SectionCard
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="size-5 text-primary" />
              <h3 className="font-display text-base font-semibold">Active & Draft Postings ({myCompanyOpportunities.length})</h3>
            </div>
          </div>
        }
      >
        <div className="divide-y divide-border pt-1">
          {myCompanyOpportunities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No opportunities posted yet.</p>
          ) : (
            myCompanyOpportunities.map((opp) => {
              const applicantsForOpp = industryApps.filter(
                (a) => a.internshipId === opp.id || a.internship.toLowerCase() === opp.title.toLowerCase(),
              );

              return (
                <div key={opp.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold text-sm text-foreground">{opp.title}</h4>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold">
                        {opp.type}
                      </Badge>
                      <Badge
                        className={`text-[10px] ${
                          opp.status === "Published"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : opp.status === "Draft"
                              ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {opp.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {opp.location} • {opp.workMode} • {opp.compensation.formatted}
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {opp.requiredSkills.slice(0, 4).map((s) => (
                        <SkillTag key={s} muted>
                          {s}
                        </SkillTag>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground mr-2 font-medium">
                      {applicantsForOpp.length} Applicant(s)
                    </span>

                    {opp.status === "Draft" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs text-emerald-600"
                        onClick={() => {
                          publishCorporateOpportunity(opp.id);
                          toast.success(`Published "${opp.title}"`);
                        }}
                      >
                        Publish
                      </Button>
                    ) : opp.status === "Published" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs text-amber-600"
                        onClick={() => {
                          closeCorporateOpportunity(opp.id);
                          toast.info(`Closed listings for "${opp.title}"`);
                        }}
                      >
                        Close
                      </Button>
                    ) : null}

                    <Button
                      size="sm"
                      variant="ghost"
                      className="size-8 p-0"
                      onClick={() => setEditingOpp(opp)}
                    >
                      <Edit2 className="size-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="size-8 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                      onClick={() => setDeleteDialog({ open: true, id: opp.id, title: opp.title })}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </SectionCard>

      {/* Edit Modal */}
      {editingOpp && (
        <Dialog open={Boolean(editingOpp)} onOpenChange={(open) => !open && setEditingOpp(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Opportunity</DialogTitle>
              <DialogDescription>Modify parameters for {editingOpp.title}</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="grid gap-1">
                <Label>Title</Label>
                <Input
                  value={editingOpp.title}
                  onChange={(e) => setEditingOpp({ ...editingOpp, title: e.target.value })}
                />
              </div>
              <div className="grid gap-1">
                <Label>Location</Label>
                <Input
                  value={editingOpp.location}
                  onChange={(e) => setEditingOpp({ ...editingOpp, location: e.target.value })}
                />
              </div>
              <div className="grid gap-1">
                <Label>Duration</Label>
                <Input
                  value={editingOpp.duration}
                  onChange={(e) => setEditingOpp({ ...editingOpp, duration: e.target.value })}
                />
              </div>
              <div className="grid gap-1">
                <Label>Description</Label>
                <Textarea
                  rows={3}
                  value={editingOpp.description}
                  onChange={(e) => setEditingOpp({ ...editingOpp, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingOpp(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirm Alert */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Opportunity?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete "{deleteDialog.title}"? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 hover:bg-rose-700 text-white"
              onClick={() => {
                deleteCorporateOpportunity(deleteDialog.id);
                toast.success("Opportunity deleted.");
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
