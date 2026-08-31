import { createFileRoute } from "@tanstack/react-router";
import { AdminAuditView } from "@/components/skillbridge/admin/admin-audit";

export const Route = createFileRoute("/admin/audit")({
  head: () => ({
    meta: [
      { title: "Admin Audit Trail — AcadIn Admin" },
      {
        name: "description",
        content: "Complete chronological trail of all security verifications, moderation decisions, and system alterations.",
      },
    ],
  }),
  component: () => <AdminAuditView />,
});

