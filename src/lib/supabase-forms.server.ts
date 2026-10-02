import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

type FormFields = Record<string, Json>;
type RuntimeEnv = { RESEND_API_KEY?: string };
type FormAttachment = { filename: string; content_type: string; content: string };
type ParsedSubmission = { fields: FormFields; attachments: FormAttachment[] };

function addField(fields: FormFields, name: string, value: Json) {
  const existing = fields[name];
  if (existing === undefined) {
    fields[name] = value;
  } else if (Array.isArray(existing)) {
    existing.push(value);
  } else {
    fields[name] = [existing, value];
  }
}

function jsonValue(value: unknown): Json {
  if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  if (Array.isArray(value)) return value.map(jsonValue);
  if (typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, jsonValue(item)]));
  }
  return String(value);
}

async function parseSubmission(request: Request): Promise<ParsedSubmission | null> {
  const contentType = request.headers.get("content-type") || "";
  const fields: FormFields = {};
  const attachments: FormAttachment[] = [];

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    for (const [name, value] of formData.entries()) {
      if (value instanceof File) {
        if (value.size > 0) {
          if (value.size > 5 * 1024 * 1024) throw new Error("Uploaded files must be 5MB or smaller.");
          const bytes = new Uint8Array(await value.arrayBuffer());
          let binary = "";
          for (let offset = 0; offset < bytes.length; offset += 0x8000) {
            binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
          }
          attachments.push({
            filename: value.name,
            content_type: value.type || "application/octet-stream",
            content: btoa(binary),
          });
          addField(fields, name, {
            filename: value.name,
            content_type: value.type,
            size: value.size,
          });
        }
      } else {
        addField(fields, name, value);
      }
    }
    return { fields, attachments };
  }

  const body: unknown = await request.json();
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  for (const [name, value] of Object.entries(body)) fields[name] = jsonValue(value);
  return { fields, attachments };
}

function formatValue(value: Json): string {
  return typeof value === "string" ? value : JSON.stringify(value);
}

function getResendApiKey(env: unknown): string | undefined {
  if (env && typeof env === "object" && "RESEND_API_KEY" in env) {
    const key = (env as RuntimeEnv).RESEND_API_KEY;
    if (key) return key;
  }
  return typeof process !== "undefined" ? process.env["RESEND_API_KEY"] : undefined;
}

export async function handleSupabaseFormSubmission(request: Request, env?: unknown) {
  if (request.method !== "POST") {
    return Response.json({ ok: false, error: "Method not allowed." }, { status: 405 });
  }

  let submission: ParsedSubmission | null;
  try {
    submission = await parseSubmission(request);
  } catch {
    return Response.json({ ok: false, error: "Invalid submission data." }, { status: 400 });
  }

  const fields = submission?.fields;
  if (!submission || !fields || Object.keys(fields).length === 0) {
    return Response.json({ ok: false, error: "Submission fields are required." }, { status: 400 });
  }

  const resendApiKey = getResendApiKey(env);

  try {
    const fieldText = (name: string, fallback: string) => {
      const value = fields[name];
      return typeof value === "string" && value.trim() ? value : fallback;
    };
    const { error } = await supabase.from("messages").insert({
      name: fieldText("full_name", fieldText("name", fieldText("contact_person", "Website visitor"))),
      email: fieldText("email", "not-provided@mastcode.local"),
      subject: fieldText("subject", fieldText("service_type", fieldText("form_type", "Website form submission"))),
      message: JSON.stringify(fields),
    });
    if (error) throw error;

    const emailBody = Object.entries(fields)
      .map(([name, value]) => `${name}: ${formatValue(value)}`)
      .join("\n");

    if (resendApiKey) {
      try {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "MastCode Website <onboarding@resend.dev>",
            to: ["contact@mastcode.in"],
            subject: "New website inquiry",
            text: `A new form submission was received.\n\n${emailBody}`,
            attachments: submission.attachments.map(({ filename, content_type, content }) => ({
              filename,
              content_type,
              content,
            })),
          }),
        });

        if (!emailResponse.ok) {
          console.error("[Form submission] Resend rejected the email:", emailResponse.status, await emailResponse.text());
        }
      } catch (emailError) {
        console.error("[Form submission] Email notification failed:", emailError);
      }
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("[Form submission] Unable to save or send inquiry:", error);
    return Response.json(
      { ok: false, error: "We could not process your submission. Please try again later." },
      { status: 500 },
    );
  }
}
