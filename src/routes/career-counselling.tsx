import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/ServicePage";
import { servicePages } from "@/lib/service-pages";

export const Route = createFileRoute("/career-counselling")({
  head: () => ({ meta: [{ title: "Career Counselling & Guidance - MastCode" }] }),
  component: () => <ServicePage page={servicePages.career_counselling} />,
});

