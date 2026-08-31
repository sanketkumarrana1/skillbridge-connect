import { createFileRoute } from "@tanstack/react-router";
import { AdminReportsView } from "@/components/skillbridge/admin/admin-reports";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({
    meta: [
      { title: "Analytics & Accreditation Reporting — AcadIn Admin" },
      {
        name: "description",
        content: "Export institutional accreditation packets, compliance documentation, and national talent intelligence.",
      },
    ],
  }),
  component: () => <AdminReportsView />,
});

