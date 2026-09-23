import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/ServicePage";

export const Route = createFileRoute("/digital-marketing")({
  head: () => ({ meta: [{ title: "Digital Marketing - MastCode" }] }),
  component: () => <ServicePage type="digital_marketing" />,
});

