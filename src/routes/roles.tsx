import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/skillbridge/portal";

export const Route = createFileRoute("/roles")({
  component: () => <AuthPage mode="roles" />,
}); /* import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/roles')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/roles"!</div>
} */
