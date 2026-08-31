import { useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ExternalLink,
  Globe,
  GraduationCap,
  IndianRupee,
  Mail,
  Phone,
  Plus,
  Search,
  Sparkles,
  UserCheck,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionCard, Stat, WorkspaceHeader } from "@/components/skillbridge/student-ui";
import { useAppState } from "@/context/app-state";
import type { RecruiterPartner } from "@/types";

export function InstitutionRecruiters() {
  const { recruiterPartners, addRecruiterPartner } = useAppState();

  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [selectedRecruiter, setSelectedRecruiter] = useState<RecruiterPartner | null>(null);

  // Invite Modal State
  const [inviteOpen, setInviteOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [tier, setTier] = useState<"Tier 1 (Dream)" | "Tier 2 (Super Dream)" | "Tier 3 (Core)">(
    "Tier 1 (Dream)",
  );

  const handleAddRecruiter = () => {
    if (!companyName.trim() || !contactEmail.trim()) {
      toast.error("Please fill in company name and contact email.");
      return;
    }

    addRecruiterPartner({
      id: `rec-${Date.now()}`,
      companyName: companyName.trim(),
      industry: industry.trim() || "Technology & Software Services",
      tier,
      status: "New Request",
      contactPerson: contactName.trim() || "Talent Acquisition Team",
      contactEmail: contactEmail.trim(),
      contactPhone: "+91 80 1234 5678",
      logoHue: 200,
      jobsPosted: 2,
      internshipsPosted: 2,
      hiresCount: 0,
      avgPackageLPA: 12.0,
      workshopsConducted: 0,
      mentorshipPrograms: 0,
      openRoles: ["Associate Software Engineer", "Graduate Engineering Trainee"],
      lastEngagementDate: "Just now",
      website: "https://company.example.com",
      description: "Invited recruitment and internship partner.",
    });

    setInviteOpen(false);
    setCompanyName("");
    setIndustry("");
    setContactName("");
    setContactEmail("");
    toast.success(`🎉 Recruiter partnership invitation dispatched to ${companyName}!`);
  };

  const filtered = useMemo(() => {
    return recruiterPartners.filter((rec) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        rec.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTier = tierFilter === "all" || rec.tier.includes(tierFilter);

      return matchesSearch && matchesTier;
    });
  }, [recruiterPartners, searchQuery, tierFilter]);

  const totalHires = recruiterPartners.reduce((acc, r) => acc + r.hiresCount, 0);
  const totalJobs = recruiterPartners.reduce((acc, r) => acc + r.jobsPosted, 0);
  const totalWorkshops = recruiterPartners.reduce((acc, r) => acc + r.workshopsConducted, 0);

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        eyebrow="Corporate Relations & Industry Consortium"
        title="Recruiter Partnerships & Enterprise Engagement"
        description="Cultivate long-term hiring partnerships, track campus recruitment drives, schedule corporate masterclasses, and manage Tier 1/2 employer relations."
        action={
          <Button onClick={() => setInviteOpen(true)} className="gap-1.5">
            <Plus className="size-4" /> Invite New Recruiter
          </Button>
        }
      />

      {/* KPI Ribbon */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Partner Enterprises"
          value={recruiterPartners.length.toString()}
          trend="Hiring Accounts"
          icon={Building2}
        />
        <Stat
          label="Hires Confirmed"
          value={totalHires.toString()}
          trend="All Tiers"
          icon={UserCheck}
        />
        <Stat
          label="Open Opportunities"
          value={totalJobs.toString()}
          trend="Active Postings"
          icon={Briefcase}
        />
        <Stat
          label="Corporate Workshops"
          value={totalWorkshops.toString()}
          trend="Industry Sessions"
          icon={BookOpen}
        />
      </div>

      {/* Main Recruiter Directory */}
      <SectionCard
        title={
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold">
              Corporate Partner Network ({filtered.length})
            </h2>

            <div className="flex items-center gap-2">
              <div className="relative w-48 sm:w-60">
                <Search className="absolute left-2.5 top-2 size-3.5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search partner, industry..."
                  className="pl-8 h-8 text-xs"
                />
              </div>

              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="h-8 rounded-md border border-input bg-transparent px-2 text-xs shadow-xs"
              >
                <option value="all">All Tiers</option>
                <option value="Tier 1">Tier 1 (Dream)</option>
                <option value="Tier 2">Tier 2 (Super Dream)</option>
                <option value="Tier 3">Tier 3 (Core)</option>
              </select>
            </div>
          </div>
        }
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-2">
          {filtered.map((rec) => {
            return (
              <Card
                key={rec.id}
                className="flex flex-col justify-between border border-border bg-card transition hover:border-primary/40 hover:shadow-md"
              >
                <CardContent className="p-5 space-y-3.5 flex flex-col justify-between h-full">
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-display text-base font-bold text-foreground line-clamp-1">
                          {rec.companyName}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-1">{rec.industry}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          rec.tier.includes("Tier 1")
                            ? "bg-purple-500/10 text-purple-600 border-purple-500/20 text-[10px]"
                            : rec.tier.includes("Tier 2")
                              ? "bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px]"
                              : "text-[10px]"
                        }
                      >
                        {rec.tier}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {rec.description}
                    </p>

                    {/* Engagement Numbers Matrix */}
                    <div className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-muted/30 border border-border text-center text-xs">
                      <div>
                        <p className="text-[10px] text-muted-foreground">Hires</p>
                        <p className="font-bold text-emerald-600">{rec.hiresCount}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">Avg CTC</p>
                        <p className="font-bold text-foreground">₹{rec.avgPackageLPA}L</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">Workshops</p>
                        <p className="font-bold text-primary">{rec.workshopsConducted}</p>
                      </div>
                    </div>

                    <div className="text-[11px] text-muted-foreground space-y-0.5 pt-1">
                      <p className="truncate">Contact: {rec.contactPerson}</p>
                      <p className="truncate text-primary">{rec.contactEmail}</p>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-3 border-t border-border flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">
                      Active: {rec.lastEngagementDate}
                    </span>

                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs"
                      onClick={() => setSelectedRecruiter(rec)}
                    >
                      Company Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </SectionCard>

      {/* Recruiter Full Profile Dialog */}
      <Dialog
        open={!!selectedRecruiter}
        onOpenChange={(open) => !open && setSelectedRecruiter(null)}
      >
        {selectedRecruiter && (
          <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-primary text-[10px]">
                  {selectedRecruiter.tier}
                </Badge>
                <Badge variant="secondary" className="text-[10px]">
                  {selectedRecruiter.status}
                </Badge>
              </div>
              <DialogTitle className="text-xl font-bold font-display text-foreground">
                {selectedRecruiter.companyName}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {selectedRecruiter.industry}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {selectedRecruiter.description}
              </p>

              {/* Recruitment Performance Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-muted/30 border border-border text-center text-xs">
                <div>
                  <p className="text-[10px] text-muted-foreground">Confirmed Hires</p>
                  <p className="font-bold text-emerald-600 text-sm">
                    {selectedRecruiter.hiresCount}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Average CTC</p>
                  <p className="font-bold text-foreground text-sm">
                    ₹{selectedRecruiter.avgPackageLPA} LPA
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Jobs Posted</p>
                  <p className="font-bold text-foreground text-sm">
                    {selectedRecruiter.jobsPosted}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Internships</p>
                  <p className="font-bold text-primary text-sm">
                    {selectedRecruiter.internshipsPosted}
                  </p>
                </div>
              </div>

              {/* Point of Contact */}
              <div className="p-3 rounded-xl border border-border bg-card space-y-1.5 text-xs">
                <h4 className="font-bold uppercase tracking-wider text-primary text-[10px]">
                  Primary Campus Relationship Manager
                </h4>
                <p className="font-semibold text-foreground">{selectedRecruiter.contactPerson}</p>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground pt-1">
                  <span className="flex items-center gap-1">
                    <Mail className="size-3 text-primary" /> {selectedRecruiter.contactEmail}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="size-3 text-primary" /> {selectedRecruiter.contactPhone}
                  </span>
                </div>
              </div>

              {/* Open Job & Internship Roles */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-1.5">
                  Current Campus Openings
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRecruiter.openRoles.map((role) => (
                    <Badge key={role} variant="secondary" className="text-xs">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="border-t border-border pt-3">
              <Button variant="outline" onClick={() => setSelectedRecruiter(null)}>
                Close Profile
              </Button>
              <Button
                className="gap-1.5"
                onClick={() => {
                  toast.success(`Opening portal connection with ${selectedRecruiter.companyName}`);
                  setSelectedRecruiter(null);
                }}
              >
                <Sparkles className="size-4" /> Message Recruiter
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Invite Recruiter Modal */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Corporate Hiring Partner</DialogTitle>
            <DialogDescription>
              Onboard a new enterprise to recruit student talent and sponsor faculty fellowships.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid gap-2">
              <Label>Company Name *</Label>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. NVIDIA Corporation"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Industry Sector</Label>
                <Input
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g. Semiconductor & AI"
                />
              </div>
              <div className="grid gap-2">
                <Label>Partnership Tier</Label>
                <select
                  value={tier}
                  onChange={(e) =>
                    setTier(
                      e.target.value as "Tier 1 (Dream)" | "Tier 2 (Super Dream)" | "Tier 3 (Core)",
                    )
                  }
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                >
                  <option value="Tier 1 (Dream)">Tier 1 (Dream)</option>
                  <option value="Tier 2 (Super Dream)">Tier 2 (Super Dream)</option>
                  <option value="Tier 3 (Core)">Tier 3 (Core)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Contact Person</Label>
                <Input
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Anjali Gupta"
                />
              </div>
              <div className="grid gap-2">
                <Label>Contact Email *</Label>
                <Input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="e.g. university@nvidia.com"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRecruiter} className="gap-1.5">
              <Sparkles className="size-4" /> Send Partnership Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
