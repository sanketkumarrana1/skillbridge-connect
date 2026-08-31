import { useState, useMemo } from "react";
import {
  Check,
  CheckCircle2,
  ExternalLink,
  Layers,
  MapPin,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppState } from "@/context/app-state";
import { cn } from "@/lib/utils";
import type { OpportunityModerationStatus } from "@/types";

export function AdminOpportunitiesView() {
  const { moderatedOpportunities, moderateOpportunityByAdmin } = useAppState();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OpportunityModerationStatus>("all");

  const filtered = useMemo(() => {
    return moderatedOpportunities.filter((opp) => {
      const matchSearch =
        !searchQuery ||
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus = statusFilter === "all" || opp.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [moderatedOpportunities, searchQuery, statusFilter]);

  const handlePublish = (id: string, title: string) => {
    moderateOpportunityByAdmin(id, "Published");
    toast.success(`Published '${title}' to student matching pool!`);
  };

  const handleReject = (id: string, title: string) => {
    moderateOpportunityByAdmin(id, "Rejected", "Does not meet student stipend/quality baseline.");
    toast.info(`Rejected opportunity posting '${title}'.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            Opportunity Moderation & Compliance
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Review recruiter postings, enforce fair campus stipends, and prevent predatory contracts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/30 text-xs px-3 py-1">
            Pending Moderation: {moderatedOpportunities.filter((o) => o.status === "Pending Review").length}
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by role, company, skills..."
            className="pl-9 text-xs h-10 border-white/10 bg-slate-900 text-white"
          />
        </div>

        <div className="flex rounded-xl border border-white/10 bg-slate-900 p-1 text-xs">
          {(["all", "Pending Review", "Published", "Rejected"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={cn(
                "px-3 py-1.5 rounded-lg font-medium transition",
                statusFilter === st
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white",
              )}
            >
              {st === "all" ? "All Postings" : st}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((opp) => (
          <Card
            key={opp.id}
            className="glass-card rounded-2xl border-white/10 bg-slate-900/60 p-5 space-y-4 hover:border-indigo-500/30 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-white leading-tight">
                  {opp.title}
                </h3>
                <p className="text-xs text-indigo-400 font-medium mt-0.5">
                  {opp.company} · {opp.type}
                </p>
              </div>

              <Badge
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-wider",
                  opp.status === "Published" && "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
                  opp.status === "Pending Review" && "bg-amber-500/10 text-amber-300 border-amber-500/30",
                  opp.status === "Rejected" && "bg-rose-500/10 text-rose-300 border-rose-500/30",
                )}
              >
                {opp.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-slate-950/80 p-3 text-xs">
              <div>
                <p className="text-slate-500">Stipend / CTC</p>
                <p className="font-bold text-white mt-0.5">{opp.stipendOrSalary}</p>
              </div>
              <div>
                <p className="text-slate-500">Location / Mode</p>
                <p className="font-semibold text-slate-300 mt-0.5">{opp.location}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {opp.skills.map((s) => (
                <span
                  key={s}
                  className="rounded-md border border-white/10 bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300"
                >
                  {s}
                </span>
              ))}
            </div>

            {opp.moderationNotes && (
              <p className="text-xs text-rose-300 italic border-l-2 border-rose-500/50 pl-2.5 py-0.5">
                Audit note: "{opp.moderationNotes}"
              </p>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
              <span className="text-slate-500">Submitted: {opp.submittedAt}</span>

              <div className="flex items-center gap-2">
                {opp.status !== "Published" && (
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs h-8"
                    onClick={() => handlePublish(opp.id, opp.title)}
                  >
                    <Check className="size-3.5 mr-1" /> Approve & Publish
                  </Button>
                )}

                {opp.status !== "Rejected" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-rose-500/30 text-rose-300 hover:bg-rose-500/10 text-xs h-8"
                    onClick={() => handleReject(opp.id, opp.title)}
                  >
                    <X className="size-3.5 mr-1" /> Flag / Reject
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

