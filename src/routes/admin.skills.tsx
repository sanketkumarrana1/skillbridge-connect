import { createFileRoute } from "@tanstack/react-router";
import { AdminSkillsView } from "@/components/skillbridge/admin/admin-skills";

export const Route = createFileRoute("/admin/skills")({
  head: () => ({
    meta: [
      { title: "Skill Taxonomy & Competency Engine — AcadIn Admin" },
      {
        name: "description",
        content: "Standardized skills taxonomy powering matching algorithms, assessments, and AI gap analyses.",
      },
    ],
  }),
  component: () => <AdminSkillsView />,
});

