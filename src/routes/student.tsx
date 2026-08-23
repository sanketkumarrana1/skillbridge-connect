import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/skillbridge/dashboard-shell";

export const Route = createFileRoute("/student")({
  component: () => <DashboardShell role="student" />,
});
