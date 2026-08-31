import { createFileRoute } from "@tanstack/react-router";
import { PortalPage } from "@/components/skillbridge/portal";

export const Route = createFileRoute("/student/analysis")({
  head: () => ({
    meta: [
      { title: "AI Skill Analysis — AcadIn" },
      {
        name: "description",
        content:
          "Career readiness score, strong skills, moderate skills, gaps and recommended skills to learn with reasoning.",
      },
      { property: "og:title", content: "AI Skill Analysis — AcadIn" },
      {
        property: "og:description",
        content: "Where you are strong, where you are short, and what to learn next.",
      },
    ],
  }),
  component: () => <PortalPage role="student" section="analysis" />,
});
