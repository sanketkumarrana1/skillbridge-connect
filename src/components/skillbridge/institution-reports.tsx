import { useState } from "react";
import {
  Award,
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle2,
  Download,
  Eye,
  FileCheck,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  Printer,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionCard, Stat, WorkspaceHeader } from "@/components/skillbridge/student-ui";
import { useAppState } from "@/context/app-state";
import { cn } from "@/lib/utils";

export function InstitutionReports() {
  const { institutionStudents, departmentReports, recruiterPartners, internships } = useAppState();

  const [activeReportType, setActiveReportType] = useState<
    "students" | "placements" | "internships" | "departments"
  >("students");

  const [pdfPreviewModal, setPdfPreviewModal] = useState<string | null>(null);

  // CSV Generator Helper
  const downloadCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvRows = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((item) => {
            const val = String(item ?? "").replace(/"/g, '""');
            return `"${val}"`;
          })
          .join(","),
      ),
    ];
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`📥 Downloaded ${filename} successfully!`);
  };

  // Export Handlers
  const handleExportStudentsCSV = () => {
    const headers = [
      "Roll No",
      "Name",
      "Email",
      "Department",
      "Year",
      "CGPA",
      "Employability Score",
      "Placement Status",
      "Company",
      "CTC (LPA)",
      "Readiness Level",
      "Skills",
    ];
    const rows = institutionStudents.map((s) => [
      s.rollNo,
      s.name,
      s.email,
      s.department,
      s.year,
      s.cgpa,
      s.employabilityScore,
      s.placementStatus,
      s.placedCompany || "N/A",
      s.packageLPA || 0,
      s.readinessLevel,
      s.skills.join("; "),
    ]);
    downloadCSV("AcadIn_Student_Analytics_Report.csv", headers, rows);
  };

  const handleExportPlacementsCSV = () => {
    const headers = [
      "Department Code",
      "Department Name",
      "Head of Department",
      "Total Students",
      "Placement Rate (%)",
      "Average CTC (LPA)",
      "Highest CTC (LPA)",
    ];
    const rows = departmentReports.map((d) => [
      d.code,
      d.name,
      d.headOfDepartment,
      d.totalStudents,
      d.placementRate,
      d.averageCTC,
      d.highestCTC,
    ]);
    downloadCSV("AcadIn_Placement_Outcomes_Report.csv", headers, rows);
  };

  const handleExportInternshipsCSV = () => {
    const headers = [
      "Roll No",
      "Name",
      "Department",
      "Internship Status",
      "Company",
      "Employability Index",
    ];
    const rows = institutionStudents.map((s) => [
      s.rollNo,
      s.name,
      s.department,
      s.internshipStatus,
      s.internshipCompany || "N/A",
      s.employabilityScore,
    ]);
    downloadCSV("AcadIn_Internship_Participation_Report.csv", headers, rows);
  };

  const handleExportDepartmentsCSV = () => {
    const headers = [
      "Code",
      "Department Name",
      "HOD",
      "Total Students",
      "Faculty Count",
      "Industry Partners",
      "Placement Rate (%)",
      "Internship Rate (%)",
      "Top Competencies",
    ];
    const rows = departmentReports.map((d) => [
      d.code,
      d.name,
      d.headOfDepartment,
      d.totalStudents,
      d.facultyCount,
      d.activeIndustryPartners,
      d.placementRate,
      d.internshipParticipation,
      d.topSkills.join("; "),
    ]);
    downloadCSV("AcadIn_Department_Audit_Report.csv", headers, rows);
  };

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        eyebrow="Accreditation & Institutional Governance"
        title="Institutional Reports & Data Export"
        description="Generate official institutional reports, NAAC/NBA compliance summaries, placement audits, and student progression metrics in CSV and formatted PDF."
      />

      {/* KPI Ribbon */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Export Modules"
          value="4"
          trend="Categories"
          icon={FileSpreadsheet}
        />
        <Stat
          label="Accreditation Docket"
          value="NAAC & NBA"
          trend="Tier-1 Compliant"
          icon={CheckCircle2}
        />
        <Stat
          label="Student Records"
          value={institutionStudents.length.toString()}
          trend="Active Database"
          icon={Users}
        />
        <Stat
          label="Corporate Partners"
          value={recruiterPartners.length.toString()}
          trend="Active Recruiter Networks"
          icon={Building2}
        />
      </div>

      {/* Report Generator Selector Cards */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            id: "students",
            title: "Student Analytics Report",
            desc: "Comprehensive roster with roll numbers, CGPA, employability scores, and placement statuses.",
            count: `${institutionStudents.length} Students`,
            exportCsv: handleExportStudentsCSV,
          },
          {
            id: "placements",
            title: "Placement Audit Report",
            desc: "Department-wise placement conversions, median/highest CTC distributions, and recruiter offers.",
            count: "344 Confirmed Offers",
            exportCsv: handleExportPlacementsCSV,
          },
          {
            id: "internships",
            title: "Internship Participation Report",
            desc: "Corporate lab residencies, stipend averages, and Pre-Placement Offer (PPO) conversion rates.",
            count: "84.8% Participation",
            exportCsv: handleExportInternshipsCSV,
          },
          {
            id: "departments",
            title: "Department Audit Report",
            desc: "Faculty-to-student ratios, HOD credentials, research partnerships, and curriculum skill gaps.",
            count: "5 Departments",
            exportCsv: handleExportDepartmentsCSV,
          },
        ].map((rep) => {
          const isActive = activeReportType === rep.id;
          return (
            <Card
              key={rep.id}
              onClick={() => setActiveReportType(rep.id as any)}
              className={cn(
                "cursor-pointer rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between",
                isActive
                  ? "border-indigo-500/80 bg-slate-900/90 shadow-[0_0_20px_rgba(99,102,241,0.25)] ring-1 ring-indigo-500/50"
                  : "border-white/10 bg-slate-900/60 hover:border-white/20 hover:bg-slate-900/80",
              )}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="grid size-9 place-items-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-300">
                    <FileText className="size-4.5" />
                  </span>
                  <Badge className="border-white/10 bg-slate-800 text-slate-300 text-[10px]">
                    {rep.count}
                  </Badge>
                </div>
                <h3 className="font-display text-sm font-bold text-white">{rep.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{rep.desc}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs gap-1 border-white/10 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPdfPreviewModal(rep.id);
                  }}
                >
                  <Eye className="size-3.5" /> View PDF
                </Button>
                <Button
                  size="sm"
                  className="h-8 text-xs gap-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-[0_0_10px_rgba(99,102,241,0.3)]"
                  onClick={(e) => {
                    e.stopPropagation();
                    rep.exportCsv();
                  }}
                >
                  <Download className="size-3.5" /> Export CSV
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Live Data Preview Section */}
      <SectionCard title="Live Institutional Data Feed Preview">
        <div className="space-y-5 pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <Tabs
              value={activeReportType}
              onValueChange={(v) =>
                setActiveReportType(v as "students" | "placements" | "internships" | "departments")
              }
            >
              <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full sm:w-[540px] border border-white/10 bg-slate-950 p-1">
                <TabsTrigger
                  value="students"
                  className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-xs"
                >
                  Students ({institutionStudents.length})
                </TabsTrigger>
                <TabsTrigger
                  value="placements"
                  className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-xs"
                >
                  Placements
                </TabsTrigger>
                <TabsTrigger
                  value="internships"
                  className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-xs"
                >
                  Internships
                </TabsTrigger>
                <TabsTrigger
                  value="departments"
                  className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-xs"
                >
                  Departments ({departmentReports.length})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-xs border-white/10 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white"
                onClick={() => setPdfPreviewModal(activeReportType)}
              >
                <Printer className="size-3.5" /> Print / Save PDF
              </Button>
              <Button
                size="sm"
                className="gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-[0_0_12px_rgba(99,102,241,0.3)]"
                onClick={() => {
                  if (activeReportType === "students") handleExportStudentsCSV();
                  else if (activeReportType === "placements") handleExportPlacementsCSV();
                  else if (activeReportType === "internships") handleExportInternshipsCSV();
                  else handleExportDepartmentsCSV();
                }}
              >
                <Download className="size-3.5" /> Download Full CSV
              </Button>
            </div>
          </div>

          {/* Tab Content Tables */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden">
            {activeReportType === "students" && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950/80 border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3.5">Roll No</th>
                      <th className="p-3.5">Student Name</th>
                      <th className="p-3.5">Department</th>
                      <th className="p-3.5">Year</th>
                      <th className="p-3.5 text-center">CGPA</th>
                      <th className="p-3.5 text-center">Employability</th>
                      <th className="p-3.5 text-center">Placement</th>
                      <th className="p-3.5 text-right">Package</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-slate-300">
                    {institutionStudents.slice(0, 8).map((s) => (
                      <tr key={s.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3.5 font-mono font-medium text-slate-400">{s.rollNo}</td>
                        <td className="p-3.5 font-semibold text-white">{s.name}</td>
                        <td className="p-3.5 text-slate-400">{s.department}</td>
                        <td className="p-3.5 text-slate-400">{s.year}</td>
                        <td className="p-3.5 text-center font-bold text-white">{s.cgpa}</td>
                        <td className="p-3.5 text-center font-bold text-indigo-400">
                          {s.employabilityScore}%
                        </td>
                        <td className="p-3.5 text-center">
                          <Badge
                            className={cn(
                              "text-[10px]",
                              s.placementStatus === "Placed"
                                ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                                : "bg-slate-800 text-slate-400 border-white/10",
                            )}
                          >
                            {s.placementStatus}
                          </Badge>
                        </td>
                        <td className="p-3.5 text-right font-bold text-emerald-400">
                          {s.packageLPA ? `₹${s.packageLPA} LPA` : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeReportType === "placements" && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950/80 border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3.5">Department</th>
                      <th className="p-3.5 text-center">Total Students</th>
                      <th className="p-3.5 text-center">Placement Rate</th>
                      <th className="p-3.5 text-right">Average CTC</th>
                      <th className="p-3.5 text-right">Highest CTC</th>
                      <th className="p-3.5">Top Recruiting Partners</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-slate-300">
                    {departmentReports.map((d) => (
                      <tr key={d.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3.5 font-semibold text-white">
                          {d.name} ({d.code})
                        </td>
                        <td className="p-3.5 text-center">{d.totalStudents}</td>
                        <td className="p-3.5 text-center font-bold text-emerald-400">
                          {d.placementRate}%
                        </td>
                        <td className="p-3.5 text-right font-semibold text-slate-200">
                          ₹{d.averageCTC} LPA
                        </td>
                        <td className="p-3.5 text-right font-bold text-indigo-400">
                          ₹{d.highestCTC} LPA
                        </td>
                        <td className="p-3.5 text-slate-400">
                          Nexora Labs, Quantile AI, Qualcomm
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeReportType === "internships" && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950/80 border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3.5">Department</th>
                      <th className="p-3.5 text-center">Enrollment</th>
                      <th className="p-3.5 text-center">Participation Rate</th>
                      <th className="p-3.5 text-center">Active Interns</th>
                      <th className="p-3.5 text-center">PPO Conversion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-slate-300">
                    {departmentReports.map((d) => (
                      <tr key={d.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3.5 font-semibold text-white">{d.name}</td>
                        <td className="p-3.5 text-center">{d.totalStudents}</td>
                        <td className="p-3.5 text-center font-bold text-emerald-400">
                          {d.internshipParticipation}%
                        </td>
                        <td className="p-3.5 text-center">
                          {Math.round((d.totalStudents * d.internshipParticipation) / 100)}
                        </td>
                        <td className="p-3.5 text-center">
                          <Badge className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20 text-[10px]">
                            {d.code === "CSE" ? "88%" : "80%"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeReportType === "departments" && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950/80 border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3.5">Code</th>
                      <th className="p-3.5">Department</th>
                      <th className="p-3.5">Head of Department</th>
                      <th className="p-3.5 text-center">Faculty</th>
                      <th className="p-3.5 text-center">Partners</th>
                      <th className="p-3.5 text-center">Employability</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-slate-300">
                    {departmentReports.map((d) => (
                      <tr key={d.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-indigo-400">{d.code}</td>
                        <td className="p-3.5 font-semibold text-white">{d.name}</td>
                        <td className="p-3.5 text-slate-400">{d.headOfDepartment}</td>
                        <td className="p-3.5 text-center">{d.facultyCount}</td>
                        <td className="p-3.5 text-center">{d.activeIndustryPartners}</td>
                        <td className="p-3.5 text-center font-bold text-indigo-400">
                          {d.averageEmployability}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </SectionCard>

      {/* Official Formatted Printable PDF Preview Dialog */}
      <Dialog open={!!pdfPreviewModal} onOpenChange={(open) => !open && setPdfPreviewModal(null)}>
        {pdfPreviewModal && (
          <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto border-white/10 bg-[#0E1322]/95 text-white">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-[10px]">
                  Official Accreditation Document
                </Badge>
                <Badge className="border-white/10 bg-slate-800 text-slate-300 text-[10px]">
                  Academic Year 2026-2027
                </Badge>
              </div>
              <DialogTitle className="text-xl font-bold font-display text-white">
                AcadIn Institutional Quality & Placement Report
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                National Board of Accreditation (NBA) & NAAC Compliance Docket
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 border-y border-white/10 my-2 text-xs">
              <div className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Institution Name:</span>
                  <strong className="text-white">
                    National Institute of Technology / AcadIn Partner University
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Report Category:</span>
                  <strong className="text-indigo-400 capitalize">
                    {pdfPreviewModal} Intelligence Audit
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date of Compilation:</span>
                  <strong className="text-white">30 August 2026</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Overall Campus Placement Rate:</span>
                  <strong className="text-emerald-400 font-bold">86.4% Verified</strong>
                </div>
              </div>

              <div>
                <h4 className="font-bold uppercase tracking-wider text-indigo-400 text-[11px] mb-2">
                  Executive Summary of Findings
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  During the current accreditation period, campus-wide average CTC grew by +14.2% to
                  ₹13.4 LPA, with top tier-1 placements registered in Cloud Infrastructure, Applied
                  Machine Learning, and VLSI Systems. Internship-to-PPO conversion stood at 84.8%
                  across 64 enterprise partners.
                </p>
              </div>

              <div>
                <h4 className="font-bold uppercase tracking-wider text-indigo-400 text-[11px] mb-2">
                  Department Breakdown Summary
                </h4>
                <div className="space-y-1.5">
                  {departmentReports.map((d) => (
                    <div
                      key={d.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-white/10"
                    >
                      <span className="font-semibold text-white">
                        {d.name} ({d.code})
                      </span>
                      <span className="text-emerald-400 font-bold">{d.placementRate}% Placed</span>
                      <span className="text-slate-400">Avg ₹{d.averageCTC} LPA</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="border-t border-white/10 pt-3">
              <Button
                variant="ghost"
                onClick={() => setPdfPreviewModal(null)}
                className="text-slate-400 hover:text-white"
              >
                Close
              </Button>
              <Button
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                onClick={() => {
                  window.print();
                }}
              >
                <Printer className="size-4" /> Print / Save as PDF
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
