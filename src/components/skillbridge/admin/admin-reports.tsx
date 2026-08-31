import { useState } from "react";
import {
  Award,
  BarChart3,
  Download,
  FileCheck,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppState } from "@/context/app-state";

export function AdminReportsView() {
  const { platformMetrics } = useAppState();

  const reports = [
    {
      id: "rep-01",
      title: "Consolidated NAAC / NBA Criterion 5 & 3 Dataset",
      description: "Aggregated placement records, faculty industry collaborations, and student competency score distributions formatted for NAAC peer review teams.",
      type: "Accreditation",
      fileSize: "2.4 MB CSV",
    },
    {
      id: "rep-02",
      title: "Recruiter Engagement & Salary Trend Index 2026-27",
      description: "Median stipend, offer acceptance rates, skill demand heatmap, and hiring conversion ratios across Tier-1 and Tier-2 engineering colleges.",
      type: "Industry Trends",
      fileSize: "1.8 MB PDF",
    },
    {
      id: "rep-03",
      title: "Platform Security & Identity Compliance Audit",
      description: "ISO 27001 readiness review, authenticated user role logs, and MCA corporate registration verification registry.",
      type: "Compliance",
      fileSize: "920 KB PDF",
    },
  ];

  const handleDownload = (reportTitle: string) => {
    toast.success(`Generated and downloaded ${reportTitle}.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            Analytics & Accreditation Reporting
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Export institutional accreditation packets, compliance documentation, and national talent intelligence.
          </p>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {reports.map((rep) => (
          <Card
            key={rep.id}
            className="glass-card rounded-2xl border-white/10 bg-slate-900/60 p-5 space-y-4 hover:border-indigo-500/30 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <Badge className="bg-indigo-500/10 text-indigo-300 border-indigo-500/30 text-[10px]">
                  {rep.type}
                </Badge>
                <span className="text-[11px] text-slate-500 font-mono">{rep.fileSize}</span>
              </div>

              <h3 className="font-display font-bold text-base text-white mt-2.5 leading-tight">
                {rep.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{rep.description}</p>
            </div>

            <Button
              size="sm"
              onClick={() => handleDownload(rep.title)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs h-8 border border-white/10"
            >
              <Download className="size-3.5 mr-1.5" /> Download Report
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

