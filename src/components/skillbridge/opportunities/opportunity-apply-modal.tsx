import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Award,
  Briefcase,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  FileCheck,
  FileText,
  FolderGit2,
  GraduationCap,
  IndianRupee,
  Layers,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  User,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useAppState } from "@/context/app-state";
import type { Opportunity, OpportunityMatchResult } from "@/types/opportunity";

interface OpportunityApplyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opportunity: Opportunity | null;
  matchResult: OpportunityMatchResult | null;
}

export function OpportunityApplyModal({
  open,
  onOpenChange,
  opportunity,
  matchResult,
}: OpportunityApplyModalProps) {
  const { profile, careerReadiness, applyToOpportunity } = useAppState();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [eligibilityConfirmed, setEligibilityConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Application answers state
  const [coverNote, setCoverNote] = useState(
    `I am enthusiastic about applying for the ${opportunity?.title || "role"} at ${opportunity?.company || "your company"}. My declared competencies in ${opportunity?.requiredSkills.slice(0, 3).join(", ") || "core technologies"} and verified assessment track record align directly with your requirements.`,
  );
  const [featuredProject, setFeaturedProject] = useState(
    profile.projects?.[0]?.title || "Full-Stack Web App",
  );
  const [availability, setAvailability] = useState(
    profile.careerPreferences?.availability || "Immediate / 2 Weeks Notice",
  );

  if (!opportunity || !matchResult) return null;

  const handleNext = () => {
    if (step === 1 && !eligibilityConfirmed) {
      toast.error("Please confirm eligibility requirements before continuing.");
      return;
    }
    if (step < 4) setStep((s) => (s + 1) as 1 | 2 | 3 | 4);
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => (s - 1) as 1 | 2 | 3 | 4);
  };

  const handleSubmit = () => {
    const snapshot = applyToOpportunity(opportunity, {
      coverNote,
      featuredProject,
      availability,
    });

    if (snapshot) {
      setSubmitted(true);
      toast.success(`Application submitted successfully for ${opportunity.title}!`);
    } else {
      toast.info("You have already submitted an application for this opportunity.");
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setStep(1);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-white/10 bg-[#0A0E1A]/95 text-white p-0 backdrop-blur-2xl">
        {submitted ? (
          <div className="p-8 text-center space-y-6">
            <div className="mx-auto grid size-20 place-items-center rounded-3xl border border-emerald-500/40 bg-emerald-500/20 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="size-10" />
            </div>

            <div className="space-y-2">
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs">
                Immutable Snapshot Stored
              </Badge>
              <h3 className="font-display text-2xl font-bold text-white">
                Application Successfully Submitted!
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Your application package for <strong className="text-white">{opportunity.title}</strong> at{" "}
                <strong className="text-white">{opportunity.company}</strong> has been transmitted. Your
                verified match score ({matchResult.overallMatch}%) and Skill Passport snapshot have been recorded.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-400">Application Match Score:</span>
                <span className="font-bold text-indigo-300">{matchResult.overallMatch}% Match</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Career Readiness:</span>
                <span className="font-bold text-emerald-400">{careerReadiness.overallScore}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="font-semibold text-white">Applied (Under Review)</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button asChild className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold">
                <Link to="/student/applications">
                  <Briefcase className="size-3.5 mr-1.5" /> View Applications Pipeline
                </Link>
              </Button>
              <Button variant="outline" onClick={handleClose} className="border-white/10 text-xs text-slate-300">
                Done
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Modal Header & Stepper */}
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/60">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <Badge className="border-indigo-500/40 bg-indigo-500/20 text-indigo-300 text-[10px] mb-1">
                    Step {step} of 4 · AcadIn Application Gateway
                  </Badge>
                  <DialogTitle className="font-display text-xl font-bold text-white">
                    Apply to {opportunity.company}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-400">
                    {opportunity.title} · {opportunity.location} ({opportunity.compensation.formatted})
                  </DialogDescription>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-display text-lg font-bold text-indigo-300">
                    {matchResult.overallMatch}%
                  </span>
                  <p className="text-[10px] text-slate-400">Match Index</p>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="flex gap-2 mt-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1.5 flex-1 rounded-full transition-all duration-300",
                      step >= i ? "bg-indigo-500" : "bg-slate-800",
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Step 1: Eligibility Confirmation */}
            {step === 1 && (
              <div className="p-6 space-y-5">
                <div className="space-y-2">
                  <h4 className="font-display text-sm font-bold text-white flex items-center gap-2">
                    <GraduationCap className="size-4 text-indigo-400" />
                    Step 1: Verify Criteria & Eligibility
                  </h4>
                  <p className="text-xs text-slate-400">
                    AcadIn automatically verifies your academic credentials against {opportunity.company}'s requirements.
                  </p>
                </div>

                <div className="space-y-2">
                  {matchResult.eligibilityResult.passedCriteria.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-2xl border border-emerald-500/20 bg-emerald-950/10 text-xs"
                    >
                      <span className="text-emerald-300 flex items-center gap-2">
                        <Check className="size-4 text-emerald-400" /> {item}
                      </span>
                      <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px]">Verified</Badge>
                    </div>
                  ))}

                  {matchResult.eligibilityResult.disqualifyingCriteria.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-2xl border border-amber-500/30 bg-amber-950/20 text-xs"
                    >
                      <span className="text-amber-300 flex items-center gap-2">
                        <AlertTriangle className="size-4 text-amber-400" /> {item}
                      </span>
                      <Badge className="bg-amber-500/20 text-amber-400 text-[10px]">Criteria Note</Badge>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={eligibilityConfirmed}
                      onChange={(e) => setEligibilityConfirmed(e.target.checked)}
                      className="mt-0.5 size-4 rounded border-white/20 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-slate-300 leading-relaxed">
                      I confirm that my academic details (
                      <strong className="text-white">
                        {profile.academicProfile?.degree || profile.degree} · Batch{" "}
                        {profile.academicProfile?.graduationYear || profile.year || "2026"}
                      </strong>
                      ) and declared skills in my Skill Passport are authentic and up-to-date.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Step 2: Profile & Evidence Snapshot Review */}
            {step === 2 && (
              <div className="p-6 space-y-5">
                <div className="space-y-2">
                  <h4 className="font-display text-sm font-bold text-white flex items-center gap-2">
                    <User className="size-4 text-indigo-400" />
                    Step 2: Profile Snapshot Review
                  </h4>
                  <p className="text-xs text-slate-400">
                    This verified profile snapshot will be shared directly with {opportunity.company}'s recruitment team.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl border border-white/10 bg-slate-900/80 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Applicant</span>
                    <p className="font-bold text-white">{profile.name}</p>
                    <p className="text-slate-400">{profile.email || "student@university.edu"}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl border border-white/10 bg-slate-900/80 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Institution</span>
                    <p className="font-bold text-white truncate">
                      {profile.academicProfile?.institution || profile.college}
                    </p>
                    <p className="text-indigo-300">
                      {profile.academicProfile?.degree || profile.degree} in{" "}
                      {profile.academicProfile?.program || profile.branch}
                    </p>
                  </div>
                </div>

                {/* Skills Snapshot */}
                <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <ShieldCheck className="size-3.5 text-emerald-400" />
                      Skill Passport Snapshot ({(profile.declaredSkills ?? []).length} Skills)
                    </span>
                    <span className="text-indigo-300 font-semibold">
                      Readiness: {careerReadiness.overallScore}/100
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(profile.declaredSkills ?? []).map((s) => (
                      <Badge
                        key={s.name}
                        variant="outline"
                        className={cn(
                          "text-[10px]",
                          s.assessedScore !== undefined
                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                            : "border-slate-700 bg-slate-800 text-slate-400",
                        )}
                      >
                        {s.name} {s.assessedScore ? `(${s.assessedScore}%)` : ""}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Projects Snapshot */}
                <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 space-y-2 text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <FolderGit2 className="size-3.5 text-purple-400" />
                    Portfolio Projects Attached ({(profile.projects ?? []).length})
                  </span>
                  <div className="space-y-1">
                    {(profile.projects ?? []).map((p) => (
                      <div key={p.id} className="flex items-center justify-between text-slate-300">
                        <span className="font-medium truncate">{p.title}</span>
                        <span className="text-[11px] text-slate-500">{p.tech?.join(", ") || "Full-stack"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Application Questions */}
            {step === 3 && (
              <div className="p-6 space-y-5">
                <div className="space-y-2">
                  <h4 className="font-display text-sm font-bold text-white flex items-center gap-2">
                    <FileText className="size-4 text-indigo-400" />
                    Step 3: Role-Specific Application Responses
                  </h4>
                  <p className="text-xs text-slate-400">
                    Provide relevant context to help {opportunity.company}'s hiring manager evaluate your fit.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-300 font-semibold">
                      Statement of Interest / Cover Note
                    </Label>
                    <Textarea
                      rows={3}
                      value={coverNote}
                      onChange={(e) => setCoverNote(e.target.value)}
                      className="border-white/10 bg-slate-950 text-white text-xs"
                      placeholder="Explain why your technical background fits this opportunity..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-300 font-semibold">
                      Primary Featured Project
                    </Label>
                    <select
                      value={featuredProject}
                      onChange={(e) => setFeaturedProject(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 p-2.5 text-xs text-white"
                    >
                      {(profile.projects ?? []).map((p) => (
                        <option key={p.id} value={p.title}>
                          {p.title} ({p.tech?.join(", ") || "Full-Stack"})
                        </option>
                      ))}
                      <option value="Custom Portfolio Link">Full Skill Passport & GitHub Profile</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-300 font-semibold">
                      Joining Availability & Notice
                    </Label>
                    <Input
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      className="border-white/10 bg-slate-950 text-white text-xs"
                      placeholder="e.g. Immediate / Available for 6 months full-time"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Final Review & Submission */}
            {step === 4 && (
              <div className="p-6 space-y-5">
                <div className="space-y-2">
                  <h4 className="font-display text-sm font-bold text-white flex items-center gap-2">
                    <Send className="size-4 text-indigo-400" />
                    Step 4: Final Review & Confirmation
                  </h4>
                  <p className="text-xs text-slate-400">
                    Review your application payload. Once submitted, your profile snapshot and match score ({matchResult.overallMatch}%) are permanently locked for this application.
                  </p>
                </div>

                <div className="rounded-3xl border border-indigo-500/40 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/60 p-5 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-slate-400">Target Role</span>
                    <span className="font-bold text-white">{opportunity.title}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-slate-400">Company</span>
                    <span className="font-bold text-indigo-300">{opportunity.company}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-slate-400">Match Score Snapshot</span>
                    <span className="font-bold text-emerald-400">{matchResult.overallMatch}% ({matchResult.categoryTag})</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-slate-400">Career Readiness</span>
                    <span className="font-bold text-purple-300">{careerReadiness.overallScore}/100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Featured Project</span>
                    <span className="font-semibold text-white truncate max-w-[200px]">{featuredProject}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 italic">
                  By clicking "Submit Application", you authorize AcadIn to share your Skill Passport, assessment scores, and verified projects with {opportunity.company}.
                </p>
              </div>
            )}

            {/* Footer Navigation */}
            <DialogFooter className="p-6 border-t border-white/10 bg-slate-950 flex flex-row items-center justify-between sm:justify-between gap-3">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleBack}
                  className="border-white/10 text-xs text-slate-300"
                >
                  <ArrowLeft className="size-3.5 mr-1" /> Back
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClose}
                  className="border-white/10 text-xs text-slate-400"
                >
                  Cancel
                </Button>
              )}

              {step < 4 ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={handleNext}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs"
                >
                  Continue <ArrowRight className="size-3.5 ml-1" />
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-emerald-600 via-indigo-600 to-purple-600 text-white font-semibold text-xs shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                >
                  <Send className="size-3.5 mr-1.5" /> Submit Application
                </Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

