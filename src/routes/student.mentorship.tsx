import { createFileRoute } from "@tanstack/react-router";
import { PortalPage } from "@/components/skillbridge/portal";

export const Route = createFileRoute("/student/mentorship")({
  head: () => ({
    meta: [
      { title: "Mentor Scheduling — AcadIn" },
      {
        name: "description",
        content:
          "Connect with verified Industry Leaders and premier Faculty Scholars for 1-on-1 career navigation and portfolio reviews.",
      },
      { property: "og:title", content: "Mentor Scheduling — AcadIn" },
      {
        property: "og:description",
        content: "Discover mentors, check weekly slot availability, and book guidance sessions.",
      },
    ],
  }),
  component: () => <PortalPage role="student" section="mentorship" />,
});

