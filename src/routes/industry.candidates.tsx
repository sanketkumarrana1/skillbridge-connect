import { createFileRoute } from "@tanstack/react-router";
import { PortalPage } from "@/components/skillbridge/portal";

export const Route = createFileRoute("/industry/candidates")({
  component: () => <PortalPage role="industry" section="candidates" />,
});
