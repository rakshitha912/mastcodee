import { supabase } from "@/integrations/supabase/client";

type FormPayload = Record<string, unknown>;

const applicationTypes = new Set(["job_application", "internship_application"]);
const serviceTypes = new Set([
  "career_counselling",
  "placement_assistance",
  "institution_partnership",
  "website_development",
  "digital_marketing",
  "contact_enquiry",
  "course_registration",
  "chatbot_lead",
]);

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function nullableText(value: unknown) {
  return text(value) || null;
}

function basePayload(payload: FormPayload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([key]) => !["form_type", "service_type", "source_page"].includes(key)),
  );
}

async function uploadResume(file: File, formType: string) {
  if (!file || file.size === 0) return null;
  const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
  if (!["pdf", "doc", "docx"].includes(extension)) {
    throw new Error("Only PDF, DOC, and DOCX files are allowed.");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Resume file must be 5MB or smaller.");
  }

  const path = `${formType}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("resumes").upload(path, file, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (error) throw error;
  return path;
}

async function insertApplication(payload: FormPayload, resumePath: string | null) {
  const positionType = text(payload.form_type) === "internship_application" ? "internship" : "job";
  const { data, error } = await (supabase.from("applications") as any)
    .insert({
      position_type: positionType,
      position_id: nullableText(payload.position_id),
      position_title: text(payload.position_title),
      full_name: text(payload.full_name) || text(payload.name),
      email: text(payload.email),
      phone: text(payload.phone),
      location: nullableText(payload.location),
      qualification: nullableText(payload.qualification),
      skills: nullableText(payload.skills),
      experience: nullableText(payload.experience),
      linkedin: nullableText(payload.linkedin),
      github: nullableText(payload.github),
      portfolio: nullableText(payload.portfolio),
      resume_path: resumePath,
      cover_letter: nullableText(payload.cover_letter),
    })
    .select("id")
    .single();
  if (error) throw error;
  return data?.id;
}

async function insertServiceSubmission(payload: FormPayload, formType: string, resumePath: string | null) {
  const { data, error } = await (supabase.from("service_submissions") as any)
    .insert({
      service_type: formType,
      full_name:
        text(payload.full_name) ||
        text(payload.name) ||
        text(payload.contact_person) ||
        text(payload.institution) ||
        text(payload.company),
      email: text(payload.email),
      phone: text(payload.phone),
      payload: basePayload(payload),
      resume_path: resumePath,
    })
    .select("id")
    .single();
  if (error) throw error;
  return data?.id;
}

export async function handleSupabaseFormSubmission(request: Request) {
  if (request.method !== "POST") {
    return Response.json({ ok: false, error: "Method not allowed" }, { status: 405 });
  }

  const contentType = request.headers.get("content-type") || "";
  const payload: FormPayload = {};
  let resume: File | null = null;

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        if (value.size > 0) resume = value;
      } else {
        payload[key] = value;
      }
    }
  } else {
    Object.assign(payload, (await request.json()) as FormPayload);
  }

  const formType = text(payload.form_type) || text(payload.service_type);
  if (!applicationTypes.has(formType) && !serviceTypes.has(formType)) {
    return Response.json({ ok: false, error: "Form type is required or unsupported." }, { status: 400 });
  }

  try {
    const resumePath = resume ? await uploadResume(resume, formType) : null;
    const submissionId = applicationTypes.has(formType)
      ? await insertApplication(payload, resumePath)
      : await insertServiceSubmission(payload, formType, resumePath);
    return Response.json({ ok: true, submission_id: submissionId });
  } catch (error) {
    console.error("[Supabase form submission]", error);
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to submit the form." },
      { status: 400 },
    );
  }
}
