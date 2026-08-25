import { createFileRoute } from "@tanstack/react-router";
import { RoleLayout } from "@/components/skillbridge/portal";

export const Route = createFileRoute("/student")({
  component: () => <RoleLayout role="student" />,
});
