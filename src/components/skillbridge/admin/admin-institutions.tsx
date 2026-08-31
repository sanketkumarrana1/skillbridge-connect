import { useState } from "react";
import {
  Award,
  Building2,
  CheckCircle2,
  Download,
  GraduationCap,
  Layers,
  Search,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppState } from "@/context/app-state";

export function AdminInstitutionsView() {
  const { departmentReports, institutionKPIs } = useAppState();
  const [searchQuery, setSearchQuery] = useState("");

  const institutions = [
    {
      id: "inst-01",
      name: "National Institute of Technology Karnataka (NITK)",
      code: "NITK-SURATHKAL",
      type: "Institute of National Importance",
      nirfRank: "#12 Engineering",
      naacGrade: "A++ (3.72 CGPA)",
      departmentsCount: departmentReports.length,
      totalStudents: institutionKPIs.totalStudents,
      placementRate: `${institutionKPIs.placementRate}%`,
      status: "Active Enterprise",
    },
    {
      id: "inst-02",
      name: "Indian Institute of Technology Bombay (IITB)",
      code: "IITB-MUMBAI",
      type: "Institute of Eminence",
      nirfRank: "#3 Engineering",
      naacGrade: "A++ (3.88 CGPA)",
      departmentsCount: 8,
      totalStudents: 1420,
      placementRate: "94.2%",
      status: "Active Enterprise",
    },
    {
      id: "inst-03",
      name: "BITS Pilani (Pilani, Goa & Hyderabad)",
      code: "BITS-PILANI",
      type: "Deemed University (IoE)",
      nirfRank: "#20 Overall",
      naacGrade: "A (3.45 CGPA)",
      departmentsCount: 6,
      totalStudents: 980,
      placementRate: "91.8%",
      status: "Active Enterprise",
    },
  ];

  const filteredInstitutions = institutions.filter(
    (inst) =>
      !searchQuery ||
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            Universities & Autonomous Colleges
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Institutional governance, department health, and accreditation readiness tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/30 text-xs px-3 py-1">
            Connected Campuses: {institutions.length}
          </Badge>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search institution by name or code..."
          className="pl-9 text-xs h-10 border-white/10 bg-slate-900 text-white"
        />
      </div>

      {/* Institutions Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredInstitutions.map((inst) => (
          <Card
            key={inst.id}
            className="glass-card rounded-2xl border-white/10 bg-slate-900/60 p-5 space-y-4 hover:border-indigo-500/30 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-display font-bold text-base text-white leading-tight">
                    {inst.name}
                  </h3>
                  <p className="text-[11px] text-indigo-400 font-mono mt-0.5">{inst.code}</p>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/30 text-[10px]">
                  {inst.status}
                </Badge>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-slate-950/80 p-3 text-xs">
                <div>
                  <p className="text-slate-400">NIRF Ranking</p>
                  <p className="font-bold text-white mt-0.5">{inst.nirfRank}</p>
                </div>
                <div>
                  <p className="text-slate-400">NAAC Grade</p>
                  <p className="font-bold text-emerald-400 mt-0.5">{inst.naacGrade}</p>
                </div>
                <div className="pt-2 border-t border-white/10">
                  <p className="text-slate-400">Departments</p>
                  <p className="font-bold text-white mt-0.5">{inst.departmentsCount} Units</p>
                </div>
                <div className="pt-2 border-t border-white/10">
                  <p className="text-slate-400">Placement Rate</p>
                  <p className="font-bold text-indigo-400 mt-0.5">{inst.placementRate}</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">{inst.totalStudents} enrolled students</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => toast.info(`Exported NAAC accreditation telemetry for ${inst.name}`)}
                className="text-xs h-7 text-indigo-400 hover:text-white"
              >
                <Download className="size-3 mr-1" /> Export Data
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

