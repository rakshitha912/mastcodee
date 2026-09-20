export async function submitJsonForm(payload: Record<string, unknown>) {
  const response = await fetch("/api/form-submissions", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      ...payload,
      source_page: typeof window !== "undefined" ? window.location.pathname : "",
    }),
  });

  const result = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
  if (!response.ok || !result?.ok) {
    throw new Error(result?.error || "Unable to submit the form. Please try again.");
  }

  return result;
}

export async function submitMultipartForm(formData: FormData) {
  if (typeof window !== "undefined") {
    formData.set("source_page", window.location.pathname);
  }

  const response = await fetch("/api/form-submissions", {
    method: "POST",
    body: formData,
  });

  const result = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
  if (!response.ok || !result?.ok) {
    throw new Error(result?.error || "Unable to submit the form. Please try again.");
  }

  return result;
}

