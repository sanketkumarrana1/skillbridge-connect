import { createFileRoute } from "@tanstack/react-router";
import { PortalPage } from "@/components/skillbridge/portal";

export const Route = createFileRoute("/academician/assessments")({
  component: () => <PortalPage role="academician" section="assessments" />,
});
