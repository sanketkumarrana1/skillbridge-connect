import { createFileRoute } from "@tanstack/react-router";
import { PortalPage } from "@/components/skillbridge/portal";
export const Route = createFileRoute("/academician/training")({
  component: () => <PortalPage role="academician" section="training" />,
});
