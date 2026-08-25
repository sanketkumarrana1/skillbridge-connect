import { createFileRoute } from "@tanstack/react-router";
import { PortalPage } from "@/components/skillbridge/portal";

export const Route = createFileRoute("/student/jobs")({
  component: () => <PortalPage role="student" section="jobs" />,
});
