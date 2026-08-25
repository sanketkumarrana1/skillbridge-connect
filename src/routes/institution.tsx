import { createFileRoute } from "@tanstack/react-router";
import { RoleLayout } from "@/components/skillbridge/portal";

export const Route = createFileRoute("/institution")({
  component: () => <RoleLayout role="institution" />,
});
