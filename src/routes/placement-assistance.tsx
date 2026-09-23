import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/ServicePage";

export const Route = createFileRoute("/placement-assistance")({
  head: () => ({ meta: [{ title: "Placement Assistance - MastCode" }] }),
  component: () => <ServicePage type="placement_assistance" />,
});

