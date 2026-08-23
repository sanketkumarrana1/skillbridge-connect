import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/skillbridge/dashboard-shell";

export const Route = createFileRoute("/industry")({
  component: () => <DashboardShell role="industry" />,
});
