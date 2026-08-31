import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  FileCheck,
  Flag,
  MessageSquare,
  Shield,
  ShieldAlert,
  Sparkles,
  UserX,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppState } from "@/context/app-state";

export function AdminModerationView() {
  const { logAdminAction } = useAppState();

  const [flaggedItems, setFlaggedItems] = useState([
    {
      id: "mod-01",
      type: "Student Profile Evidence",
      entity: "Sanket Kumar Rana",
      reason: "Automated OCR Verification: Certificate issuer signature match score 98.4%",
      severity: "Low",
      status: "Resolved",
      timestamp: "28 Aug 2026",
    },
    {
      id: "mod-02",
      type: "Unverified Company Opportunity",
      entity: "Unverified Web3 Alpha",
      reason: "Flagged for payment terms in cryptocurrency without statutory stipend guarantee.",
      severity: "High",
      status: "Pending Action",
      timestamp: "27 Aug 2026",
    },
    {
      id: "mod-03",
      type: "Faculty Profile Claim",
      entity: "Dr. Ramesh Sharma",
      reason: "Duplicate publication DOI claim detected with external IEEE repository.",
      severity: "Medium",
      status: "Under Investigation",
      timestamp: "26 Aug 2026",
    },
  ]);

  const handleResolve = (id: string, entity: string) => {
    setFlaggedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "Resolved" } : item)),
    );
    logAdminAction("Moderation issue resolved", "System", id, `Resolved flagged item for ${entity}.`);
    toast.success(`Resolved moderation item for ${entity}.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            Platform Moderation & Security Queue
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Automated anomaly detection, trust & safety compliance flags, and integrity verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-amber-500/10 text-amber-300 border-amber-500/30 text-xs px-3 py-1">
            Active Issues: {flaggedItems.filter((i) => i.status !== "Resolved").length}
          </Badge>
        </div>
      </div>

      {/* Moderation Items */}
      <div className="space-y-4">
        {flaggedItems.map((item) => (
          <Card
            key={item.id}
            className="glass-card rounded-2xl border-white/10 bg-slate-900/60 p-5 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`size-9 rounded-xl flex items-center justify-center font-bold ${
                    item.severity === "High"
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      : item.severity === "Medium"
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  }`}
                >
                  <ShieldAlert className="size-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-white">{item.entity}</h3>
                  <p className="text-xs text-slate-400">{item.type} · Reported on {item.timestamp}</p>
                </div>
              </div>

              <Badge
                className={
                  item.status === "Resolved"
                    ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 text-xs"
                    : "bg-amber-500/10 text-amber-300 border-amber-500/30 text-xs"
                }
              >
                {item.status}
              </Badge>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/80 rounded-xl p-3 border border-white/10 font-mono">
              {item.reason}
            </p>

            {item.status !== "Resolved" && (
              <div className="flex justify-end pt-2 border-t border-white/10">
                <Button
                  size="sm"
                  onClick={() => handleResolve(item.id, item.entity)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs h-8"
                >
                  <CheckCircle2 className="size-3.5 mr-1.5" /> Mark Reviewed & Clear Flag
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

