import { createFileRoute } from "@tanstack/react-router";
import { PortalPage } from "@/components/skillbridge/portal";

export const Route = createFileRoute("/institution/partners")({
  component: () => <PortalPage role="institution" section="partners" />,
});
