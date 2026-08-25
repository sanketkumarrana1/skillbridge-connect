import { createFileRoute } from "@tanstack/react-router";
import { PortalPage } from "@/components/skillbridge/portal";

export const Route = createFileRoute("/industry/post")({
  component: () => <PortalPage role="industry" section="post" />,
});
