import { createFileRoute } from "@tanstack/react-router";
import { PortalPage } from "@/components/skillbridge/portal";

export const Route = createFileRoute("/student/passport")({
  component: () => <PortalPage role="student" section="passport" />,
});
