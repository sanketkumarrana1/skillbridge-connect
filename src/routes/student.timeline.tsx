import { createFileRoute } from "@tanstack/react-router";
import { PortalPage } from "@/components/skillbridge/portal";

export const Route = createFileRoute("/student/timeline")({
  head: () => ({
    meta: [
      { title: "Placement Timeline & Recruitment Journey — AcadIn" },
      {
        name: "description",
        content:
          "Track your synchronous recruitment progress across applications, scheduled interviews, and corporate offer letters.",
      },
      { property: "og:title", content: "Placement Timeline — AcadIn" },
      {
        property: "og:description",
        content: "Interactive lifecycle timeline synchronized directly with recruiter ATS systems.",
      },
    ],
  }),
  component: () => <PortalPage role="student" section="timeline" />,
});

