import { useState, useMemo } from "react";
import {
  Ban,
  CheckCircle2,
  Filter,
  GraduationCap,
  MoreHorizontal,
  Search,
  Shield,
  ShieldAlert,
  User,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppState } from "@/context/app-state";
import { cn } from "@/lib/utils";
import type { PlatformUserRecord, PlatformUserStatus } from "@/types";

export function AdminUsersView() {
  const { platformUsers, togglePlatformUserStatus } = useAppState();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredUsers = useMemo(() => {
    return platformUsers.filter((u) => {
      const matchesSearch =
        !searchQuery ||
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.organizationOrCollege.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesStatus = statusFilter === "all" || u.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [platformUsers, searchQuery, roleFilter, statusFilter]);

  const handleToggleStatus = (user: PlatformUserRecord) => {
    const nextStatus: PlatformUserStatus = user.status === "Active" ? "Suspended" : "Active";
    togglePlatformUserStatus(user.id, nextStatus);
    toast.success(`User ${user.name} marked as ${nextStatus}.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            User Directory & Access Control
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage authenticated accounts, inspect role affiliations, and administer security status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-500/10 text-indigo-300 border-indigo-500/30 text-xs px-3 py-1">
            Total Records: {platformUsers.length}
          </Badge>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, college..."
            className="pl-9 text-xs h-10 border-white/10 bg-slate-900 text-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-slate-300"
          >
            <option value="all">All Stakeholder Roles</option>
            <option value="student">Students</option>
            <option value="academician">Academicians / Faculty</option>
            <option value="industry">Recruiters / Industry</option>
            <option value="institution">University Leadership</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-slate-300"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* User Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-3.5">User Details</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Organization / Institute</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Joined Date</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-slate-300">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8 border border-white/10">
                        <AvatarFallback className="bg-slate-800 text-indigo-300 font-bold text-xs">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-white leading-tight">{user.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-3.5">
                    <Badge
                      className={cn(
                        "text-[10px] uppercase font-semibold",
                        user.role === "student" && "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
                        user.role === "academician" && "bg-purple-500/10 text-purple-300 border-purple-500/20",
                        user.role === "industry" && "bg-blue-500/10 text-blue-300 border-blue-500/20",
                        user.role === "institution" && "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
                      )}
                    >
                      {user.role}
                    </Badge>
                  </td>

                  <td className="px-5 py-3.5 font-medium text-slate-300">
                    {user.organizationOrCollege}
                  </td>

                  <td className="px-5 py-3.5">
                    <Badge
                      className={cn(
                        "text-[10px] font-semibold",
                        user.status === "Active" && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                        user.status === "Pending" && "bg-amber-500/10 text-amber-400 border-amber-500/20",
                        user.status === "Suspended" && "bg-rose-500/10 text-rose-400 border-rose-500/20",
                      )}
                    >
                      {user.status}
                    </Badge>
                  </td>

                  <td className="px-5 py-3.5 text-slate-400 font-mono text-[11px]">
                    {user.joinedAt}
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggleStatus(user)}
                      className={cn(
                        "h-7 px-2.5 text-xs font-semibold",
                        user.status === "Active"
                          ? "text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                          : "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10",
                      )}
                    >
                      {user.status === "Active" ? (
                        <>
                          <Ban className="size-3 mr-1" /> Suspend
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="size-3 mr-1" /> Activate
                        </>
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

