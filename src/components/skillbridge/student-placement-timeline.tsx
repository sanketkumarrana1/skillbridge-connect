import { useState, useMemo } from "react";
import {
  AlertCircle,
  Award,
  BadgeCheck,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck,
  GraduationCap,
  History,
  Layers,
  MapPin,
  Sparkles,
  UserCheck,
  Video,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppState } from "@/context/app-state";
import { cn } from "@/lib/utils";
import type { Application, CorporateOffer, PlacementHistoryItem } from "@/types";

const STAGES = [
  { key: "Applied", label: "Applied" },
  { key: "Under Review", label: "Under Review" },
  { key: "Shortlisted", label: "Shortlisted" },
  { key: "Interview Scheduled", label: "Interview" },
  { key: "Offered", label: "Offer Extended" },
  { key: "Hired", label: "Hired / Selected" },
];

function getStageIndex(status: string): number {
  switch (status) {
    case "Applied":
      return 0;
    case "Under Review":
      return 1;
    case "Shortlisted":
      return 2;
    case "Assessment Scheduled":
    case "Assessment Completed":
    case "Interview Scheduled":
    case "Interview Completed":
      return 3;
    case "Offered":
      return 4;
    case "Hired":
      return 5;
    default:
      return 0;
  }
}

export function StudentPlacementTimeline() {
  const {
    profile,
    applications,
    corporateOffers,
    placementHistory,
    acceptCorporateOfferAndHire,
    declineCorporateOffer,
  } = useAppState();

  const [selectedOffer, setSelectedOffer] = useState<CorporateOffer | null>(null);

  // Active offers that need response
  const pendingOffers = useMemo(() => {
    return corporateOffers.filter((o) => o.status === "Sent" || o.status === "Draft");
  }, [corporateOffers]);

  // Active placements
  const acceptedOffers = useMemo(() => {
    return corporateOffers.filter((o) => o.status === "Accepted");
  }, [corporateOffers]);

  const handleAcceptOffer = (offer: CorporateOffer) => {
    acceptCorporateOfferAndHire(offer.id);
    toast.success(`🎉 Congratulations! You have accepted the offer from ${offer.company}!`);
    setSelectedOffer(null);
  };

  const handleDeclineOffer = (offer: CorporateOffer) => {
    declineCorporateOffer(offer.id, "Candidate opted for alternate opportunity");
    toast.info(`You have declined the offer from ${offer.company}.`);
    setSelectedOffer(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Badge className="border-indigo-500/30 bg-indigo-500/15 text-indigo-300 font-semibold mb-2">
              <Sparkles className="size-3 mr-1.5" /> Synchronous Placement Tracker
            </Badge>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Recruitment Journey & Timeline
            </h1>
            <p className="mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed">
              Track the exact real-time progression of your campus and corporate applications, view
              interviews, review compensation packages, and manage official offers.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-3.5 text-center">
              <p className="text-2xl font-bold text-white">{applications.length}</p>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Active Tracks</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-3.5 text-center">
              <p className="text-2xl font-bold text-amber-400">{pendingOffers.length}</p>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Pending Offers</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-3.5 text-center">
              <p className="text-2xl font-bold text-emerald-400">{placementHistory.length}</p>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Verified Hires</p>
            </div>
          </div>
        </div>
      </div>

      {/* PENDING OFFERS ALERT SECTION */}
      {pendingOffers.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-amber-400" />
            <h2 className="font-display text-base font-bold text-white">
              Action Required: Official Corporate Offers
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {pendingOffers.map((offer) => (
              <Card
                key={offer.id}
                className="relative overflow-hidden rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-900 p-5 shadow-[0_0_30px_rgba(245,158,11,0.15)] space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
                      ✨ Official Offer Extended
                    </Badge>
                    <h3 className="font-display font-extrabold text-xl text-white mt-2">
                      {offer.designation}
                    </h3>
                    <p className="text-sm font-semibold text-slate-300 flex items-center gap-1.5 mt-0.5">
                      <Building2 className="size-4 text-amber-400" /> {offer.company}
                    </p>
                  </div>

                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-right">
                    <p className="text-[11px] text-amber-300 font-medium">Compensation</p>
                    <p className="text-sm font-extrabold text-white">{offer.compensation}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 rounded-xl border border-white/10 bg-slate-950/60 p-3 text-xs">
                  <div>
                    <p className="text-slate-400">Joining Date</p>
                    <p className="font-semibold text-slate-200 mt-0.5">{offer.joiningDate}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Offer Validity</p>
                    <p className="font-semibold text-rose-300 mt-0.5">Expires: {offer.offerExpiry}</p>
                  </div>
                </div>

                {offer.terms && (
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Terms & Highlights
                    </p>
                    <p className="text-xs text-slate-300 bg-slate-950/80 p-2.5 rounded-lg border border-white/10">
                      {offer.terms}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                  <Button
                    size="sm"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-9 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    onClick={() => handleAcceptOffer(offer)}
                  >
                    <CheckCircle2 className="size-4 mr-1.5" /> Accept Offer & Finalize
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-rose-500/30 text-rose-300 hover:bg-rose-500/10 text-xs h-9"
                    onClick={() => handleDeclineOffer(offer)}
                  >
                    <XCircle className="size-4 mr-1.5" /> Decline
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ACTIVE RECRUITMENT PIPELINE TIMELINES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="size-4 text-indigo-400" />
            <h2 className="font-display text-base font-bold text-white">
              Active Application Lifecycles ({applications.length})
            </h2>
          </div>
          <span className="text-xs text-slate-400">Synchronized with Recruiter ATS</span>
        </div>

        <div className="space-y-4">
          {applications.map((app) => {
            const currentStageIndex = getStageIndex(app.status);
            const isHired = app.status === "Hired";
            const isRejected = app.status === "Rejected";
        {applications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center space-y-3 bg-slate-900/40">
            <Layers className="size-10 text-slate-500 mx-auto" />
            <h3 className="text-sm font-semibold text-white">No active applications in progress</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              When you apply to internships or jobs, your multi-stage hiring progress, interviews, and corporate offers will update here in real time.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 text-xs border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10"
              onClick={() => (window.location.href = "/student/internships")}
            >
              Explore Verified Opportunities
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => {
              const currentStageIndex = getStageIndex(app.status);
              const isHired = app.status === "Hired";
              const isRejected = app.status === "Rejected";

            return (
              <Card
                key={app.id}
                className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-6 hover:border-indigo-500/30 transition-all"
              >
              return (
                <Card
                  key={app.id}
                  className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-6 hover:border-indigo-500/30 transition-all"
                >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-xl bg-indigo-900/50 border border-indigo-500/30 flex items-center justify-center text-white font-bold">
                      <Building2 className="size-6 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-white leading-tight">
                        {app.internship}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {app.company} · Applied on {app.appliedDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      className={cn(
                        "text-xs font-semibold px-3 py-1",
                        isHired && "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
                        isRejected && "border-rose-500/30 bg-rose-500/15 text-rose-300",
                        !isHired &&
                          !isRejected &&
                          "border-indigo-500/30 bg-indigo-500/15 text-indigo-300",
                      )}
                    >
                      {isHired ? (
                        <>
                          <CheckCircle2 className="size-3 mr-1" /> Hired & Selected
                        </>
                      ) : isRejected ? (
                        <>
                          <XCircle className="size-3 mr-1" /> Unsuccessful
                        </>
                      ) : (
                        app.status
                      )}
                    </Badge>
                  </div>
                </div>

                {/* Multi-step Visual Pipeline Timeline */}
                <div className="pt-2">
                  <div className="relative flex items-center justify-between">
                    {/* Background Progress Track */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-800 rounded-full" />
                    <div
                      className={cn(
                        "absolute left-0 top-1/2 -translate-y-1/2 h-1 rounded-full transition-all duration-500",
                        isHired ? "bg-emerald-500" : isRejected ? "bg-rose-500" : "bg-indigo-500",
                      )}
                      style={{
                        width: isRejected
                          ? "100%"
                          : `${(Math.min(currentStageIndex, 5) / 5) * 100}%`,
                      }}
                    />

                    {/* Stage Nodes */}
                    {STAGES.map((st, idx) => {
                      const isCompleted = currentStageIndex > idx || isHired;
                      const isCurrent = currentStageIndex === idx && !isHired && !isRejected;

                      return (
                        <div
                          key={st.key}
                          className="relative z-10 flex flex-col items-center group cursor-default"
                        >
                          <div
                            className={cn(
                              "size-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                              isCompleted && "bg-emerald-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)]",
                              isCurrent &&
                                "bg-indigo-600 text-white ring-4 ring-indigo-500/20 animate-pulse",
                              !isCompleted && !isCurrent && "bg-slate-800 text-slate-500 border border-white/10",
                            )}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="size-4" />
                            ) : (
                              <span>{idx + 1}</span>
                            )}
                          </div>
                          <span
                            className={cn(
                              "mt-2 text-[11px] font-semibold text-center whitespace-nowrap",
                              isCompleted && "text-slate-200",
                              isCurrent && "text-indigo-400 font-bold",
                              !isCompleted && !isCurrent && "text-slate-500",
                            )}
                          >
                            {st.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Stage Context / Action Box */}
                <div className="rounded-xl border border-white/10 bg-slate-950/80 p-4 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-300">
                      Next Step / Recruiter Feedback:
                    </span>
                    <span className="text-slate-500 font-mono">
                      Last Updated: {app.appliedDate}
                    </span>
                  </div>
                  <p className="text-slate-300">
                    {app.nextStep ||
                      "Your application is active and under review by the engineering talent acquisition committee."}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
        )}
      </div>

      {/* PLACEMENT HISTORY & OUTCOMES */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <History className="size-4 text-emerald-400" />
          <h2 className="font-display text-base font-bold text-white">
            Verified Placement History & Institutional Records
          </h2>
        </div>

        {placementHistory.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
            <GraduationCap className="size-8 text-slate-500 mx-auto mb-2" />
            <p className="text-xs text-slate-400">
              Accepted corporate placement offers will be archived in this permanent record.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {placementHistory.map((item) => (
              <Card
                key={item.id}
                className="rounded-2xl border border-emerald-500/30 bg-slate-900/60 p-5 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-[10px] font-bold uppercase">
                      <BadgeCheck className="size-3 mr-1" /> Verified Outcome
                    </Badge>
                    <h3 className="font-display font-bold text-lg text-white mt-1.5">
                      {item.role}
                    </h3>
                    <p className="text-xs font-semibold text-slate-300 mt-0.5">
                      {item.company} · {item.opportunityType}
                    </p>
                  </div>

                  {item.compensation && (
                    <div className="rounded-xl border border-white/10 bg-slate-950 px-3 py-1.5 text-right">
                      <p className="text-[10px] text-slate-400">CTC / Stipend</p>
                      <p className="text-xs font-extrabold text-emerald-400">{item.compensation}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                  <div>
                    <span className="text-slate-500">Placement Cycle:</span>{" "}
                    <span className="text-slate-300 font-medium">{item.placementCycle}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Joining Date:</span>{" "}
                    <span className="text-slate-300 font-medium">{item.joiningDate}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                  {item.relevantSkills.map((s) => (
                    <span
                      key={s}
                      className="rounded-md border border-white/10 bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

