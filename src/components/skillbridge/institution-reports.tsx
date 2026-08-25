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
          value="4 Categories"
          trend="Students, Placements, Interns, Depts"
          icon={FileSpreadsheet}
        />
        <Stat
          label="Accreditation Ready"
          value="NAAC & NBA"
          trend="Tier-1 Compliance formats"
          icon={CheckCircle2}
        />
        <Stat
          label="Total Profiles"
          value={institutionStudents.length.toString()}
          trend="In Active Database"
          icon={Users}
        />
        <Stat
          label="Recruiter Records"
          value={recruiterPartners.length.toString()}
          trend="Corporate Accounts"
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
        ].map((rep) => (
          <Card
            key={rep.id}
            className={`border transition hover:shadow-md ${
              activeReportType === rep.id
                ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                : "border-border bg-card"
            }`}
          >
            <CardContent className="p-5 space-y-3 flex flex-col justify-between h-full">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                    <FileText className="size-4.5" />
                  </span>
                  <Badge variant="outline" className="text-[10px]">
                    {rep.count}
                  </Badge>
                </div>
                <h3 className="font-display text-sm font-bold text-foreground">{rep.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{rep.desc}</p>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs gap-1"
                  onClick={() => setPdfPreviewModal(rep.id)}
                >
                  <Eye className="size-3.5" /> View
                </Button>
                <Button size="sm" className="h-8 text-xs gap-1" onClick={rep.exportCsv}>
                  <Download className="size-3.5" /> Export CSV
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Live Data Preview Section */}
      <SectionCard title="Live Institutional Data Feed Preview">
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <Tabs
              value={activeReportType}
              onValueChange={(v) =>
                setActiveReportType(v as "students" | "placements" | "internships" | "departments")
              }
            >
              <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full sm:w-[540px]">
                <TabsTrigger value="students">Students ({institutionStudents.length})</TabsTrigger>
                <TabsTrigger value="placements">Placements</TabsTrigger>
                <TabsTrigger value="internships">Internships</TabsTrigger>
                <TabsTrigger value="departments">
                  Departments ({departmentReports.length})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="gap-1 text-xs"
                onClick={() => setPdfPreviewModal(activeReportType)}
              >
                <Printer className="size-3.5" /> Print / Save PDF
              </Button>
              <Button
                size="sm"
                className="gap-1 text-xs"
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
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {activeReportType === "students" && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/40 border-b border-border text-muted-foreground">
                    <tr>
                      <th className="p-3">Roll No</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Year</th>
                      <th className="p-3 text-center">CGPA</th>
                      <th className="p-3 text-center">Employability</th>
                      <th className="p-3 text-center">Placement</th>
                      <th className="p-3 text-right">Package</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {institutionStudents.slice(0, 6).map((s) => (
                      <tr key={s.id} className="hover:bg-muted/20">
                        <td className="p-3 font-mono font-medium">{s.rollNo}</td>
                        <td className="p-3 font-semibold text-foreground">{s.name}</td>
                        <td className="p-3 text-muted-foreground">{s.department}</td>
                        <td className="p-3 text-muted-foreground">{s.year}</td>
                        <td className="p-3 text-center font-bold">{s.cgpa}</td>
                        <td className="p-3 text-center font-bold text-primary">
                          {s.employabilityScore}%
                        </td>
                        <td className="p-3 text-center">
                          <Badge variant="outline" className="text-[10px]">
                            {s.placementStatus}
                          </Badge>
                        </td>
                        <td className="p-3 text-right font-bold text-emerald-600">
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
                  <thead className="bg-muted/40 border-b border-border text-muted-foreground">
                    <tr>
                      <th className="p-3">Department</th>
                      <th className="p-3 text-center">Total Students</th>
                      <th className="p-3 text-center">Placement Rate</th>
                      <th className="p-3 text-right">Average CTC</th>
                      <th className="p-3 text-right">Highest CTC</th>
                      <th className="p-3">Top Recruiting Partners</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {departmentReports.map((d) => (
                      <tr key={d.id} className="hover:bg-muted/20">
                        <td className="p-3 font-semibold text-foreground">
                          {d.name} ({d.code})
                        </td>
                        <td className="p-3 text-center">{d.totalStudents}</td>
                        <td className="p-3 text-center font-bold text-emerald-600">
                          {d.placementRate}%
                        </td>
                        <td className="p-3 text-right font-semibold">₹{d.averageCTC} LPA</td>
                        <td className="p-3 text-right font-bold text-primary">
                          ₹{d.highestCTC} LPA
                        </td>
                        <td className="p-3 text-muted-foreground">
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
                  <thead className="bg-muted/40 border-b border-border text-muted-foreground">
                    <tr>
                      <th className="p-3">Department</th>
                      <th className="p-3 text-center">Enrollment</th>
                      <th className="p-3 text-center">Participation Rate</th>
                      <th className="p-3 text-center">Active Interns</th>
                      <th className="p-3 text-center">PPO Conversion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {departmentReports.map((d) => (
                      <tr key={d.id} className="hover:bg-muted/20">
                        <td className="p-3 font-semibold text-foreground">{d.name}</td>
                        <td className="p-3 text-center">{d.totalStudents}</td>
                        <td className="p-3 text-center font-bold text-emerald-600">
                          {d.internshipParticipation}%
                        </td>
                        <td className="p-3 text-center">
                          {Math.round((d.totalStudents * d.internshipParticipation) / 100)}
                        </td>
                        <td className="p-3 text-center">
                          <Badge variant="secondary" className="text-[10px]">
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
                  <thead className="bg-muted/40 border-b border-border text-muted-foreground">
                    <tr>
                      <th className="p-3">Code</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Head of Department</th>
                      <th className="p-3 text-center">Faculty</th>
                      <th className="p-3 text-center">Partners</th>
                      <th className="p-3 text-center">Employability</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {departmentReports.map((d) => (
                      <tr key={d.id} className="hover:bg-muted/20">
                        <td className="p-3 font-mono font-bold text-primary">{d.code}</td>
                        <td className="p-3 font-semibold text-foreground">{d.name}</td>
                        <td className="p-3 text-muted-foreground">{d.headOfDepartment}</td>
                        <td className="p-3 text-center">{d.facultyCount}</td>
                        <td className="p-3 text-center">{d.activeIndustryPartners}</td>
                        <td className="p-3 text-center font-bold text-primary">
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
          <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-primary text-[10px]">
                  Official Accreditation Document
                </Badge>
                <Badge variant="secondary" className="text-[10px]">
                  Academic Year 2025-2026
                </Badge>
              </div>
              <DialogTitle className="text-xl font-bold font-display text-foreground">
                AcadIn Institutional Quality & Placement Report
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                National Board of Accreditation (NBA) & NAAC Compliance Docket
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 border-y border-border my-2 text-xs">
              <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Institution Name:</span>
                  <strong className="text-foreground">
                    National Institute of Technology / AcadIn University
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Report Category:</span>
                  <strong className="text-primary capitalize">
                    {pdfPreviewModal} Intelligence Audit
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date of Compilation:</span>
                  <strong className="text-foreground">26 August 2026</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Overall Campus Placement Rate:</span>
                  <strong className="text-emerald-600 font-bold">86.4% Verified</strong>
                </div>
              </div>

              <div>
                <h4 className="font-bold uppercase tracking-wider text-primary text-[11px] mb-2">
                  Executive Summary of Findings
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  During the current accreditation period, campus-wide average CTC grew by +14.2% to
                  ₹13.4 LPA, with top tier-1 placements registered in Cloud Infrastructure, Applied
                  Machine Learning, and VLSI Systems. Internship-to-PPO conversion stood at 84.8%
                  across 64 enterprise partners.
                </p>
              </div>

              <div>
                <h4 className="font-bold uppercase tracking-wider text-primary text-[11px] mb-2">
                  Department Breakdown Summary
                </h4>
                <div className="space-y-1.5">
                  {departmentReports.map((d) => (
                    <div
                      key={d.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-card border border-border"
                    >
                      <span className="font-semibold text-foreground">
                        {d.name} ({d.code})
                      </span>
                      <span className="text-emerald-600 font-bold">{d.placementRate}% Placed</span>
                      <span className="text-muted-foreground">Avg ₹{d.averageCTC} LPA</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setPdfPreviewModal(null)}>
                Close
              </Button>
              <Button
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
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
