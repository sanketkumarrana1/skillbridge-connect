import { createFileRoute } from "@tanstack/react-router";
import { PortalPage } from "@/components/skillbridge/portal";

export const Route = createFileRoute("/student/settings")({
  component: () => <PortalPage role="student" section="settings" />,
}); /* import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/student/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/student/settings"!</div>
} */
