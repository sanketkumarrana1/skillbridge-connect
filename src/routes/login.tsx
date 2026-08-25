import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/skillbridge/portal";

export const Route = createFileRoute("/login")({ component: () => <AuthPage mode="login" /> });
/* import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Building2, GraduationCap } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandMark } from "@/components/skillbridge/dashboard-shell";
import { useAppState } from "@/context/app-state";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — VedaaX" },
      {
        name: "description",
        content:
          "Log in to VedaaX as a student to track skill matches, or as an industry partner to manage internships and candidates.",
      },
      { property: "og:title", content: "Log in — VedaaX" },
      {
        property: "og:description",
        content: "Student and industry access to the VedaaX collaboration portal.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { setRole } = useAppState();
  const [role, setLocalRole] = useState<Role>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const enter = (r: Role) => {
    setRole(r);
    toast.success(`Signed in as ${r === "student" ? "student" : "industry partner"}`);
    navigate({ to: r === "student" ? "/student" : "/industry" });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Enter an email and password, or use a demo login.");
      return;
    }
    enter(role);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(50% 50% at 20% 20%, oklch(0.7 0.18 300 / 0.8), transparent 70%)",
          }}
        />
        <div className="relative">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-primary-foreground/15">
              <GraduationCap className="size-5" />
            </span>
            <span className="font-display text-lg font-semibold">VedaaX</span>
          </Link>
        </div>
        <div className="relative max-w-md">
          <h2 className="font-display text-3xl font-semibold leading-tight">
            One profile. Verified skills. Real internship matches.
          </h2>
          <p className="mt-4 text-sm leading-relaxed opacity-90">
            Students prove capability through assessments and projects. Industry partners see
            ranked candidates with skill overlap and gaps made explicit.
          </p>
        </div>
        <p className="relative text-xs opacity-70">
          Academia–Industry Collaboration Portal · Hackathon MVP
        </p>
      </div>

      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden">
            <BrandMark />
          </div>
          <h1 className="mt-6 font-display text-2xl font-semibold tracking-tight text-foreground lg:mt-0">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Log in to continue to your VedaaX workspace.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
            {(
              [
                { value: "student", label: "Student", icon: GraduationCap },
                { value: "industry", label: "Industry", icon: Building2 },
              ] as const
            ).map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setLocalRole(value)}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  role === value
                    ? "bg-card text-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-4" /> {label}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Log in
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Demo access
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Button variant="outline" onClick={() => enter("student")}>
              Demo student
            </Button>
            <Button variant="outline" onClick={() => enter("industry")}>
              Demo industry
            </Button>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            <Link to="/" className="underline underline-offset-4 hover:text-foreground">
              Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} */
