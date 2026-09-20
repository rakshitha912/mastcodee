import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/ServicePage";
import { servicePages } from "@/lib/service-pages";

export const Route = createFileRoute("/placement-assistance")({
  head: () => ({ meta: [{ title: "Placement Assistance - MastCode" }] }),
  component: () => <ServicePage page={servicePages.placement_assistance} />,
});

