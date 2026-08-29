import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/types";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-sm text-slate-400 max-w-2xl">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-card/80 p-5 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-primary/40 hover:shadow-[0_12px_40px_-8px_rgba(99,102,241,0.25)] hover:-translate-y-0.5">
      <div className="absolute -right-8 -top-8 size-24 rounded-full bg-primary/10 blur-2xl transition-opacity group-hover:opacity-100 opacity-60 pointer-events-none" />
      <div className="relative flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        {icon ? (
          <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-primary/30 bg-primary/15 text-primary shadow-[0_0_15px_rgba(99,102,241,0.25)] transition-transform duration-300 group-hover:scale-110">
            {icon}
          </span>
        ) : null}
      </div>
      <p className="relative mt-3 font-display text-3xl font-bold tracking-tight text-white">
        {value}
      </p>
      {hint ? <p className="relative mt-1 text-xs text-slate-400">{hint}</p> : null}
    </div>
  );
}

export function SkillBar({ name, score }: { name: string; score: number }) {
  const isHigh = score >= 75;
  const isMid = score >= 55;
  const toneGradient = isHigh
    ? "from-emerald-400 to-teal-400 shadow-[0_0_12px_rgba(52,211,153,0.4)]"
    : isMid
      ? "from-indigo-400 via-purple-400 to-pink-400 shadow-[0_0_12px_rgba(168,85,247,0.4)]"
      : "from-amber-400 to-orange-400 shadow-[0_0_12px_rgba(251,191,36,0.4)]";

  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="min-w-0 truncate font-medium text-slate-200">{name}</span>
        <span className="shrink-0 font-display font-semibold tabular-nums text-indigo-300">
          {score}%
        </span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full border border-white/5 bg-slate-900/80 p-[1px]">
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r transition-all duration-500",
            toneGradient,
          )}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export function MatchRing({ value, size = 72 }: { value: number; size?: number }) {
  const stroke = 7;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const id = `match-grad-${size}-${Math.round(value)}`;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className="stroke-slate-800/80"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * value) / 100}
          stroke={`url(#${id})`}
          className="transition-all duration-700"
          style={{ filter: "drop-shadow(0 0 6px rgba(129, 140, 248, 0.5))" }}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center font-display text-sm font-bold tabular-nums text-white">
        {value}%
      </span>
    </div>
  );
}

export function SkillTag({ children, muted }: { children: ReactNode; muted?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur-sm transition-colors",
        muted
          ? "border-white/10 bg-slate-800/60 text-slate-400"
          : "border-primary/30 bg-primary/15 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.15)]",
      )}
    >
      {children}
    </span>
  );
}

const statusStyles: Record<ApplicationStatus, string> = {
  Applied: "border-slate-700 bg-slate-800/80 text-slate-300",
  "Under Review":
    "border-amber-500/40 bg-amber-500/15 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.15)]",
  Shortlisted:
    "border-emerald-500/40 bg-emerald-500/15 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.15)]",
  Interview:
    "border-indigo-500/40 bg-indigo-500/15 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.15)]",
  "Interview Scheduled":
    "border-sky-500/40 bg-sky-500/15 text-sky-300 shadow-[0_0_10px_rgba(14,165,233,0.15)]",
  "Interview Completed":
    "border-violet-500/40 bg-violet-500/15 text-violet-300 shadow-[0_0_10px_rgba(139,92,246,0.15)]",
  Offered:
    "border-pink-500/40 bg-pink-500/15 text-pink-300 shadow-[0_0_10px_rgba(236,72,153,0.15)]",
  Selected:
    "border-emerald-500/40 bg-emerald-500/15 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.15)]",
  Hired:
    "border-purple-500/40 bg-purple-500/15 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.15)]",
  Rejected:
    "border-rose-500/40 bg-rose-500/15 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.15)]",
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm",
        statusStyles[status],
      )}
    >
      {status}
    </Badge>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-card/40 p-10 text-center backdrop-blur-sm">
      <p className="font-display text-lg font-semibold text-white">{title}</p>
      <p className="mt-1 text-sm text-slate-400">{description}</p>
    </div>
  );
}

export function CompanyMark({ name, hue = 255 }: { name: string; hue?: number | undefined }) {
  const finalHue = hue ?? 255;
  return (
    <span
      className="grid size-11 shrink-0 place-items-center rounded-xl font-display text-sm font-bold border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.35)]"
      style={{
        backgroundColor: `oklch(0.24 0.08 ${finalHue})`,
        color: `oklch(0.92 0.12 ${finalHue})`,
        borderColor: `oklch(0.45 0.14 ${finalHue} / 0.4)`,
        boxShadow: `0 0 16px -2px oklch(0.55 0.16 ${finalHue} / 0.25)`,
      }}
    >
      {name.slice(0, 2).toUpperCase()}
    </span>
  );
}
