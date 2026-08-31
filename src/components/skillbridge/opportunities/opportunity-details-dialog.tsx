import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Award,
  Bookmark,
  BookmarkCheck,
  Briefcase,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  DollarSign,
  ExternalLink,
  FileCheck,
  GraduationCap,
  HelpCircle,
  IndianRupee,
  Layers,
  Lightbulb,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  X,
  Zap,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import { useAppState } from "@/context/app-state";
import type { Opportunity, OpportunityMatchResult } from "@/types/opportunity";

interface OpportunityDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opportunity: Opportunity | null;
  matchResult: OpportunityMatchResult | null;
  onOpenApply: (opportunity: Opportunity, match: OpportunityMatchResult) => void;
}

export function OpportunityDetailsDialog({
  open,
  onOpenChange,
  opportunity,
  matchResult,
  onOpenApply,
}: OpportunityDetailsDialogProps) {
  const { isOpportunitySaved, toggleSaveOpportunity, applicationSnapshots, applications } =
    useAppState();

  const [activeTab, setActiveTab] = useState<"overview" | "match" | "eligibility">("match");

  if (!opportunity || !matchResult) return null;

  const isSaved = isOpportunitySaved(opportunity.id);
  const hasApplied =
    applicationSnapshots.some((s) => s.opportunityId === opportunity.id) ||
    applications.some((a) => a.internshipId === opportunity.id);

  const {
    overallMatch,
    categoryTag,
    skillFit,
    eligibilityFit,
    careerFit,
    readinessFit,
    evidenceFit,
    preferenceFit,
    matchingSkills,
    missingSkills,
    whyYouMatch,
    whatIsMissing,
    whatWouldImproveYourMatch,
    eligibilityResult,
  } = matchResult;

  const typeColor = {
    Internship: "border-blue-500/40 bg-blue-500/15 text-blue-300",
    Job: "border-purple-500/40 bg-purple-500/15 text-purple-300",
    "Live Project": "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
    Apprenticeship: "border-amber-500/40 bg-amber-500/15 text-amber-300",
    "Training Program": "border-pink-500/40 bg-pink-500/15 text-pink-300",
  }[opportunity.type];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-white/10 bg-[#0A0E1A]/95 text-white p-0 backdrop-blur-2xl">
        {/* Header Hero */}
        <div className="p-6 sm:p-8 border-b border-white/10 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/60">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div
                className="grid size-16 place-items-center rounded-3xl border border-white/15 text-2xl font-black text-white shrink-0 shadow-lg"
                style={{
                  backgroundColor: `hsl(${opportunity.companyLogoHue || 220}, 75%, 25%)`,
                }}
              >
                {opportunity.company.charAt(0)}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-slate-300">
                    {opportunity.company}
                  </span>
                  <Badge variant="outline" className={cn("text-xs font-semibold", typeColor)}>
                    {opportunity.type}
                  </Badge>
                  {opportunity.companyWebsite && (
                    <a
                      href={opportunity.companyWebsite}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
                    >
                      Website <ExternalLink className="size-3" />
                    </a>
                  )}
                </div>

                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                  {opportunity.title}
                </h2>

                <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5 text-indigo-400" /> {opportunity.location} (
                    {opportunity.workMode})
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <IndianRupee className="size-3.5 text-emerald-400" />{" "}
                    {opportunity.compensation.formatted}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5 text-slate-400" /> {opportunity.duration}
                  </span>
                  <span>•</span>
                  <span>{opportunity.openings} Openings</span>
                </div>
              </div>
            </div>

            {/* Match Dial Card */}
            <div className="rounded-2xl border border-indigo-500/40 bg-slate-900/90 p-4 text-center shrink-0 shadow-lg min-w-[140px]">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Match Index
              </p>
              <p className="font-display text-3xl font-black text-indigo-300 mt-0.5">
                {overallMatch}%
              </p>
              <Badge
                className={cn(
                  "text-[10px] font-bold mt-1 px-2.5 py-0.5",
                  categoryTag === "Best Match"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : categoryTag === "Quick Win"
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                      : categoryTag === "Skill-Building"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                        : "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
                )}
              >
                {categoryTag}
              </Badge>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-6 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab("match")}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5",
                activeTab === "match"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-slate-900/60 text-slate-400 hover:text-white",
              )}
            >
              <Sparkles className="size-3.5" /> Match Intelligence
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5",
                activeTab === "overview"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-slate-900/60 text-slate-400 hover:text-white",
              )}
            >
              <Briefcase className="size-3.5" /> Role & Responsibilities
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("eligibility")}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5",
                activeTab === "eligibility"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-slate-900/60 text-slate-400 hover:text-white",
              )}
            >
              <GraduationCap className="size-3.5" /> Eligibility Audit
            </button>
          </div>
        </div>

        {/* Tab 1: Deep Match Intelligence */}
        {activeTab === "match" && (
          <div className="p-6 sm:p-8 space-y-6">
            {/* 6-Dimension Fit Score Breakdown */}
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="font-display text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="size-4 text-indigo-400" />
                  6-Dimensional Fit Assessment
                </h4>
                <span className="text-xs text-slate-400">Algorithmic Weighted Evaluation</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-2xl border border-white/5 bg-slate-900/80 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Skill Fit (35%)</span>
                    <span className="font-bold text-indigo-300">{skillFit}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${skillFit}%` }} />
                  </div>
                </div>

                <div className="p-3 rounded-2xl border border-white/5 bg-slate-900/80 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Career Trajectory (20%)</span>
                    <span className="font-bold text-purple-300">{careerFit}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${careerFit}%` }} />
                  </div>
                </div>

                <div className="p-3 rounded-2xl border border-white/5 bg-slate-900/80 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Career Readiness (20%)</span>
                    <span className="font-bold text-emerald-300">{readinessFit}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${readinessFit}%` }} />
                  </div>
                </div>

                <div className="p-3 rounded-2xl border border-white/5 bg-slate-900/80 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Eligibility Fit (15%)</span>
                    <span className="font-bold text-cyan-300">{eligibilityFit}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${eligibilityFit}%` }} />
                  </div>
                </div>

                <div className="p-3 rounded-2xl border border-white/5 bg-slate-900/80 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Evidence Trail (5%)</span>
                    <span className="font-bold text-amber-300">{evidenceFit}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${evidenceFit}%` }} />
                  </div>
                </div>

                <div className="p-3 rounded-2xl border border-white/5 bg-slate-900/80 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Work Preferences (5%)</span>
                    <span className="font-bold text-pink-300">{preferenceFit}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-pink-500 rounded-full" style={{ width: `${preferenceFit}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths & Missing Skills Breakdown */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Matching Skills */}
              <div className="rounded-3xl border border-emerald-500/30 bg-emerald-950/15 p-5 space-y-3">
                <h4 className="font-display text-sm font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="size-4" /> Demonstrated Skills ({matchingSkills.length})
                </h4>
                <div className="space-y-2">
                  {matchingSkills.map((skill) => (
                    <div
                      key={skill.name}
                      className="flex items-center justify-between text-xs p-2.5 rounded-xl border border-emerald-500/20 bg-slate-900/90"
                    >
                      <span className="font-semibold text-white">{skill.name}</span>
                      <div className="flex items-center gap-2">
                        {skill.isAssessed ? (
                          <Badge className="border-emerald-500/40 bg-emerald-500/20 text-emerald-300 text-[10px]">
                            Assessed: {skill.score}%
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-slate-700 bg-slate-800 text-slate-400 text-[10px]">
                            Self-Declared
                          </Badge>
                        )}
                        {skill.evidenceCount > 0 && (
                          <Badge variant="outline" className="border-indigo-500/30 text-indigo-300 text-[10px]">
                            {skill.evidenceCount} Proofs
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="rounded-3xl border border-amber-500/30 bg-amber-950/15 p-5 space-y-3">
                <h4 className="font-display text-sm font-bold text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="size-4" /> Missing Prerequisites ({missingSkills.length})
                </h4>
                {missingSkills.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">
                    No missing prerequisites! Your skill profile covers all required competencies.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {missingSkills.map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center justify-between text-xs p-2.5 rounded-xl border border-amber-500/20 bg-slate-900/90"
                      >
                        <span className="font-semibold text-slate-200">{skill}</span>
                        <Button asChild size="sm" variant="ghost" className="h-6 text-[10px] text-amber-400 hover:text-amber-300">
                          <Link to="/student/roadmap">
                            Add to Roadmap <ArrowRight className="size-3 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* AcadIn Explainable Match Narrative */}
            <div className="rounded-3xl border border-indigo-500/30 bg-slate-900/90 p-5 space-y-4">
              <h4 className="font-display text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="size-4 text-indigo-400" />
                Why This Opportunity Fits You
              </h4>

              <div className="space-y-2 text-xs">
                {whyYouMatch.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-300 leading-relaxed">
                    <Check className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              {whatIsMissing.length > 0 && (
                <div className="pt-3 border-t border-white/10 space-y-2">
                  <h5 className="font-bold text-xs text-amber-400">Identified Gaps to Close:</h5>
                  {whatIsMissing.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-400 text-xs">
                      <AlertTriangle className="size-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              )}

              {whatWouldImproveYourMatch.length > 0 && (
                <div className="pt-3 border-t border-white/10 space-y-2">
                  <h5 className="font-bold text-xs text-indigo-300">Recommended Action Plan:</h5>
                  {whatWouldImproveYourMatch.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-indigo-200 text-xs">
                      <Zap className="size-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Role & Responsibilities */}
        {activeTab === "overview" && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-3">
              <h4 className="font-display text-base font-bold text-white">About the Role</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{opportunity.description}</p>
            </div>

            <div className="space-y-3">
              <h4 className="font-display text-base font-bold text-white">Core Responsibilities</h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {opportunity.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="size-1.5 rounded-full bg-indigo-400 shrink-0 mt-1.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Live Project Special Extension */}
            {opportunity.liveProjectDetails && (
              <div className="rounded-3xl border border-emerald-500/30 bg-emerald-950/15 p-5 space-y-3">
                <h4 className="font-display text-sm font-bold text-emerald-300 flex items-center gap-2">
                  <Users className="size-4" /> Live Industry Project Specs
                </h4>
                <div className="grid gap-3 sm:grid-cols-2 text-xs">
                  <div>
                    <span className="text-slate-400">Industry Mentor:</span>
                    <p className="font-semibold text-white mt-0.5">
                      {opportunity.liveProjectDetails.mentorName} (
                      {opportunity.liveProjectDetails.mentorRole})
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Team Structure:</span>
                    <p className="font-semibold text-white mt-0.5">
                      {opportunity.liveProjectDetails.teamSize} · ~
                      {opportunity.liveProjectDetails.weeklyCommitmentHours} hrs/week
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 space-y-1.5">
                  <span className="text-slate-400 text-xs">Key Deliverables:</span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {opportunity.liveProjectDetails.deliverables.map((deliv, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="size-3 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{deliv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Training Special Extension */}
            {opportunity.trainingDetails && (
              <div className="rounded-3xl border border-pink-500/30 bg-pink-950/15 p-5 space-y-3">
                <h4 className="font-display text-sm font-bold text-pink-300 flex items-center gap-2">
                  <Award className="size-4" /> Training & Certification Curriculum
                </h4>
                <div className="space-y-2 text-xs">
                  <p className="text-slate-300">
                    <strong className="text-white">Certification:</strong>{" "}
                    {opportunity.trainingDetails.certificationName}
                  </p>
                  <p className="text-slate-300">
                    <strong className="text-white">Skills Taught:</strong>{" "}
                    {opportunity.trainingDetails.skillsTaught.join(", ")}
                  </p>
                  <p className="text-slate-300">
                    <strong className="text-white">Outcome:</strong>{" "}
                    {opportunity.trainingDetails.completionOutcome}
                  </p>
                </div>
              </div>
            )}

            {/* Hiring Process */}
            <div className="space-y-3">
              <h4 className="font-display text-base font-bold text-white">Selection & Hiring Pipeline</h4>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {opportunity.hiringProcess.map((step, idx) => (
                  <div key={step} className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900 px-3 py-2 text-xs">
                      <span className="grid size-5 place-items-center rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-slate-200">{step}</span>
                    </div>
                    {idx < opportunity.hiringProcess.length - 1 && (
                      <ArrowRight className="size-3.5 text-slate-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Eligibility Audit */}
        {activeTab === "eligibility" && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h4 className="font-display text-lg font-bold text-white flex items-center gap-2">
                  <GraduationCap className="size-5 text-indigo-400" />
                  Academic & Cohort Eligibility Audit
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Automated verification comparing your university profile against corporate criteria.
                </p>
              </div>

              {eligibilityResult.isEligible ? (
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs py-1">
                  <CheckCircle2 className="size-3.5 mr-1" /> Eligible to Apply
                </Badge>
              ) : (
                <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/40 text-xs py-1">
                  <ShieldAlert className="size-3.5 mr-1" /> Disqualification Flagged
                </Badge>
              )}
            </div>

            {/* Criteria Breakdown */}
            <div className="space-y-3">
              <h5 className="font-bold text-xs uppercase text-slate-400">Verified Criteria</h5>
              {eligibilityResult.passedCriteria.map((crit, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-2xl border border-emerald-500/20 bg-emerald-950/10 text-xs"
                >
                  <span className="text-emerald-300 flex items-center gap-2">
                    <Check className="size-4 text-emerald-400" /> {crit}
                  </span>
                  <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px]">Passed</Badge>
                </div>
              ))}

              {eligibilityResult.disqualifyingCriteria.map((crit, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-2xl border border-rose-500/30 bg-rose-950/20 text-xs"
                >
                  <span className="text-rose-300 flex items-center gap-2">
                    <X className="size-4 text-rose-400" /> {crit}
                  </span>
                  <Badge className="bg-rose-500/20 text-rose-400 text-[10px]">Disqualified</Badge>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-4 text-xs text-slate-400 space-y-1">
              <p className="font-semibold text-white">AcadIn Fair Evaluation Policy</p>
              <p className="leading-relaxed">
                Even if an academic filter is missing, you can view the complete opportunity details to
                understand corporate recruitment requirements and align your future roadmap milestones.
              </p>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <DialogFooter className="p-6 border-t border-white/10 bg-slate-950 flex flex-row items-center justify-between sm:justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => toggleSaveOpportunity(opportunity.id)}
            className={cn(
              "text-xs border-white/10",
              isSaved ? "text-indigo-400 border-indigo-500/40 bg-indigo-500/15" : "text-slate-300",
            )}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="size-3.5 mr-1 text-indigo-400" /> Saved to Shortlist
              </>
            ) : (
              <>
                <Bookmark className="size-3.5 mr-1" /> Save for Later
              </>
            )}
          </Button>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-white/10 text-xs text-slate-400 hover:text-white"
            >
              Close
            </Button>

            {hasApplied ? (
              <Badge className="border-emerald-500/40 bg-emerald-500/20 text-emerald-300 text-xs py-2 px-4">
                <Check className="size-3.5 mr-1.5" /> Already Applied
              </Badge>
            ) : (
              <Button
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  onOpenApply(opportunity, matchResult);
                }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xs shadow-md"
              >
                Proceed to Apply <ArrowRight className="size-3.5 ml-1.5" />
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

