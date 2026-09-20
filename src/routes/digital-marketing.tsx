import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/ServicePage";
import { servicePages } from "@/lib/service-pages";

export const Route = createFileRoute("/digital-marketing")({
  head: () => ({ meta: [{ title: "Digital Marketing - MastCode" }] }),
  component: () => <ServicePage page={servicePages.digital_marketing} />,
});

