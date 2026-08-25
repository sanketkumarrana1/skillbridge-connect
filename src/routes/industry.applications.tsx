import { createFileRoute } from "@tanstack/react-router";
import { PortalPage } from "@/components/skillbridge/portal";

export const Route = createFileRoute("/industry/applications")({
  component: () => <PortalPage role="industry" section="applications" />,
});
