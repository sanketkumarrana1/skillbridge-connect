import { createFileRoute } from "@tanstack/react-router";
import { VerifyEmailPage } from "@/components/skillbridge/portal";

export const Route = createFileRoute("/verify-email")({ component: VerifyEmailPage });
