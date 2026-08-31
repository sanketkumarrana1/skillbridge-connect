import { createFileRoute } from "@tanstack/react-router";
import { AdminUsersView } from "@/components/skillbridge/admin/admin-users";

export const Route = createFileRoute("/admin/users")({
  head: () => ({
    meta: [
      { title: "User Directory & Access Control — AcadIn Admin" },
      {
        name: "description",
        content: "Manage registered student, faculty, recruiter, and institution accounts.",
      },
    ],
  }),
  component: () => <AdminUsersView />,
});

