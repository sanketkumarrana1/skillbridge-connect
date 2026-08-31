import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/skillbridge/portal";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — AcadIn" },
      {
        name: "description",
        content:
          "Log in to AcadIn as a student, industry recruiter, academician, or institutional leader.",
      },
      { property: "og:title", content: "Log in — AcadIn" },
      {
        property: "og:description",
        content: "AcadIn Academia–Industry Collaboration Portal access.",
      },
    ],
  }),
  component: () => <AuthPage mode="login" />,
});
