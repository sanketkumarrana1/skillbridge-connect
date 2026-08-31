import { useState, useMemo } from "react";
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
  CheckCircle2,
  Clock,
  Compass,
  Filter,
  GraduationCap,
  Layers,
  MapPin,
  Plus,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAppState } from "@/context/app-state";
import { OpportunityCard } from "./opportunity-card";
import { OpportunityDetailsDialog } from "./opportunity-details-dialog";
import { OpportunityApplyModal } from "./opportunity-apply-modal";
import type {
  Opportunity,
  OpportunityMatchResult,
  OpportunityType,
  OpportunityWorkMode,
} from "@/types/opportunity";

interface OpportunityMarketplaceProps {
  initialTypeFilter?: OpportunityType | "All";
  initialTitle?: string;
  initialEyebrow?: string;
}

export function OpportunityMarketplace({
  initialTypeFilter = "All",
  initialTitle = "Opportunity Intelligence Marketplace",
  initialEyebrow = "AcadIn Opportunity Network",
}: OpportunityMarketplaceProps) {
  const {
    opportunities,
    rankedOpportunities,
    bestMatchOpportunities,
    quickWinOpportunities,
    skillBuildingOpportunities,
    liveProjectOpportunities,
    trainingOpportunities,
    savedOpportunityIds,
    isOpportunitySaved,
    profile,
    careerReadiness,
  } = useAppState();

  // Search and Filters
  const [query, setQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<
    "recommended" | "all" | "live_projects" | "training" | "saved" | "closing_soon"
  >("recommended");
  const [typeFilter, setTypeFilter] = useState<OpportunityType | "All">(initialTypeFilter);
  const [workModeFilter, setWorkModeFilter] = useState<OpportunityWorkMode | "All">("All");
  const [experienceFilter, setExperienceFilter] = useState<string>("All");
  const [onlyEligible, setOnlyEligible] = useState<boolean>(false);
  const [locationQuery, setLocationQuery] = useState<string>("");

  // Modal Dialog States
  const [selectedOppForDetails, setSelectedOppForDetails] = useState<Opportunity | null>(null);
  const [selectedMatchForDetails, setSelectedMatchForDetails] =
    useState<OpportunityMatchResult | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [selectedOppForApply, setSelectedOppForApply] = useState<Opportunity | null>(null);
  const [selectedMatchForApply, setSelectedMatchForApply] =
    useState<OpportunityMatchResult | null>(null);
  const [applyOpen, setApplyOpen] = useState(false);

  const handleOpenDetails = (opp: Opportunity, match: OpportunityMatchResult) => {
    setSelectedOppForDetails(opp);
    setSelectedMatchForDetails(match);
    setDetailsOpen(true);
  };

  const handleOpenApply = (opp: Opportunity, match: OpportunityMatchResult) => {
    setSelectedOppForApply(opp);
    setSelectedMatchForApply(match);
    setApplyOpen(true);
  };

  // Filter and search logic
  const filteredRankedOpportunities = useMemo(() => {
    return rankedOpportunities.filter(({ opportunity: opp, match }) => {
      // 1. Tab filter
      if (selectedTab === "saved" && !isOpportunitySaved(opp.id)) return false;
      if (selectedTab === "live_projects" && opp.type !== "Live Project") return false;
      if (selectedTab === "training" && opp.type !== "Training Program") return false;
      if (selectedTab === "closing_soon") {
        const d = new Date(opp.applicationDeadline);
        const isSoon = !isNaN(d.getTime()) && d.getTime() - Date.now() < 1000 * 60 * 60 * 24 * 14;
        if (!isSoon) return false;
      }

      // 2. Type Filter
      if (typeFilter !== "All" && opp.type !== typeFilter) return false;

      // 3. Work Mode Filter
      if (workModeFilter !== "All" && opp.workMode !== workModeFilter) return false;

      // 4. Experience Filter
      if (experienceFilter !== "All" && opp.experienceLevel !== experienceFilter) return false;

      // 5. Only Eligible Filter
      if (onlyEligible && !match.eligibilityResult.isEligible) return false;

      // 6. Location Query
      if (
        locationQuery.trim() &&
        !opp.location.toLowerCase().includes(locationQuery.trim().toLowerCase()) &&
        !opp.workMode.toLowerCase().includes(locationQuery.trim().toLowerCase())
      ) {
        return false;
      }

      // 7. Global Search Query
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const matchesTitle = opp.title.toLowerCase().includes(q);
        const matchesCompany = opp.company.toLowerCase().includes(q);
        const matchesDomain = opp.domain.toLowerCase().includes(q);
        const matchesSkills = opp.requiredSkills.some((s) => s.toLowerCase().includes(q));
        const matchesCategory = opp.category.toLowerCase().includes(q);
        if (
          !matchesTitle &&
          !matchesCompany &&
          !matchesDomain &&
          !matchesSkills &&
          !matchesCategory
        ) {
          return false;
        }
      }

      return true;
    });
  }, [
    rankedOpportunities,
    selectedTab,
    typeFilter,
    workModeFilter,
    experienceFilter,
    onlyEligible,
    locationQuery,
    query,
    isOpportunitySaved,
  ]);

  const savedCount = savedOpportunityIds.length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <Badge className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs px-3 py-1">
            <Sparkles className="size-3.5 mr-1.5" /> Stage 4 · Multi-Dimensional Opportunity Intelligence
          </Badge>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {initialTitle}
          </h1>
          <p className="mt-1.5 text-sm text-slate-400 max-w-2xl">
            AI-driven matching grounded in your verified Skill Passport, adaptive assessment scores,
            and Stage 3 Career Readiness index.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 text-xs"
          >
            <Link to="/student/applications">
              <Briefcase className="size-3.5 mr-1.5" /> Track Applications
            </Link>
          </Button>
          <Button
            asChild
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
          >
            <Link to="/student/analysis">
              <Target className="size-3.5 mr-1.5" /> Skill Gap Intelligence
            </Link>
          </Button>
        </div>
      </div>

      {/* Target Role & Readiness Callout Pill */}
      <div className="rounded-3xl border border-indigo-500/40 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/60 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="grid size-12 place-items-center rounded-2xl border border-indigo-400 bg-indigo-500/20 text-indigo-300 font-bold text-sm">
            {careerReadiness.overallScore}%
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold">Active Matching Profile:</p>
            <p className="font-display text-base font-bold text-white">
              {profile.careerPreferences?.targetRoles?.[0] || "Full Stack Developer"} ·{" "}
              {careerReadiness.tier} ({profile.academicProfile?.degree || profile.degree})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs">
            {bestMatchOpportunities.length} Best Matches
          </Badge>
          <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 text-xs">
            {quickWinOpportunities.length} Quick Wins
          </Badge>
          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-xs">
            {skillBuildingOpportunities.length} Skill-Building Roles
          </Badge>
        </div>
      </div>

      {/* Main View Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">
        <button
          type="button"
          onClick={() => setSelectedTab("recommended")}
          className={cn(
            "px-4 py-2 rounded-2xl text-xs font-semibold transition shrink-0 flex items-center gap-1.5",
            selectedTab === "recommended"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-slate-900/60 text-slate-400 hover:text-white",
          )}
        >
          <Sparkles className="size-3.5" /> Recommended for You
        </button>

        <button
          type="button"
          onClick={() => setSelectedTab("all")}
          className={cn(
            "px-4 py-2 rounded-2xl text-xs font-semibold transition shrink-0 flex items-center gap-1.5",
            selectedTab === "all"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-slate-900/60 text-slate-400 hover:text-white",
          )}
        >
          <Layers className="size-3.5" /> All Opportunities ({rankedOpportunities.length})
        </button>

        <button
          type="button"
          onClick={() => setSelectedTab("live_projects")}
          className={cn(
            "px-4 py-2 rounded-2xl text-xs font-semibold transition shrink-0 flex items-center gap-1.5",
            selectedTab === "live_projects"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-slate-900/60 text-slate-400 hover:text-white",
          )}
        >
          <Users className="size-3.5" /> Live Industry Projects ({liveProjectOpportunities.length})
        </button>

        <button
          type="button"
          onClick={() => setSelectedTab("training")}
          className={cn(
            "px-4 py-2 rounded-2xl text-xs font-semibold transition shrink-0 flex items-center gap-1.5",
            selectedTab === "training"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-slate-900/60 text-slate-400 hover:text-white",
          )}
        >
          <Award className="size-3.5" /> Training & Bootcamps ({trainingOpportunities.length})
        </button>

        <button
          type="button"
          onClick={() => setSelectedTab("saved")}
          className={cn(
            "px-4 py-2 rounded-2xl text-xs font-semibold transition shrink-0 flex items-center gap-1.5",
            selectedTab === "saved"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-slate-900/60 text-slate-400 hover:text-white",
          )}
        >
          <Bookmark className="size-3.5" /> Saved ({savedCount})
        </button>

        <button
          type="button"
          onClick={() => setSelectedTab("closing_soon")}
          className={cn(
            "px-4 py-2 rounded-2xl text-xs font-semibold transition shrink-0 flex items-center gap-1.5",
            selectedTab === "closing_soon"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-slate-900/60 text-slate-400 hover:text-white",
          )}
        >
          <Clock className="size-3.5 text-rose-400" /> Closing Soon
        </button>
      </div>

      {/* Search & Comprehensive Multi-Filters Panel */}
      <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 sm:p-5 space-y-4">
        <div className="grid gap-3 sm:grid-cols-12">
          {/* Main Search */}
          <div className="relative sm:col-span-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by skill, role, domain, or company (e.g. React, Razorpay, Node.js)..."
              className="pl-10 border-white/10 bg-slate-900/90 text-white text-xs placeholder:text-slate-500 rounded-2xl"
            />
          </div>

          {/* Location / WorkMode Input */}
          <div className="relative sm:col-span-3">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder="Location / City..."
              className="pl-10 border-white/10 bg-slate-900/90 text-white text-xs placeholder:text-slate-500 rounded-2xl"
            />
          </div>

          {/* Opportunity Type Select */}
          <div className="sm:col-span-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as OpportunityType | "All")}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/90 p-2.5 text-xs text-white"
            >
              <option value="All">All Opportunity Types</option>
              <option value="Internship">Internships Only</option>
              <option value="Job">Full-Time Jobs Only</option>
              <option value="Live Project">Live Industry Projects</option>
              <option value="Apprenticeship">Apprenticeships</option>
              <option value="Training Program">Training Programs</option>
            </select>
          </div>
        </div>

        {/* Second Row Quick Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-500 font-semibold flex items-center gap-1">
              <SlidersHorizontal className="size-3.5" /> Work Mode:
            </span>
            {(["All", "Remote", "Hybrid", "On-site"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setWorkModeFilter(mode)}
                className={cn(
                  "px-3 py-1 rounded-xl text-xs transition",
                  workModeFilter === mode
                    ? "bg-indigo-600 text-white font-semibold"
                    : "bg-slate-900 border border-white/10 text-slate-400 hover:text-white",
                )}
              >
                {mode}
              </button>
            ))}

            <span className="h-4 w-px bg-white/10 mx-1 hidden sm:block" />

            <span className="text-slate-500 font-semibold hidden sm:inline">Experience:</span>
            {(["All", "Fresher", "0-1 yr"] as const).map((exp) => (
              <button
                key={exp}
                type="button"
                onClick={() => setExperienceFilter(exp)}
                className={cn(
                  "px-3 py-1 rounded-xl text-xs transition hidden sm:inline-block",
                  experienceFilter === exp
                    ? "bg-indigo-600 text-white font-semibold"
                    : "bg-slate-900 border border-white/10 text-slate-400 hover:text-white",
                )}
              >
                {exp}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={onlyEligible}
                onChange={(e) => setOnlyEligible(e.target.checked)}
                className="size-3.5 rounded border-white/20 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-medium text-emerald-400">100% Eligible Only</span>
            </label>

            {(query ||
              locationQuery ||
              typeFilter !== "All" ||
              workModeFilter !== "All" ||
              experienceFilter !== "All" ||
              onlyEligible) && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setLocationQuery("");
                  setTypeFilter("All");
                  setWorkModeFilter("All");
                  setExperienceFilter("All");
                  setOnlyEligible(false);
                }}
                className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1"
              >
                <RotateCcw className="size-3" /> Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Results */}
      {filteredRankedOpportunities.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center space-y-4">
          <Search className="mx-auto size-12 text-slate-500" />
          <h3 className="font-display text-lg font-bold text-white">No Opportunities Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            No opportunities match your selected filters. Try broadening your keywords or clearing
            filters.
          </p>
          <Button
            onClick={() => {
              setQuery("");
              setLocationQuery("");
              setTypeFilter("All");
              setWorkModeFilter("All");
              setExperienceFilter("All");
              setOnlyEligible(false);
              setSelectedTab("recommended");
            }}
            variant="outline"
            className="border-white/10 text-xs"
          >
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredRankedOpportunities.map(({ opportunity, match }) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              matchResult={match}
              onOpenDetails={handleOpenDetails}
              onOpenApply={handleOpenApply}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <OpportunityDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        opportunity={selectedOppForDetails}
        matchResult={selectedMatchForDetails}
        onOpenApply={handleOpenApply}
      />

      <OpportunityApplyModal
        open={applyOpen}
        onOpenChange={setApplyOpen}
        opportunity={selectedOppForApply}
        matchResult={selectedMatchForApply}
      />
    </div>
  );
}

