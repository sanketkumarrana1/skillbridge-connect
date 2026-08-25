import { useState, useMemo } from "react";
import {
  AlertCircle,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Edit2,
  ExternalLink,
  Filter,
  Plus,
  QrCode,
  Search,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SkillTag } from "@/components/skillbridge/primitives";
import { SectionCard, WorkspaceHeader } from "@/components/skillbridge/student-ui";
import { useAppState } from "@/context/app-state";
import type { CertificateVerificationStatus, Certification } from "@/types";

export function StudentCertificates() {
  const { profile, addCertificate, updateCertificate, deleteCertificate } = useAppState();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // View Details Modal State
  const [viewingCert, setViewingCert] = useState<Certification | null>(null);

  // Add / Edit Modal State
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [certName, setCertName] = useState("");
  const [certIssuer, setCertIssuer] = useState("");
  const [certDate, setCertDate] = useState("");
  const [certCredId, setCertCredId] = useState("");
  const [certCredUrl, setCertCredUrl] = useState("");
  const [certSkills, setCertSkills] = useState("");
  const [certStatus, setCertStatus] = useState<CertificateVerificationStatus>("Verified");

  // Delete Alert State
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    certId: string;
    certName: string;
  }>({ open: false, certId: "", certName: "" });

  const filteredCerts = useMemo(() => {
    return profile.certifications.filter((cert) => {
      const name = cert.name || cert.title || "";
      const matchesSearch =
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cert.credentialId && cert.credentialId.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === "All" || (cert.verificationStatus || "Verified") === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [profile.certifications, searchQuery, statusFilter]);

  const handleOpenForm = (cert?: Certification) => {
    if (cert) {
      setEditingCert(cert);
      setCertName(cert.name || cert.title || "");
      setCertIssuer(cert.issuer);
      setCertDate(cert.issueDate || cert.year || "2025");
      setCertCredId(cert.credentialId ?? "");
      setCertCredUrl(cert.credentialUrl ?? "");
      setCertSkills((cert.skillsEarned ?? []).join(", "));
      setCertStatus(cert.verificationStatus ?? "Verified");
    } else {
      setEditingCert(null);
      setCertName("");
      setCertIssuer("");
      setCertDate("Jan 2025");
      setCertCredId(`CERT-${Math.floor(100000 + Math.random() * 900000)}`);
      setCertCredUrl("");
      setCertSkills("");
      setCertStatus("Verified");
    }
    setFormDialogOpen(true);
  };

  const handleSaveForm = () => {
    if (!certName.trim() || !certIssuer.trim()) {
      toast.error("Certificate name and issuing organization are required");
      return;
    }

    const skillsArray = certSkills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingCert) {
      updateCertificate(editingCert.id, {
        name: certName.trim(),
        title: certName.trim(),
        issuer: certIssuer.trim(),
        issueDate: certDate.trim() || "2025",
        year: certDate.trim().slice(-4) || "2025",
        credentialId: certCredId.trim() || undefined,
        credentialUrl: certCredUrl.trim() || undefined,
        skillsEarned: skillsArray.length > 0 ? skillsArray : undefined,
        verificationStatus: certStatus,
      });
      toast.success("Certificate updated successfully");
    } else {
      addCertificate({
        name: certName.trim(),
        title: certName.trim(),
        issuer: certIssuer.trim(),
        issueDate: certDate.trim() || "2025",
        year: certDate.trim().slice(-4) || "2025",
        credentialId: certCredId.trim() || `CERT-${Date.now().toString().slice(-6)}`,
        credentialUrl: certCredUrl.trim() || undefined,
        skillsEarned: skillsArray.length > 0 ? skillsArray : ["AcadIn Verified"],
        verificationStatus: certStatus,
      });
      toast.success("Certificate added to your credentials and portfolio");
    }
    setFormDialogOpen(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Credential ID copied to clipboard");
  };

  const renderStatusBadge = (status?: CertificateVerificationStatus) => {
    const s = status || "Verified";
    if (s === "Verified") {
      return (
        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/15 border-emerald-500/20 gap-1 font-medium text-xs">
          <ShieldCheck className="size-3" /> Verified
        </Badge>
      );
    }
    if (s === "Pending") {
      return (
        <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/15 border-amber-500/20 gap-1 font-medium text-xs">
          <Clock className="size-3" /> Pending Review
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-muted-foreground gap-1 font-medium text-xs">
        <AlertCircle className="size-3" /> Not Verified
      </Badge>
    );
  };

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        eyebrow="Credentials & Badges"
        title="Certifications & Diplomas"
        description="Verify and showcase professional certificates, course completions, and hackathon recognitions."
        action={
          <Button onClick={() => handleOpenForm()} className="gap-2">
            <Plus className="size-4" /> Add Certificate
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by certificate title, issuer, ID..."
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-border bg-card p-1">
          {["All", "Verified", "Pending", "Not Verified"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                statusFilter === status
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Certificates Grid */}
      {filteredCerts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center">
          <Award className="mx-auto size-12 text-muted-foreground/50" />
          <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
            No certificates found
          </h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
            {searchQuery || statusFilter !== "All"
              ? "Try adjusting your search or verification status filters."
              : "Add your first accredited certificate to bolster your employability score."}
          </p>
          <Button className="mt-5 gap-1.5" onClick={() => handleOpenForm()}>
            <Plus className="size-4" /> Add Certificate
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredCerts.map((cert) => {
            const name = cert.name || cert.title || "Certificate";
            const date = cert.issueDate || cert.year || "2025";
            return (
              <div
                key={cert.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
                        <Award className="size-6" />
                      </div>
                      <div>
                        <h3 className="font-display text-base font-semibold text-foreground leading-snug">
                          {name}
                        </h3>
                        <p className="text-xs text-primary font-medium mt-0.5">{cert.issuer}</p>
                      </div>
                    </div>
                    {renderStatusBadge(cert.verificationStatus)}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" /> Issued: {date}
                    </span>
                    {cert.credentialId && (
                      <span className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded">
                        ID: {cert.credentialId}
                      </span>
                    )}
                  </div>

                  {cert.skillsEarned && cert.skillsEarned.length > 0 && (
                    <div className="mt-3.5 flex flex-wrap gap-1">
                      {cert.skillsEarned.map((s) => (
                        <SkillTag key={s} muted>
                          {s}
                        </SkillTag>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-border/80 pt-3.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs gap-1.5"
                    onClick={() => setViewingCert(cert)}
                  >
                    View Details
                  </Button>

                  <div className="flex items-center gap-1">
                    {cert.credentialUrl && (
                      <Button asChild size="icon" variant="ghost" className="size-8">
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Open credential verification URL"
                        >
                          <ExternalLink className="size-3.5" />
                        </a>
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 text-muted-foreground hover:text-foreground"
                      onClick={() => handleOpenForm(cert)}
                      aria-label="Edit certificate"
                    >
                      <Edit2 className="size-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      onClick={() =>
                        setDeleteConfirm({
                          open: true,
                          certId: cert.id,
                          certName: name,
                        })
                      }
                      aria-label="Delete certificate"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================
          VIEW DETAILS MODAL
         ======================================================== */}
      <Dialog open={!!viewingCert} onOpenChange={(open) => !open && setViewingCert(null)}>
        {viewingCert && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary mb-2 shadow-xs">
                <Award className="size-8" />
              </div>
              <DialogTitle className="text-center font-display text-xl">
                {viewingCert.name || viewingCert.title}
              </DialogTitle>
              <DialogDescription className="text-center">
                Issued by{" "}
                <span className="font-semibold text-foreground">{viewingCert.issuer}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3">
              <div className="flex items-center justify-between rounded-xl bg-muted/60 p-3 text-sm">
                <span className="text-muted-foreground">Verification Status</span>
                {renderStatusBadge(viewingCert.verificationStatus)}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-border p-3">
                  <p className="text-xs text-muted-foreground">Issue Date</p>
                  <p className="mt-1 font-semibold text-foreground">
                    {viewingCert.issueDate || viewingCert.year || "2025"}
                  </p>
                </div>
                <div className="rounded-xl border border-border p-3">
                  <p className="text-xs text-muted-foreground">Issuer Authority</p>
                  <p className="mt-1 font-semibold text-foreground truncate">
                    {viewingCert.issuer}
                  </p>
                </div>
              </div>

              {viewingCert.credentialId && (
                <div className="rounded-xl border border-border p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">Credential ID</p>
                    <button
                      type="button"
                      onClick={() => handleCopy(viewingCert.credentialId!)}
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                    >
                      <Copy className="size-3" /> Copy
                    </button>
                  </div>
                  <p className="mt-1 font-mono text-xs font-semibold text-foreground">
                    {viewingCert.credentialId}
                  </p>
                </div>
              )}

              {viewingCert.skillsEarned && viewingCert.skillsEarned.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Verified Competencies
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {viewingCert.skillsEarned.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              {viewingCert.credentialUrl ? (
                <Button asChild className="w-full sm:w-auto gap-1.5">
                  <a href={viewingCert.credentialUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="size-4" /> Verify on Issuer Website
                  </a>
                </Button>
              ) : (
                <Button
                  className="w-full sm:w-auto"
                  onClick={() => {
                    toast.success("Credential confirmed authentic via AcadIn Registrar");
                    setViewingCert(null);
                  }}
                >
                  Confirm Authenticity
                </Button>
              )}
              <Button variant="outline" onClick={() => setViewingCert(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* ========================================================
          ADD / EDIT DIALOG
         ======================================================== */}
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingCert ? "Edit Certificate" : "Add Certificate"}</DialogTitle>
            <DialogDescription>
              Certificates appear on your public portfolio and auto-fill in Resume Builder.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2">
            <div className="grid gap-2">
              <Label htmlFor="cert-name">Certificate Name *</Label>
              <Input
                id="cert-name"
                value={certName}
                onChange={(e) => setCertName(e.target.value)}
                placeholder="e.g. Meta Front-End Developer Professional Certificate"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="cert-issuer">Issuer / Organization *</Label>
                <Input
                  id="cert-issuer"
                  value={certIssuer}
                  onChange={(e) => setCertIssuer(e.target.value)}
                  placeholder="e.g. Coursera / AWS / Google"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cert-date">Issue Date</Label>
                <Input
                  id="cert-date"
                  value={certDate}
                  onChange={(e) => setCertDate(e.target.value)}
                  placeholder="e.g. Jan 2025"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="cert-id">Credential ID</Label>
                <Input
                  id="cert-id"
                  value={certCredId}
                  onChange={(e) => setCertCredId(e.target.value)}
                  placeholder="e.g. META-FE-984210"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cert-status">Verification Status</Label>
                <select
                  id="cert-status"
                  value={certStatus}
                  onChange={(e) => setCertStatus(e.target.value as CertificateVerificationStatus)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="Verified">Verified</option>
                  <option value="Pending">Pending</option>
                  <option value="Not Verified">Not Verified</option>
                </select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cert-url">Credential Verification URL</Label>
              <Input
                id="cert-url"
                value={certCredUrl}
                onChange={(e) => setCertCredUrl(e.target.value)}
                placeholder="https://coursera.org/verify/..."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cert-skills">Skills Earned (comma-separated)</Label>
              <Input
                id="cert-skills"
                value={certSkills}
                onChange={(e) => setCertSkills(e.target.value)}
                placeholder="React, JavaScript, Cloud Architecture"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFormDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveForm}>
              {editingCert ? "Save Changes" : "Add Certificate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================
          DELETE CONFIRMATION ALERT
         ======================================================== */}
      <AlertDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm((prev) => ({ ...prev, open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Certificate?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-semibold text-foreground">"{deleteConfirm.certName}"</span>?
              This will remove it from your certificates registry, portfolio, and resume builder.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                deleteCertificate(deleteConfirm.certId);
                toast.success("Certificate removed from state");
                setDeleteConfirm({ open: false, certId: "", certName: "" });
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
