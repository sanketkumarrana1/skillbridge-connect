import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
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
  GraduationCap,
  IndianRupee,
  Layers,
  MapPin,
  Sparkles,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppState } from "@/context/app-state";
import type { Opportunity, OpportunityMatchResult } from "@/types/opportunity";

interface OpportunityCardProps {
  opportunity: Opportunity;
  matchResult: OpportunityMatchResult;
  onOpenDetails: (opportunity: Opportunity, match: OpportunityMatchResult) => void;
  onOpenApply: (opportunity: Opportunity, match: OpportunityMatchResult) => void;
}

export function OpportunityCard({
  opportunity,
  matchResult,
  onOpenDetails,
  onOpenApply,
}: OpportunityCardProps) {
  const { isOpportunitySaved, toggleSaveOpportunity, applicationSnapshots, applications } =
    useAppState();

  const isSaved = isOpportunitySaved(opportunity.id);
  const hasApplied =
    applicationSnapshots.some((s) => s.opportunityId === opportunity.id) ||
    applications.some((a) => a.internshipId === opportunity.id);

  const { overallMatch, categoryTag, matchingSkills, missingSkills, eligibilityResult } =
    matchResult;

  const categoryConfig = {
    "Best Match": {
      badge: "border-emerald-500/50 bg-emerald-500/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]",
      dial: "border-emerald-400 text-emerald-300 bg-emerald-500/10",
      label: "Best Match",
    },
    "Quick Win": {
      badge: "border-cyan-500/50 bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]",
      dial: "border-cyan-400 text-cyan-300 bg-cyan-500/10",
      label: "Quick Win",
    },
    "Skill-Building": {
      badge: "border-amber-500/50 bg-amber-500/20 text-amber-300",
      dial: "border-amber-400 text-amber-300 bg-amber-500/10",
      label: "Skill-Building",
    },
    "General Match": {
      badge: "border-indigo-500/40 bg-indigo-500/15 text-indigo-300",
      dial: "border-indigo-400 text-indigo-300 bg-indigo-500/10",
      label: "General",
    },
    "Not Eligible": {
      badge: "border-rose-500/40 bg-rose-500/15 text-rose-300",
      dial: "border-rose-400 text-rose-300 bg-rose-500/10",
      label: "Ineligible",
    },
  }[categoryTag];

  const typeColor = {
    Internship: "border-blue-500/40 bg-blue-500/15 text-blue-300",
    Job: "border-purple-500/40 bg-purple-500/15 text-purple-300",
    "Live Project": "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
    Apprenticeship: "border-amber-500/40 bg-amber-500/15 text-amber-300",
    "Training Program": "border-pink-500/40 bg-pink-500/15 text-pink-300",
  }[opportunity.type];

  const deadlineDate = new Date(opportunity.applicationDeadline);
  const isClosingSoon =
    !isNaN(deadlineDate.getTime()) &&
    deadlineDate.getTime() - Date.now() < 1000 * 60 * 60 * 24 * 7;

  return (
    <div className="glass-card-interactive rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 border border-white/10 hover:border-indigo-500/40 hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]">
      <div className="space-y-4">
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div
              className="grid size-12 place-items-center rounded-2xl border border-white/15 text-lg font-black text-white shrink-0 shadow-inner"
              style={{
                backgroundColor: `hsl(${opportunity.companyLogoHue || 220}, 75%, 25%)`,
              }}
            >
              {opportunity.company.charAt(0)}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-slate-400 truncate">
                  {opportunity.company}
                </span>
                <Badge variant="outline" className={cn("text-[10px] font-semibold py-0.5", typeColor)}>
                  {opportunity.type}
                </Badge>
                {isClosingSoon && (
                  <Badge variant="outline" className="border-rose-500/40 bg-rose-500/15 text-rose-300 text-[10px]">
                    Closing Soon
                  </Badge>
                )}
              </div>
              <h3 className="font-display text-lg font-bold text-white tracking-tight mt-0.5 line-clamp-1">
                {opportunity.title}
              </h3>
            </div>
          </div>

          {/* Match Dial */}
          <div className="flex flex-col items-end shrink-0">
            <div
              className={cn(
                "grid size-12 place-items-center rounded-2xl border-2 font-display text-sm font-black shadow-sm",
                categoryConfig.dial,
              )}
            >
              <span>{overallMatch}%</span>
            </div>
            <Badge
              variant="outline"
              className={cn("text-[9px] font-bold mt-1.5 uppercase", categoryConfig.badge)}
            >
              {categoryConfig.label}
            </Badge>
          </div>
        </div>

        {/* Key Role Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 rounded-2xl border border-white/5 bg-slate-950/60 p-3 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 truncate">
            <IndianRupee className="size-3.5 text-emerald-400 shrink-0" />
            <span className="font-semibold text-white truncate">{opportunity.compensation.formatted}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="size-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">{opportunity.workMode}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate col-span-2 sm:col-span-1">
            <Clock className="size-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{opportunity.duration}</span>
          </div>
        </div>

        {/* Opportunity Short Description */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {opportunity.description}
        </p>

        {/* Live Matching & Missing Skills Showcase */}
        <div className="space-y-2 pt-1 border-t border-white/5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Skill Competency Fit</span>
            <span className="font-semibold text-indigo-300">{matchResult.skillFit}% Fit</span>
          </div>

          <div className="flex flex-wrap gap-1">
            {matchingSkills.slice(0, 3).map((s) => (
              <span
                key={s.name}
                className="inline-flex items-center gap-1 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300"
              >
                <Check className="size-2.5" />
                {s.name} {s.score ? `(${s.score}%)` : ""}
              </span>
            ))}
            {missingSkills.slice(0, 2).map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1 rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-300"
              >
                <AlertTriangle className="size-2.5" />
                {s}
              </span>
            ))}
            {matchingSkills.length + missingSkills.length > 5 && (
              <span className="text-[10px] text-slate-500 self-center">
                +{matchingSkills.length + missingSkills.length - 5} more
              </span>
            )}
          </div>
        </div>

        {/* Eligibility Check Pill */}
        <div className="flex items-center justify-between text-[11px] pt-1">
          <span className="text-slate-500 flex items-center gap-1">
            <Calendar className="size-3" /> Apply by {opportunity.applicationDeadline}
          </span>
          {eligibilityResult.isEligible ? (
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="size-3" /> 100% Eligible
            </span>
          ) : (
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              <AlertTriangle className="size-3" /> Not Eligible
            </span>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
        <Button
          size="sm"
          variant="outline"
          onClick={() => toggleSaveOpportunity(opportunity.id)}
          className={cn(
            "text-xs px-2.5 border-white/10",
            isSaved ? "text-indigo-400 border-indigo-500/40 bg-indigo-500/15" : "text-slate-400 hover:text-white",
          )}
        >
          {isSaved ? (
            <>
              <BookmarkCheck className="size-3.5 mr-1 text-indigo-400" /> Saved
            </>
          ) : (
            <>
              <Bookmark className="size-3.5 mr-1" /> Save
            </>
          )}
        </Button>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onOpenDetails(opportunity, matchResult)}
            className="border-white/10 bg-slate-900/60 text-slate-300 hover:text-white text-xs"
          >
            Match Details
          </Button>

          {hasApplied ? (
            <Badge className="border-emerald-500/40 bg-emerald-500/20 text-emerald-300 text-xs py-1.5 px-3">
              <Check className="size-3.5 mr-1" /> Applied
            </Badge>
          ) : (
            <Button
              size="sm"
              onClick={() => onOpenApply(opportunity, matchResult)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xs shadow-md"
            >
              Apply Now <ArrowRight className="size-3.5 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

