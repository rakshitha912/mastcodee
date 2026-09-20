import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/ServicePage";
import { servicePages } from "@/lib/service-pages";

export const Route = createFileRoute("/website-development")({
  head: () => ({ meta: [{ title: "Website Development & Enhancement - MastCode" }] }),
  component: () => <ServicePage page={servicePages.website_development} />,
});

