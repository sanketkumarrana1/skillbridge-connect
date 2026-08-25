import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordForm } from "@/components/skillbridge/portal";

export const Route = createFileRoute("/forgot-password")({ component: ForgotPasswordForm });
