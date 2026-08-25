import { createFileRoute } from "@tanstack/react-router";
import { PortalPage } from "@/components/skillbridge/portal";

export const Route = createFileRoute("/student/roadmap")({
  component: () => <PortalPage role="student" section="roadmap" />,
});
