import { useState, useMemo } from "react";
import {
  CheckCircle2,
  Database,
  Edit2,
  Filter,
  Plus,
  Power,
  Search,
  Sparkles,
  Tag,
  Trash2,
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
import { SKILL_CATEGORIES } from "@/data/skills-catalog";
import { cn } from "@/lib/utils";
import type { SkillCategory, SkillDefinition } from "@/types";

export function AdminSkillsView() {
  const { platformSkills, addSkillByAdmin, toggleSkillActiveByAdmin } = useAppState();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Add Skill Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>("Web & Frontend");
  const [newSkillDesc, setNewSkillDesc] = useState("");

  const filteredSkills = useMemo(() => {
    return platformSkills.filter((s) => {
      const matchSearch =
        !searchQuery ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = categoryFilter === "all" || s.category === categoryFilter;

      return matchSearch && matchCategory;
    });
  }, [platformSkills, searchQuery, categoryFilter]);

  const handleAddSkill = () => {
    if (!newSkillName.trim()) {
      toast.error("Please provide a skill name.");
      return;
    }

    addSkillByAdmin({
      name: newSkillName.trim(),
      category: newSkillCategory,
      description: newSkillDesc.trim() || "Competency verified skill definition in AcadIn.",
      aliases: [],
      relatedSkills: [],
      tags: ["verified", "admin-curated"],
      isActive: true,
    });

    toast.success(`Added skill '${newSkillName}' to taxonomy.`);
    setAddModalOpen(false);
    setNewSkillName("");
    setNewSkillDesc("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            Skill Taxonomy & Competency Engine
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Standardized skills taxonomy powering matching algorithms, assessments, and AI gap analyses.
          </p>
        </div>

        <Button
          onClick={() => setAddModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs h-9"
        >
          <Plus className="size-4 mr-1.5" /> Define New Skill
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skill by name or category..."
            className="pl-9 text-xs h-10 border-white/10 bg-slate-900 text-white"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-slate-300"
        >
          <option value="all">All Categories ({platformSkills.length})</option>
          {SKILL_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Skills Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-3.5">Skill Name</th>
                <th className="px-5 py-3.5">Domain Category</th>
                <th className="px-5 py-3.5">Description & Aliases</th>
                <th className="px-5 py-3.5">Taxonomy Status</th>
                <th className="px-5 py-3.5 text-right">Toggle Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-slate-300">
              {filteredSkills.map((skill) => {
                const isActive = skill.isActive !== false;
                return (
                  <tr key={skill.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-white flex items-center gap-2">
                      <Tag className="size-3.5 text-indigo-400" />
                      {skill.name}
                    </td>

                    <td className="px-5 py-3.5">
                      <Badge className="bg-slate-800 text-slate-300 border-white/10 text-[10px]">
                        {skill.category}
                      </Badge>
                    </td>

                    <td className="px-5 py-3.5 text-slate-400 text-[11px] max-w-xs truncate">
                      {skill.description || (skill.aliases ? skill.aliases.join(", ") : "Standard skill")}
                    </td>

                    <td className="px-5 py-3.5">
                      <Badge
                        className={cn(
                          "text-[10px] font-semibold",
                          isActive
                            ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                            : "bg-slate-800 text-slate-500 border-white/10",
                        )}
                      >
                        {isActive ? "Active in Matching Engine" : "Deactivated"}
                      </Badge>
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          toggleSkillActiveByAdmin(skill.id);
                          toast.success(`Toggled active state for '${skill.name}'.`);
                        }}
                        className={cn(
                          "h-7 px-2 text-xs",
                          isActive
                            ? "text-rose-400 hover:bg-rose-500/10"
                            : "text-emerald-400 hover:bg-emerald-500/10",
                        )}
                      >
                        <Power className="size-3 mr-1" />
                        {isActive ? "Deactivate" : "Activate"}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD SKILL MODAL */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="border-white/10 bg-[#0E1322]/95 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold text-white flex items-center gap-2">
              <Database className="size-5 text-indigo-400" />
              Define New Competency Skill
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Add a verified skill definition to the AcadIn ecosystem taxonomy.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-300">Skill Name *</Label>
              <Input
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="e.g. Distributed Consensus (Raft/Paxos), Vector Search"
                className="border-white/10 bg-slate-900 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-300">Taxonomy Category</Label>
              <select
                value={newSkillCategory}
                onChange={(e) => setNewSkillCategory(e.target.value as any)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white"
              >
                {SKILL_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-300">Description</Label>
              <Textarea
                value={newSkillDesc}
                onChange={(e) => setNewSkillDesc(e.target.value)}
                placeholder="Description of skill competency and industry relevance..."
                rows={2}
                className="border-white/10 bg-slate-900 text-xs text-white"
              />
            </div>
          </div>

          <DialogFooter className="border-t border-white/10 pt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAddModalOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleAddSkill}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
            >
              Add Skill to Library
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

