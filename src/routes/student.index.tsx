import { createFileRoute } from "@tanstack/react-router";
import { PortalPage } from "@/components/skillbridge/portal";

export const Route = createFileRoute("/student/")({
  head: () => ({
    meta: [
      { title: "Student Dashboard — AcadIn" },
      {
        name: "description",
        content:
          "Track profile completion, overall skill score, recommended internships and recent applications in one student workspace.",
      },
      { property: "og:title", content: "Student Dashboard — AcadIn" },
      {
        property: "og:description",
        content: "Your verified skill passport, career readiness and opportunities at a glance.",
      },
    ],
  }),
  component: () => <PortalPage role="student" />,
});
