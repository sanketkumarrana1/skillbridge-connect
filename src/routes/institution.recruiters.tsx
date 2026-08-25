import { createFileRoute } from "@tanstack/react-router";
import { PortalPage } from "@/components/skillbridge/portal";
export const Route = createFileRoute("/institution/recruiters")({
  component: () => <PortalPage role="institution" section="recruiters" />,
});
