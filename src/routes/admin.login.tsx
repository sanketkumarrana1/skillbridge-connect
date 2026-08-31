import { createFileRoute } from "@tanstack/react-router";
import { AdminLoginView } from "@/components/skillbridge/admin/admin-login";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Portal Sign-In — AcadIn" },
      {
        name: "description",
        content: "Sign in to the AcadIn enterprise platform administration console.",
      },
    ],
  }),
  component: () => <AdminLoginView />,
});

