import { createFileRoute } from "@tanstack/react-router";
import { AdminInstitutionsView } from "@/components/skillbridge/admin/admin-institutions";

export const Route = createFileRoute("/admin/institutions")({
  head: () => ({
    meta: [
      { title: "Universities & Colleges — AcadIn Admin" },
      {
        name: "description",
        content: "Institutional governance, department health, and accreditation readiness tracking.",
      },
    ],
  }),
  component: () => <AdminInstitutionsView />,
});

