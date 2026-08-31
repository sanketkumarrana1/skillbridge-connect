import { createFileRoute } from "@tanstack/react-router";
import { StudentOnboarding } from "@/components/skillbridge/student-onboarding";

export const Route = createFileRoute("/student/onboarding")({
  component: () => <StudentOnboarding />,
});
