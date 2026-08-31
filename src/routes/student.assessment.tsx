import { createFileRoute } from "@tanstack/react-router";
import { PortalPage } from "@/components/skillbridge/portal";

export const Route = createFileRoute("/student/assessment")({
  head: () => ({
    meta: [
      { title: "Skill Assessment — AcadIn" },
      {
        name: "description",
        content:
          "Take domain-calibrated adaptive assessments across technical competencies, algorithms, and system architecture.",
      },
      { property: "og:title", content: "Skill Assessment — AcadIn" },
      {
        property: "og:description",
        content: "Adaptive assessment engine powering your verified skill passport and career readiness score.",
      },
    ],
  }),
  component: () => <PortalPage role="student" section="assessment" />,
});
