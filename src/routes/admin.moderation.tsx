import { createFileRoute } from "@tanstack/react-router";
import { AdminModerationView } from "@/components/skillbridge/admin/admin-moderation";

export const Route = createFileRoute("/admin/moderation")({
  head: () => ({
    meta: [
      { title: "Platform Moderation & Security — AcadIn Admin" },
      {
        name: "description",
        content: "Automated anomaly detection, trust & safety compliance flags, and integrity verification.",
      },
    ],
  }),
  component: () => <AdminModerationView />,
});

