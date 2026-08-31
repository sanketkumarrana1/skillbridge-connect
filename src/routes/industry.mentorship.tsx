import { createFileRoute } from "@tanstack/react-router";
import { PortalPage } from "@/components/skillbridge/portal";

export const Route = createFileRoute("/industry/mentorship")({
  head: () => ({
    meta: [
      { title: "Industry Mentorship Hub — AcadIn" },
      {
        name: "description",
        content:
          "Host 1-on-1 student mentorship sessions, review candidate inquiries, and log structured session outcomes.",
      },
    ],
  }),
  component: () => <PortalPage role="industry" section="mentorship" />,
});
