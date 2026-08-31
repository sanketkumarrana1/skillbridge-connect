import { createFileRoute } from "@tanstack/react-router";
import { AdminCompaniesView } from "@/components/skillbridge/admin/admin-companies";

export const Route = createFileRoute("/admin/companies")({
  head: () => ({
    meta: [
      { title: "Company Verifications — AcadIn Admin" },
      {
        name: "description",
        content: "Authenticate hiring organizations, inspect MCA registration numbers, and verify recruiter domains.",
      },
    ],
  }),
  component: () => <AdminCompaniesView />,
});

