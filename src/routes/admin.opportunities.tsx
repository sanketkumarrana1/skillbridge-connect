import { createFileRoute } from "@tanstack/react-router";
import { AdminOpportunitiesView } from "@/components/skillbridge/admin/admin-opportunities";

export const Route = createFileRoute("/admin/opportunities")({
  head: () => ({
    meta: [
      { title: "Opportunity Moderation & Compliance — AcadIn Admin" },
      {
        name: "description",
        content: "Review recruiter postings, enforce fair campus stipends, and prevent predatory contracts.",
      },
    ],
  }),
  component: () => <AdminOpportunitiesView />,
});

