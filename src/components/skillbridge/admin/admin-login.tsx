import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppState } from "@/context/app-state";
import { useAuth } from "@/context/auth-context";

export function AdminLoginView() {
  const { authenticateAdmin } = useAppState();
  const { signIn, isConfigured, loading, signOut, roles } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@acadin.internal");
  const [password, setPassword] = useState("masteradmin2026");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isConfigured) {
      const res = await signIn(email, password);
      if (res.error) {
        toast.error(res.error);
        return;
      }
      if (res.data?.user) {
        authenticateAdmin(email, password);
        toast.success("Welcome back, Administrator!");
        navigate({ to: "/admin/dashboard" });
      }
    } else {
      const success = authenticateAdmin(email, password);
      if (success) {
        toast.success("Welcome back, Superadmin!");
        navigate({ to: "/admin/dashboard" });
      } else {
        toast.error("Invalid administrator credentials.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] flex flex-col items-center justify-center p-4 selection:bg-indigo-500 selection:text-white">
      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="size-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-rose-600 flex items-center justify-center text-white mx-auto shadow-[0_0_25px_rgba(99,102,241,0.5)]">
            <ShieldCheck className="size-6" />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-white tracking-tight">
            AcadIn Administration Console
          </h1>
          <p className="text-xs text-slate-400">
            Restricted access for platform governors, moderators & compliance auditors.
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 shadow-[0_0_40px_rgba(0,0,0,0.6)] space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-300">
                Authorized Administrator Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-white/10 bg-slate-950/80 text-white text-xs h-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-300">Security Passkey</Label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 border-white/10 bg-slate-950/80 text-white text-xs h-10"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 text-white font-bold text-xs h-10 shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:brightness-110"
              >
                Access Administration Console <ArrowRight className="size-4 ml-1.5" />
              </Button>
            </div>
          </form>

          {/* Quick Demo Credentials helper */}
          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/30 p-3.5 text-xs text-slate-300 space-y-1.5 font-mono">
            <p className="font-bold text-indigo-400 flex items-center gap-1.5">
              <Lock className="size-3.5" /> Demo Superadmin Credentials:
            </p>
            <p className="text-[11px] text-slate-400">
              Email: <span className="text-white">admin@acadin.internal</span>
            </p>
            <p className="text-[11px] text-slate-400">
              Password: <span className="text-white">masteradmin2026</span>
            </p>
          </div>
        </div>

        {/* Return to Public Portal */}
        <p className="text-center text-xs text-slate-500">
          Not an administrator?{" "}
          <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300">
            Return to User Login
          </Link>
        </p>
      </div>
    </div>
  );
}

