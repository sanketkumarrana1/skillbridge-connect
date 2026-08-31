import { createFileRoute } from "@tanstack/react-router";
import { VerifyEmailPage } from "@/components/skillbridge/portal";

export const Route = createFileRoute("/verify-email")({
  head: () => ({
    meta: [
      { title: "Verify Your Email — AcadIn" },
      { name: "description", content: "Confirm your email address to activate your AcadIn workspace." },
    ],
  }),
  component: VerifyEmailPage,
});
