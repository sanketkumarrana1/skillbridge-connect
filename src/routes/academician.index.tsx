import { createFileRoute } from "@tanstack/react-router";
import { PortalPage } from "@/components/skillbridge/portal";
export const Route = createFileRoute("/academician/")({
  component: () => <PortalPage role="academician" />,
});
