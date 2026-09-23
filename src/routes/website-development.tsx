import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/ServicePage";

export const Route = createFileRoute("/website-development")({
  head: () => ({ meta: [{ title: "Website Development & Enhancement - MastCode" }] }),
  component: () => <ServicePage type="website_development" />,
});

