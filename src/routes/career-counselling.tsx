import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/ServicePage";

export const Route = createFileRoute("/career-counselling")({
  head: () => ({ meta: [{ title: "Career Counselling & Guidance - MastCode" }] }),
  component: () => <ServicePage type="career_counselling" />,
});

