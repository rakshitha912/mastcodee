export const SITE_URL = "https://id-preview--66d8816f-e3f9-4aa7-967e-d7d5f00477eb.lovable.app";

export const OG_IMAGE = `${SITE_URL}/og/mastcode-og.png`;

/** Standard social meta block for a page. */
export function socialMeta({
  title,
  description,
  url,
  type = "website",
}: {
  title: string;
  description: string;
  url: string;
  type?: string;
}) {
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:url", content: `${SITE_URL}${url}` },
    { property: "og:image", content: OG_IMAGE },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: OG_IMAGE },
  ];
}
