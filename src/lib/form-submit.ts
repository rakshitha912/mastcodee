const WHATSAPP_NUMBER = "917019161991";

function createWhatsAppUrl(fields: Record<string, unknown>) {
  const lines = ["New website form submission", ""];
  for (const [key, value] of Object.entries(fields)) {
    if (key === "source_page" || value === undefined || value === null || value === "") continue;

    const label = key.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
    const displayValue = value instanceof File ? value.name : String(value);
    lines.push(`${label}: ${displayValue}`);
  }

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}

async function submitForm(body: BodyInit, fields: Record<string, unknown>, headers: HeadersInit = {}) {
  const whatsappUrl = createWhatsAppUrl(fields);
  const whatsappWindow = typeof window !== "undefined" ? window.open(whatsappUrl, "_blank") : null;
  if (whatsappWindow) whatsappWindow.opener = null;

  try {
    const requestOptions: RequestInit = { method: "POST", body };
    if (headers) requestOptions.headers = headers;
    const response = await fetch("/api/form-submissions", requestOptions);

    const result = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (!response.ok || !result?.ok) {
      throw new Error(result?.error || "Unable to submit the form. Please try again.");
    }

    if (!whatsappWindow && typeof window !== "undefined") {
      window.location.assign(whatsappUrl);
    }

    return { ...result, whatsappFallback: false };
  } catch (error) {
    if (typeof window !== "undefined") {
      if (!whatsappWindow) {
        window.location.assign(whatsappUrl);
      }
      return {
        ok: true,
        whatsappFallback: true,
        whatsappUrl,
        message: "We couldn't save your form, but your WhatsApp message is ready. Tap Send in WhatsApp to submit it.",
      };
    }

    whatsappWindow?.close();
    throw error;
  }
}

export async function submitJsonForm(payload: Record<string, unknown>) {
  const fields = {
    ...payload,
    source_page: typeof window !== "undefined" ? window.location.pathname : "",
  };

  return submitForm(
    JSON.stringify(fields),
    fields,
    { "content-type": "application/json" },
  );
}

export async function submitMultipartForm(formData: FormData) {
  if (typeof window !== "undefined") {
    formData.set("source_page", window.location.pathname);
  }

  const fields: Record<string, unknown> = {};
  formData.forEach((value, key) => {
    fields[key] = value;
  });

  return submitForm(formData, fields);
}

