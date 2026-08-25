import { createFileRoute } from "@tanstack/react-router";
import { PortalPage } from "@/components/skillbridge/portal";
export const Route = createFileRoute("/industry/workshops")({
  component: () => <PortalPage role="industry" section="workshops" />,
});
