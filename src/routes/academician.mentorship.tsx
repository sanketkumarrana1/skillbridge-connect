import { createFileRoute } from "@tanstack/react-router";
import { PortalPage } from "@/components/skillbridge/portal";
export const Route = createFileRoute("/academician/mentorship")({
  component: () => <PortalPage role="academician" section="mentorship" />,
});
