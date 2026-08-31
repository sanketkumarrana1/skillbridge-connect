import { useState, useMemo } from "react";
import {
  Building2,
  Check,
  CheckCircle2,
  ExternalLink,
  FileCheck,
  Globe,
  Mail,
  Search,
  ShieldAlert,
  ShieldCheck,
  User,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppState } from "@/context/app-state";
import { cn } from "@/lib/utils";
import type { CompanyVerificationRecord } from "@/types";

export function AdminCompaniesView() {
  const { companyVerifications, verifyCompanyByAdmin } = useAppState();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Pending" | "Verified" | "Rejected">(
    "all",
  );

  // Review Dialog State
  const [reviewingCompany, setReviewingCompany] = useState<CompanyVerificationRecord | null>(null);
  const [reviewerNotes, setReviewerNotes] = useState("");

  const filteredCompanies = useMemo(() => {
    return companyVerifications.filter((c) => {
      const matchSearch =
        !searchQuery ||
        c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.cinOrRegistration.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === "all" || c.verificationStatus === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [companyVerifications, searchQuery, statusFilter]);

  const handleApprove = (company: CompanyVerificationRecord) => {
    verifyCompanyByAdmin(
      company.id,
      "Verified",
      "Corporate registration and domain identity authenticated.",
    );
    toast.success(`Verified ${company.companyName} successfully!`);
    setReviewingCompany(null);
  };

  const handleReject = (company: CompanyVerificationRecord) => {
    if (!reviewerNotes.trim()) {
      toast.error("Please specify a reason for rejecting the verification request.");
      return;
    }
    verifyCompanyByAdmin(company.id, "Rejected", reviewerNotes.trim());
    toast.info(`Rejected verification request for ${company.companyName}.`);
    setReviewingCompany(null);
    setReviewerNotes("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            Company Verifications & Recruiter Trust
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Authenticate hiring organizations, inspect MCA registration numbers, and maintain zero-fraud campus recruiting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-blue-500/10 text-blue-300 border-blue-500/30 text-xs px-3 py-1">
            Pending Review: {companyVerifications.filter((c) => c.verificationStatus === "Pending").length}
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
            placeholder="Search company, CIN, industry..."
            className="pl-9 text-xs h-10 border-white/10 bg-slate-900 text-white"
          />
        </div>

        <div className="flex rounded-xl border border-white/10 bg-slate-900 p-1 text-xs">
          {(["all", "Pending", "Verified", "Rejected"] as const).map((st) => (
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
              {st === "all" ? "All Requests" : st}
            </button>
          ))}
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredCompanies.map((comp) => (
          <Card
            key={comp.id}
            className="glass-card rounded-2xl border-white/10 bg-slate-900/60 p-5 space-y-4 hover:border-indigo-500/30 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-white leading-tight">
                  {comp.companyName}
                </h3>
                <p className="text-xs text-indigo-400 font-medium mt-0.5">{comp.industry}</p>
              </div>

              <Badge
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-wider",
                  comp.verificationStatus === "Verified" && "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
                  comp.verificationStatus === "Pending" && "bg-amber-500/10 text-amber-300 border-amber-500/30",
                  comp.verificationStatus === "Rejected" && "bg-rose-500/10 text-rose-300 border-rose-500/30",
                )}
              >
                {comp.verificationStatus === "Verified" ? (
                  <>
                    <ShieldCheck className="size-3 mr-1" /> Verified
                  </>
                ) : comp.verificationStatus === "Pending" ? (
                  <>
                    <ShieldAlert className="size-3 mr-1" /> Pending Review
                  </>
                ) : (
                  <>
                    <XCircle className="size-3 mr-1" /> Rejected
                  </>
                )}
              </Badge>
            </div>

            <div className="rounded-xl border border-white/10 bg-slate-950/80 p-3 text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">CIN / Reg No:</span>
                <span className="text-slate-200 font-semibold">{comp.cinOrRegistration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Primary Contact:</span>
                <span className="text-slate-300">{comp.contactPerson} ({comp.contactEmail})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Website:</span>
                <a
                  href={comp.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-400 hover:underline flex items-center gap-1 font-sans"
                >
                  {comp.website.replace("https://", "")} <ExternalLink className="size-2.5" />
                </a>
              </div>
            </div>

            {comp.reviewerNotes && (
              <p className="text-xs text-slate-300 italic border-l-2 border-indigo-500/50 pl-2.5 py-0.5">
                "{comp.reviewerNotes}"
              </p>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
              <span className="text-slate-500">Submitted: {comp.submittedAt}</span>

              <div className="flex items-center gap-2">
                {comp.verificationStatus !== "Verified" && (
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs h-8"
                    onClick={() => handleApprove(comp)}
                  >
                    <Check className="size-3.5 mr-1" /> Approve
                  </Button>
                )}

                {comp.verificationStatus !== "Rejected" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-rose-500/30 text-rose-300 hover:bg-rose-500/10 text-xs h-8"
                    onClick={() => {
                      setReviewingCompany(comp);
                      setReviewerNotes("");
                    }}
                  >
                    <X className="size-3.5 mr-1" /> Reject...
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* REJECTION REASON MODAL */}
      <Dialog open={!!reviewingCompany} onOpenChange={(open) => !open && setReviewingCompany(null)}>
        <DialogContent className="border-white/10 bg-[#0E1322]/95 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold text-white flex items-center gap-2">
              <XCircle className="size-5 text-rose-400" />
              Reject Verification for {reviewingCompany?.companyName}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Please specify the audit reason (e.g. invalid MCA registration, mismatched corporate domain).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <Label className="text-xs font-semibold text-slate-300">Audit Notes *</Label>
            <Textarea
              value={reviewerNotes}
              onChange={(e) => setReviewerNotes(e.target.value)}
              placeholder="e.g. Could not verify Certificate of Incorporation with MCA portal..."
              rows={3}
              className="border-white/10 bg-slate-900 text-xs text-white"
            />
          </div>

          <DialogFooter className="border-t border-white/10 pt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReviewingCompany(null)}
              className="text-slate-400 hover:text-white"
            >
              Cancel
            </Button>
            {reviewingCompany && (
              <Button
                size="sm"
                className="bg-rose-600 hover:bg-rose-500 text-white font-semibold"
                onClick={() => handleReject(reviewingCompany)}
              >
                Confirm Rejection
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

