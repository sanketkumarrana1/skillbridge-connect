import { createFileRoute } from "@tanstack/react-router";
import { PortalPage } from "@/components/skillbridge/portal";
export const Route = createFileRoute("/institution/skills")({
  component: () => <PortalPage role="institution" section="skills" />,
});
