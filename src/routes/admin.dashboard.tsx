import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboardView } from "@/components/skillbridge/admin/admin-dashboard";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Platform Dashboard — AcadIn Admin" },
      {
        name: "description",
        content: "Platform KPI metrics, user growth, recruitment conversion, and system health.",
      },
    ],
  }),
  component: () => <AdminDashboardView />,
});

