import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowRight, Lock, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthFrame } from "@/components/skillbridge/portal";
import { useAuth } from "@/context/auth-context";

const passwordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordForm = z.infer<typeof passwordSchema>;

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set New Password — AcadIn" },
      { name: "description", content: "Choose a secure new password for your AcadIn workspace." },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const { updatePassword, isConfigured } = useAuth();
  const [isDone, setIsDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: PasswordForm) => {
    setSubmitting(true);
    if (isConfigured) {
      const res = await updatePassword(values.password);
      if (res.error) {
        toast.error(res.error);
        setSubmitting(false);
        return;
      }
    }
    setSubmitting(false);
    setIsDone(true);
    toast.success("Password updated successfully!");
  };

  return (
    <AuthFrame
      title="Create new password"
      description="Choose a strong, secure password for your AcadIn account."
    >
      {isDone ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <CheckCircle2 className="size-5" />
              Password Successfully Updated
            </div>
            <p className="text-xs text-emerald-300/80 leading-relaxed">
              Your credentials have been securely updated. You may now sign in to your workspace.
            </p>
          </div>
          <Button
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold"
            onClick={() => navigate({ to: "/login" })}
          >
            Continue to Sign In <ArrowRight className="size-4 ml-1.5" />
          </Button>
        </div>
      ) : (
        <form className="mt-6 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-1.5">
            <Label htmlFor="reset-pass" className="text-xs font-semibold text-slate-300">
              New Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
              <Input
                id="reset-pass"
                type="password"
                placeholder="At least 6 characters"
                className="border-white/10 bg-slate-900/80 pl-10 text-white"
                {...form.register("password")}
              />
            </div>
            {form.formState.errors.password && (
              <p className="text-xs text-rose-400">{form.formState.errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reset-confirm" className="text-xs font-semibold text-slate-300">
              Confirm New Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
              <Input
                id="reset-confirm"
                type="password"
                placeholder="Re-enter your new password"
                className="border-white/10 bg-slate-900/80 pl-10 text-white"
                {...form.register("confirmPassword")}
              />
            </div>
            {form.formState.errors.confirmPassword && (
              <p className="text-xs text-rose-400">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:brightness-110"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Updating Password..." : "Update Password"} <ArrowRight className="size-4 ml-1.5" />
          </Button>

          <p className="text-center text-xs text-slate-400">
            <Link className="font-semibold text-indigo-400 hover:text-indigo-300" to="/login">
              Cancel and Return to Sign In
            </Link>
          </p>
        </form>
      )}
    </AuthFrame>
  );
}

