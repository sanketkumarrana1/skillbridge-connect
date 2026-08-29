import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { ComponentType } from "react";

type IconType = ComponentType<{ className?: string }>;

export function WorkspaceHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-[.2em] text-indigo-400">{eyebrow}</p>
        )}
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          {title}
        </h1>
        <p className="mt-1.5 text-sm text-slate-400 max-w-2xl">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function SectionCard({
  title,
  action,
  children,
}: {
  title: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="glass-panel rounded-3xl p-6 sm:p-7">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        {typeof title === "string" ? (
          <h2 className="font-display text-lg font-bold text-white">{title}</h2>
        ) : (
          title
        )}
        {action}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function Stat({
  label,
  value,
  trend,
  icon: Icon,
}: {
  label: string;
  value: string;
  trend: string;
  icon: IconType;
}) {
  return (
    <div className="glass-card-interactive rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <span className="grid size-10 place-items-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.25)]">
          <Icon className="size-5" />
        </span>
        <span
          className={cn(
            "text-xs font-semibold",
            trend === "Pending" ? "text-slate-400" : "text-emerald-400",
          )}
        >
          {trend}
        </span>
      </div>
      <p className="mt-4 font-display text-3xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{label}</p>
    </div>
  );
}
