import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/skillbridge/portal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AcadIn — Bridge Campus Skills to Industry Roles" },
      {
        name: "description",
        content:
          "AcadIn maps verified student skills to live internship requirements, so colleges and companies hire on evidence instead of resumes.",
      },
      { property: "og:title", content: "AcadIn — Bridge Campus Skills to Industry Roles" },
      {
        property: "og:description",
        content:
          "Skill mapping, AI recommendations and internship matching for students and industry teams.",
      },
    ],
  }),
  component: LandingPage,
});
