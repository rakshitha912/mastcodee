import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/ServicePage";

export const Route = createFileRoute("/institution-partnerships")({
  head: () => ({ meta: [{ title: "Institution Partnerships - MastCode" }] }),
  component: () => <ServicePage type="institution_partnership" />,
});

