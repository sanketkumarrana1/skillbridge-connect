import { createFileRoute } from "@tanstack/react-router";
import { PortalPage } from "@/components/skillbridge/portal";

export const Route = createFileRoute("/student/portfolio")({
  component: () => <PortalPage role="student" section="portfolio" />,
});
