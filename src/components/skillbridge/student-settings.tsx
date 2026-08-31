import { useState } from "react";
import {
  Award,
  BookOpen,
  Briefcase,
  Check,
  CheckCircle2,
  Code2,
  Compass,
  GraduationCap,
  Plus,
  RotateCcw,
  Save,
  Search,
  Sparkles,
  Target,
  Trash2,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useAppState } from "@/context/app-state";
import { CAREER_INTERESTS, TARGET_ROLES } from "@/data/career-catalog";
import type { AcademicProfile, CareerPreferences } from "@/types";

export function StudentSettings() {
  const { profile, updateProfile, updateAcademicProfile, updateCareerPreferences } = useAppState();

  // Tab 1: Personal
  const [name, setName] = useState(profile.name || "");
  const [email, setEmail] = useState(profile.email || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [headline, setHeadline] = useState(profile.headline || "");
  const [about, setAbout] = useState(profile.about || "");
  const [city, setCity] = useState(profile.city || "Raipur");
  const [state, setState] = useState(profile.state || "Chhattisgarh");
  const [country, setCountry] = useState(profile.country || "India");

  // Tab 2: Academic
  const [institution, setInstitution] = useState(
    profile.academicProfile?.institution || profile.college || "",
  );
  const [degree, setDegree] = useState(
    profile.academicProfile?.degree || profile.degree || "B.Tech",
  );
  const [program, setProgram] = useState(profile.academicProfile?.program || profile.branch || "");
  const [department, setDepartment] = useState(profile.academicProfile?.department || "");
  const [currentYear, setCurrentYear] = useState(
    profile.academicProfile?.currentYear || profile.year || "3rd Year",
  );
  const [graduationYear, setGraduationYear] = useState(
    profile.academicProfile?.graduationYear || "2026",
  );
  const [academicStatus, setAcademicStatus] = useState(
    profile.academicProfile?.academicStatus || "Pursuing Full-Time",
  );
  const [grade, setGrade] = useState(profile.academicProfile?.grade || "");

  // Tab 3: Career & Roles
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    profile.careerPreferences?.careerInterests?.length
      ? profile.careerPreferences.careerInterests
      : profile.interests || [],
  );
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    profile.careerPreferences?.targetRoles?.length
      ? profile.careerPreferences.targetRoles
      : ["Full Stack Developer", "Frontend Developer"],
  );

  // Tab 4: Work & Opportunity Preferences
  const [preferredWorkTypes, setPreferredWorkTypes] = useState<string[]>(
    profile.careerPreferences?.preferredWorkTypes?.length
      ? profile.careerPreferences.preferredWorkTypes
      : ["Internship", "Full-time"],
  );
  const [preferredLocations, setPreferredLocations] = useState<string[]>(
    profile.careerPreferences?.preferredLocations?.length
      ? profile.careerPreferences.preferredLocations
      : ["Hybrid", "Remote"],
  );
  const [preferredCities, setPreferredCities] = useState<string[]>(
    profile.careerPreferences?.preferredCities?.length
      ? profile.careerPreferences.preferredCities
      : ["Bengaluru", "Hyderabad", "Pune"],
  );
  const [cityInput, setCityInput] = useState("");
  const [availability, setAvailability] = useState(
    profile.careerPreferences?.availability || "Summer 2026",
  );
  const [targetOpportunityTypes, setTargetOpportunityTypes] = useState<string[]>(
    profile.careerPreferences?.targetOpportunityTypes?.length
      ? profile.careerPreferences.targetOpportunityTypes
      : ["Internship", "Job", "Live Project"],
  );

  const handleSaveAll = () => {
    const academicPayload: AcademicProfile = {
      institution: institution.trim(),
      degree: degree.trim(),
      program: program.trim(),
      department: department.trim(),
      currentYear,
      graduationYear,
      academicStatus,
      grade: grade.trim() || undefined,
    };

    const careerPrefsPayload: CareerPreferences = {
      careerInterests: selectedInterests,
      targetRoles: selectedRoles,
      preferredWorkTypes: preferredWorkTypes as CareerPreferences["preferredWorkTypes"],
      preferredLocations: preferredLocations as CareerPreferences["preferredLocations"],
      preferredCities,
      availability,
      targetOpportunityTypes: targetOpportunityTypes as CareerPreferences["targetOpportunityTypes"],
    };

    updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      headline: headline.trim(),
      about: about.trim(),
      city: city.trim(),
      state: state.trim(),
      country: country.trim(),
      location: `${city.trim()}, ${country.trim()}`,
      college: institution.trim(),
      degree: degree.trim(),
      branch: program.trim(),
      year: currentYear,
      interests: selectedInterests,
      academicProfile: academicPayload,
      careerPreferences: careerPrefsPayload,
    });

    toast.success("Profile and career preferences saved successfully!");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-indigo-400">
            Student Profile Settings
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Manage Your Talent Profile
          </h1>
          <p className="mt-1.5 text-sm text-slate-400 max-w-2xl">
            Update personal information, academic credentials, target roles, and opportunity
            preferences.
          </p>
        </div>

        <Button
          onClick={handleSaveAll}
          className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold shadow-[0_0_20px_rgba(99,102,241,0.4)]"
        >
          <Save className="size-4 mr-1.5" /> Save Changes
        </Button>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                if (window.confirm("Start completely fresh? This will clear any cached test progress in this browser and reload a clean slate.")) {
                  window.localStorage.clear();
                  window.location.reload();
                }
              }
            }}
            className="border-white/10 text-slate-300 hover:bg-white/5 font-medium text-xs h-10 px-4"
          >
            <RotateCcw className="size-3.5 mr-1.5" /> Start Fresh
          </Button>
          <Button
            onClick={handleSaveAll}
            className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold shadow-[0_0_20px_rgba(99,102,241,0.4)] h-10 px-5"
          >
            <Save className="size-4 mr-1.5" /> Save Changes
          </Button>
        </div>
      </div>

      {/* Tabs Layout */}
      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="bg-slate-900 border border-white/10 p-1 rounded-2xl flex-wrap h-auto">
          <TabsTrigger
            value="personal"
            className="rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-xs"
          >
            <User className="size-3.5 mr-1.5" /> Personal Info
          </TabsTrigger>
          <TabsTrigger
            value="academic"
            className="rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-xs"
          >
            <GraduationCap className="size-3.5 mr-1.5" /> Academic Profile
          </TabsTrigger>
          <TabsTrigger
            value="career"
            className="rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-xs"
          >
            <Target className="size-3.5 mr-1.5" /> Career & Roles
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-xs"
          >
            <Compass className="size-3.5 mr-1.5" /> Opportunity Goals
          </TabsTrigger>
        </TabsList>

        {/* ================= TAB 1: PERSONAL ================= */}
        <TabsContent value="personal">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="font-display text-xl font-bold text-white">Personal Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300">Full Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-white/10 bg-slate-900/80 text-white"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300">Email Address</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-white/10 bg-slate-900/80 text-white"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300">Phone Number</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border-white/10 bg-slate-900/80 text-white"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300">
                  Professional Headline
                </Label>
                <Input
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="border-white/10 bg-slate-900/80 text-white"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300">City</Label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="border-white/10 bg-slate-900/80 text-white"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300">State / Region</Label>
                <Input
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="border-white/10 bg-slate-900/80 text-white"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300">Country</Label>
                <Input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="border-white/10 bg-slate-900/80 text-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-300">About Me / Summary</Label>
              <Textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows={3}
                className="border-white/10 bg-slate-900/80 text-white text-xs leading-relaxed"
              />
            </div>
          </div>
        </TabsContent>

        {/* ================= TAB 2: ACADEMIC ================= */}
        <TabsContent value="academic">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="font-display text-xl font-bold text-white">Academic Credentials</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300">
                  University / College Name
                </Label>
                <Input
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="border-white/10 bg-slate-900/80 text-white"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-300">Degree</Label>
                  <Input
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="e.g. B.Tech / BCA"
                    className="border-white/10 bg-slate-900/80 text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-300">Program / Branch</Label>
                  <Input
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    placeholder="e.g. Computer Science & Engineering"
                    className="border-white/10 bg-slate-900/80 text-white"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-300">
                    Current Academic Year
                  </Label>
                  <select
                    value={currentYear}
                    onChange={(e) => setCurrentYear(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Graduated">Graduated</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-300">Graduation Year</Label>
                  <select
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-300">CGPA / Percentage</Label>
                  <Input
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="e.g. 8.85 CGPA"
                    className="border-white/10 bg-slate-900/80 text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ================= TAB 3: CAREER & ROLES ================= */}
        <TabsContent value="career">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-8">
            <div>
              <h3 className="font-display text-xl font-bold text-white">
                Career Interests & Target Roles
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Select your domain areas and target job positions.
              </p>
            </div>

            {/* Career Interests */}
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3 block">
                Career Interest Domains ({selectedInterests.length} selected)
              </Label>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {CAREER_INTERESTS.map((interest) => {
                  const isSelected = selectedInterests.includes(interest.name);
                  return (
                    <button
                      key={interest.id}
                      type="button"
                      onClick={() =>
                        setSelectedInterests((prev) =>
                          isSelected
                            ? prev.filter((i) => i !== interest.name)
                            : [...prev, interest.name],
                        )
                      }
                      className={cn(
                        "p-3 rounded-xl border text-left transition text-xs font-semibold flex items-center justify-between",
                        isSelected
                          ? "border-indigo-500 bg-indigo-500/20 text-white"
                          : "border-white/10 bg-slate-900/60 text-slate-400 hover:text-white",
                      )}
                    >
                      <span>{interest.name}</span>
                      {isSelected && <Check className="size-3.5 text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Roles */}
            <div className="border-t border-white/10 pt-6">
              <Label className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3 block">
                Target Roles ({selectedRoles.length} selected)
              </Label>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 max-h-[300px] overflow-y-auto pr-1">
                {TARGET_ROLES.map((role) => {
                  const isSelected = selectedRoles.includes(role.title);
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() =>
                        setSelectedRoles((prev) =>
                          isSelected ? prev.filter((r) => r !== role.title) : [...prev, role.title],
                        )
                      }
                      className={cn(
                        "p-3 rounded-xl border text-left transition text-xs font-semibold flex items-center justify-between",
                        isSelected
                          ? "border-purple-500 bg-purple-500/20 text-white"
                          : "border-white/10 bg-slate-900/60 text-slate-400 hover:text-white",
                      )}
                    >
                      <div>
                        <p className="text-white font-bold truncate">{role.title}</p>
                        <p className="text-[10px] text-slate-400 truncate">{role.category}</p>
                      </div>
                      {isSelected && <Check className="size-3.5 text-purple-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ================= TAB 4: PREFERENCES ================= */}
        <TabsContent value="preferences">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="font-display text-xl font-bold text-white">
              Work & Opportunity Preferences
            </h3>
            <div className="space-y-6">
              <div>
                <Label className="text-xs font-semibold text-slate-300">Preferred Work Type</Label>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {["Internship", "Full-time", "Part-time", "Freelance", "Apprenticeship"].map(
                    (item) => {
                      const isSelected = preferredWorkTypes.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() =>
                            setPreferredWorkTypes((prev) =>
                              isSelected ? prev.filter((w) => w !== item) : [...prev, item],
                            )
                          }
                          className={cn(
                            "px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition",
                            isSelected
                              ? "border-indigo-500 bg-indigo-500/20 text-white"
                              : "border-white/10 bg-slate-900/60 text-slate-400 hover:text-white",
                          )}
                        >
                          {item}
                        </button>
                      );
                    },
                  )}
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-300">
                  Preferred Work Location
                </Label>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {["On-site", "Hybrid", "Remote"].map((mode) => {
                    const isSelected = preferredLocations.includes(mode);
                    return (
                      <button
                        key={mode}
                        type="button"
                        onClick={() =>
                          setPreferredLocations((prev) =>
                            isSelected ? prev.filter((m) => m !== mode) : [...prev, mode],
                          )
                        }
                        className={cn(
                          "px-4 py-2 rounded-xl border text-xs font-semibold transition",
                          isSelected
                            ? "border-purple-500 bg-purple-500/20 text-white"
                            : "border-white/10 bg-slate-900/60 text-slate-400 hover:text-white",
                        )}
                      >
                        {mode}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-300">
                  Target Cities / Locations
                </Label>
                <div className="mt-2 flex flex-wrap gap-1.5 mb-2">
                  {preferredCities.map((city) => (
                    <Badge key={city} className="bg-slate-800 text-slate-200 border-white/10 gap-1">
                      {city}
                      <button
                        type="button"
                        onClick={() => setPreferredCities((prev) => prev.filter((c) => c !== city))}
                        className="hover:text-rose-300"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 max-w-sm">
                  <Input
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    placeholder="Add city..."
                    className="border-white/10 bg-slate-900/80 text-white text-xs h-9"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && cityInput.trim()) {
                        e.preventDefault();
                        if (!preferredCities.includes(cityInput.trim())) {
                          setPreferredCities((prev) => [...prev, cityInput.trim()]);
                        }
                        setCityInput("");
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    type="button"
                    onClick={() => {
                      if (cityInput.trim() && !preferredCities.includes(cityInput.trim())) {
                        setPreferredCities((prev) => [...prev, cityInput.trim()]);
                        setCityInput("");
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-300">
                    Joining Availability
                  </Label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Immediate">Immediate</option>
                    <option value="Within 1 Month">Within 1 Month</option>
                    <option value="Summer 2026">Summer 2026</option>
                    <option value="Winter 2026">Winter 2026</option>
                    <option value="Post Graduation">Post Graduation</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
