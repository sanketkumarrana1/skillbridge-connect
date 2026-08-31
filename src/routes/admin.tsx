import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminShell } from "@/components/skillbridge/admin/admin-shell";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Enterprise Administration Console — AcadIn" },
      {
        name: "description",
        content: "Platform governance, trust & safety moderation, company verification, and institutional analytics.",
      },
    ],
  }),
  component: () => (
    <AdminShell>
      <Outlet />
    </AdminShell>
  ),
});

