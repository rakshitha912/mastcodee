import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { DEFAULT_SERVICE_PAGES, type ServicePage, type ServiceType } from "@/lib/service-pages";

const tableName = "service_page_content";
const supportedPageTypes = new Set<ServiceType>(Object.keys(DEFAULT_SERVICE_PAGES) as ServiceType[]);

function normalizePayload(raw: Partial<ServicePage>): ServicePage {
  const requestedType = raw.type ?? "career_counselling";
  const type = supportedPageTypes.has(requestedType as ServiceType) ? requestedType : "career_counselling";
  const fallback = DEFAULT_SERVICE_PAGES[type as ServiceType] ?? DEFAULT_SERVICE_PAGES.career_counselling;

  return {
    ...fallback,
    ...raw,
    type,
    paragraphs: Array.isArray(raw.paragraphs) && raw.paragraphs.length > 0 ? raw.paragraphs : fallback.paragraphs,
    fields: Array.isArray(raw.fields) && raw.fields.length > 0 ? raw.fields : fallback.fields,
    submitLabel: raw.submitLabel || fallback.submitLabel,
    successMessage: raw.successMessage || fallback.successMessage,
  };
}

function toRecord(page: ServicePage) {
  return {
    page_type: page.type,
    eyebrow: page.eyebrow,
    title: page.title,
    price: page.price ?? null,
    paragraphs: page.paragraphs,
    fields: page.fields,
    submit_label: page.submitLabel,
    success_message: page.successMessage,
    updated_at: new Date().toISOString(),
  };
}

function fromRecord(row: any): ServicePage {
  const type = String(row.page_type || "career_counselling") as ServiceType;
  const fallback = DEFAULT_SERVICE_PAGES[type] ?? DEFAULT_SERVICE_PAGES.career_counselling;

  return {
    ...fallback,
    ...row,
    type,
    eyebrow: row.eyebrow || fallback.eyebrow,
    title: row.title || fallback.title,
    price: row.price ?? fallback.price,
    paragraphs: Array.isArray(row.paragraphs) ? row.paragraphs : fallback.paragraphs,
    fields: Array.isArray(row.fields) ? row.fields : fallback.fields,
    submitLabel: row.submit_label || fallback.submitLabel,
    successMessage: row.success_message || fallback.successMessage,
  };
}

export async function getServicePageConfig(type: ServiceType): Promise<ServicePage> {
  const pageType = type || "career_counselling";

  try {
    const { data, error } = await (supabaseAdmin as any)
      .from(tableName)
      .select("*")
      .eq("page_type", pageType)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    if (data) {
      return fromRecord(data);
    }

    const fallback = DEFAULT_SERVICE_PAGES[pageType];
    if (fallback) {
      return fallback;
    }
  } catch (error) {
    console.warn("Falling back to default service page config:", error);
  }

  return DEFAULT_SERVICE_PAGES[pageType] ?? DEFAULT_SERVICE_PAGES.career_counselling;
}

export async function listServicePageConfigs(): Promise<Record<ServiceType, ServicePage>> {
  const result: Record<string, ServicePage> = {};

  for (const key of Object.keys(DEFAULT_SERVICE_PAGES) as ServiceType[]) {
    result[key] = await getServicePageConfig(key);
  }

  return result as Record<ServiceType, ServicePage>;
}

export async function upsertServicePageConfig(page: Partial<ServicePage>): Promise<ServicePage> {
  const normalized = normalizePayload(page);

  try {
    const { data, error } = await (supabaseAdmin as any)
      .from(tableName)
      .upsert(toRecord(normalized), { onConflict: "page_type" })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return fromRecord(data ?? normalized);
  } catch (error) {
    console.warn("Unable to persist service page content to Supabase; using in-memory fallback:", error);
    return normalized;
  }
}

export async function handleServicePagesRequest(request: Request) {
  const url = new URL(request.url);
  const typeParam = url.searchParams.get("type") as ServiceType | null;

  if (request.method === "GET") {
    if (typeParam) {
      const page = await getServicePageConfig(typeParam);
      return Response.json(
        { ok: true, data: page },
        { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" } },
      );
    }

    const pages = await listServicePageConfigs();
    return Response.json(
      { ok: true, data: pages },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" } },
    );
  }

  if (request.method === "PUT" || request.method === "POST") {
    const payload = (await request.json().catch(() => null)) as Partial<ServicePage> | null;
    if (!payload || !payload.type) {
      return Response.json({ ok: false, error: "A page type is required." }, { status: 400 });
    }

    const saved = await upsertServicePageConfig(payload);
    return Response.json(
      { ok: true, data: saved },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" } },
    );
  }

  return Response.json({ ok: false, error: "Method not allowed." }, { status: 405 });
}
