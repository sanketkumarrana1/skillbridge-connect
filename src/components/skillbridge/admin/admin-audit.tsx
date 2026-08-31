import { useState, useMemo } from "react";
import {
  Clock,
  Download,
  Filter,
  History,
  Search,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppState } from "@/context/app-state";
import { cn } from "@/lib/utils";

export function AdminAuditView() {
  const { adminAuditLogs } = useAppState();
  const [searchQuery, setSearchQuery] = useState("");
  const [entityFilter, setEntityFilter] = useState("all");

  const filteredLogs = useMemo(() => {
    return adminAuditLogs.filter((log) => {
      const matchSearch =
        !searchQuery ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.admin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.entityId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchEntity = entityFilter === "all" || log.entity === entityFilter;

      return matchSearch && matchEntity;
    });
  }, [adminAuditLogs, searchQuery, entityFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            Administrative Audit Trail & Immutable Log
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Complete chronological trail of all security verifications, moderation decisions, and system alterations.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.success("Exported cryptographic audit ledger to CSV.")}
          className="border-white/10 bg-slate-900 text-slate-300 hover:text-white text-xs h-8"
        >
          <Download className="size-3.5 mr-1.5" /> Export Audit Log
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search action, details, entity ID..."
            className="pl-9 text-xs h-10 border-white/10 bg-slate-900 text-white"
          />
        </div>

        <select
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-slate-300"
        >
          <option value="all">All Entities ({adminAuditLogs.length})</option>
          <option value="Company">Company Verifications</option>
          <option value="Opportunity">Opportunity Moderations</option>
          <option value="Skill">Skill Taxonomy</option>
          <option value="User">User Access Control</option>
          <option value="Institution">Institution Management</option>
          <option value="System">System Security</option>
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5">Admin Actor</th>
                <th className="px-5 py-3.5">Entity</th>
                <th className="px-5 py-3.5">Action Executed</th>
                <th className="px-5 py-3.5">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-slate-300">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {log.timestamp}
                  </td>

                  <td className="px-5 py-3.5 font-semibold text-white whitespace-nowrap">
                    {log.admin}
                  </td>

                  <td className="px-5 py-3.5">
                    <Badge
                      className={cn(
                        "text-[10px] font-semibold",
                        log.entity === "Company" && "bg-blue-500/10 text-blue-300 border-blue-500/20",
                        log.entity === "Opportunity" && "bg-purple-500/10 text-purple-300 border-purple-500/20",
                        log.entity === "Skill" && "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
                        log.entity === "User" && "bg-amber-500/10 text-amber-300 border-amber-500/20",
                        log.entity === "System" && "bg-rose-500/10 text-rose-300 border-rose-500/20",
                      )}
                    >
                      {log.entity} · {log.entityId}
                    </Badge>
                  </td>

                  <td className="px-5 py-3.5 font-bold text-white leading-tight">
                    {log.action}
                  </td>

                  <td className="px-5 py-3.5 text-slate-300 font-mono text-[11px] leading-relaxed">
                    {log.details}
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

