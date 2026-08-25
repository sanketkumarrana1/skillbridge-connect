import { createFileRoute } from "@tanstack/react-router";
import { MarketplacePage } from "@/components/skillbridge/portal";

export const Route = createFileRoute("/jobs")({ component: () => <MarketplacePage job /> });
