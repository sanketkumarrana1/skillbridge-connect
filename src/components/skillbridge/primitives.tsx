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
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
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
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {icon ? (
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            {icon}
          </span>
        ) : null}
      </div>
      <p className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function SkillBar({ name, score }: { name: string; score: number }) {
  const tone =
    score >= 75 ? "bg-success" : score >= 55 ? "bg-accent" : "bg-warning";
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="min-w-0 truncate font-medium text-foreground">{name}</span>
        <span className="shrink-0 tabular-nums text-muted-foreground">{score}%</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full rounded-full", tone)} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export function MatchRing({ value, size = 72 }: { value: number; size?: number }) {
  const stroke = 7;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className="stroke-muted"
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
          className="stroke-primary"
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center font-display text-sm font-semibold tabular-nums text-foreground">
        {value}%
      </span>
    </div>
  );
}

export function SkillTag({ children, muted }: { children: ReactNode; muted?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        muted
          ? "border-border bg-muted text-muted-foreground"
          : "border-primary/20 bg-primary/10 text-primary",
      )}
    >
      {children}
    </span>
  );
}

const statusStyles: Record<ApplicationStatus, string> = {
  Applied: "border-border bg-muted text-muted-foreground",
  "Under Review": "border-warning/30 bg-warning/10 text-warning-foreground",
  Shortlisted: "border-success/30 bg-success/10 text-success-foreground",
  Rejected: "border-destructive/30 bg-destructive/10 text-destructive",
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <Badge variant="outline" className={cn("rounded-full font-medium", statusStyles[status])}>
      {status}
    </Badge>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
      <p className="font-display text-lg font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function CompanyMark({ name, hue = 255 }: { name: string; hue?: number }) {
  return (
    <span
      className="grid size-11 shrink-0 place-items-center rounded-xl font-display text-sm font-semibold"
      style={{
        backgroundColor: `oklch(0.94 0.04 ${hue})`,
        color: `oklch(0.42 0.16 ${hue})`,
      }}
    >
      {name.slice(0, 2).toUpperCase()}
    </span>
  );
}
