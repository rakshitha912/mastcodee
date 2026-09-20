import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/ServicePage";
import { servicePages } from "@/lib/service-pages";

export const Route = createFileRoute("/institution-partnerships")({
  head: () => ({ meta: [{ title: "Institution Partnerships - MastCode" }] }),
  component: () => <ServicePage page={servicePages.institution_partnership} />,
});

