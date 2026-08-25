import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/skillbridge/portal";

export const Route = createFileRoute("/register")({
  component: () => <AuthPage mode="register" />,
});
