import { createFileRoute } from "@tanstack/react-router";
import { PortalPage } from "@/components/skillbridge/portal";

export const Route = createFileRoute("/student/certificates")({
  component: () => <PortalPage role="student" section="certificates" />,
}); /* import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/student/certificates')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/student/certificates"!</div>
} */
