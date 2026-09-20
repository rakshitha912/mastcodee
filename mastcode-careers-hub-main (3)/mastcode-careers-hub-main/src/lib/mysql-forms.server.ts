import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import mysql from "mysql2/promise";

type FormPayload = Record<string, unknown>;
type MysqlSubmissionRow = mysql.RowDataPacket & {
  id: number;
  form_type: string;
  status: string;
  full_name: string;
  email: string;
  phone: string | null;
  created_at: string;
  resume_path: string | null;
  position_type: string | null;
  position_title: string | null;
  current_location: string | null;
  highest_qualification: string | null;
  skills: string | null;
  experience: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  cover_letter: string | null;
};

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "127.0.0.1",
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "mastcode_careers_hub",
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
});

const serviceTypeToFormType: Record<string, string> = {
  career_counselling: "career_counselling",
  placement_assistance: "placement_assistance",
  institution_partnership: "institution_partnership",
  website_development: "website_development",
  digital_marketing: "digital_marketing",
  contact_enquiry: "contact_enquiry",
  course_registration: "course_registration",
  chatbot_lead: "chatbot_lead",
};

const statusLabelToCode: Record<string, string> = {
  New: "new",
  Contacted: "contacted",
  "In Progress": "in_progress",
  Completed: "completed",
  Applied: "new",
  "Under Review": "under_review",
  Shortlisted: "shortlisted",
  "Interview Scheduled": "interview_scheduled",
  Selected: "selected",
  Rejected: "rejected",
  Withdrawn: "withdrawn",
};

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function optionalText(value: unknown) {
  const text = cleanText(value);
  return text || null;
}

async function saveUploadedFile(file: File, formType: string) {
  if (!file || file.size === 0) return null;

  const allowedTypes = new Set([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]);
  const safeOriginalName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const extension = path.extname(safeOriginalName).toLowerCase();

  if (![".pdf", ".doc", ".docx"].includes(extension) || !allowedTypes.has(file.type || "application/octet-stream")) {
    throw new Error("Only PDF, DOC, and DOCX files are allowed.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Resume file must be 5MB or smaller.");
  }

  const relativeDir = path.join("uploads", "form-files", formType);
  const absoluteDir = path.resolve(process.cwd(), relativeDir);
  await mkdir(absoluteDir, { recursive: true });

  const storedName = `${randomUUID()}-${safeOriginalName}`;
  const relativePath = path.join(relativeDir, storedName).replace(/\\/g, "/");
  await writeFile(path.join(absoluteDir, storedName), Buffer.from(await file.arrayBuffer()));

  return {
    originalName: file.name,
    storedPath: relativePath,
    mimeType: file.type || "application/octet-stream",
    sizeBytes: file.size,
  };
}

async function createBaseSubmission(
  connection: mysql.PoolConnection,
  formTypeCode: string,
  payload: FormPayload,
  request: Request,
) {
  const fullName =
    cleanText(payload.full_name) ||
    cleanText(payload.name) ||
    cleanText(payload.contact_person) ||
    cleanText(payload.institution) ||
    cleanText(payload.company);
  const email = cleanText(payload.email);

  if (!fullName) throw new Error("Full name is required.");
  if (!email) throw new Error("Email address is required.");

  const [result] = await connection.execute<mysql.ResultSetHeader>(
    `
      INSERT INTO form_submissions (
        form_type_id,
        status_id,
        public_reference,
        full_name,
        email,
        phone,
        source_page,
        user_agent
      )
      SELECT
        ft.id,
        fs.id,
        :publicReference,
        :fullName,
        :email,
        :phone,
        :sourcePage,
        :userAgent
      FROM form_types ft
      JOIN form_submission_statuses fs ON fs.code = 'new'
      WHERE ft.code = :formTypeCode
      LIMIT 1
    `,
    {
      publicReference: randomUUID(),
      fullName,
      email,
      phone: optionalText(payload.phone),
      sourcePage: optionalText(payload.source_page),
      userAgent: request.headers.get("user-agent") || null,
      formTypeCode,
    },
  );

  if (!result.insertId) {
    throw new Error(`Unknown or inactive form type: ${formTypeCode}`);
  }

  return result.insertId;
}

async function insertSpecificForm(
  connection: mysql.PoolConnection,
  submissionId: number,
  formTypeCode: string,
  payload: FormPayload,
) {
  if (formTypeCode === "job_application" || formTypeCode === "internship_application") {
    await connection.execute(
      `
        INSERT INTO job_application_forms (
          form_submission_id, position_type, position_id, position_slug, position_title,
          current_location, highest_qualification, skills, experience, linkedin_url,
          github_url, portfolio_url, cover_letter
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        submissionId,
        formTypeCode === "internship_application" ? "internship" : "job",
        optionalText(payload.position_id),
        optionalText(payload.position_slug),
        cleanText(payload.position_title),
        optionalText(payload.location),
        optionalText(payload.qualification),
        optionalText(payload.skills),
        optionalText(payload.experience),
        optionalText(payload.linkedin),
        optionalText(payload.github),
        optionalText(payload.portfolio),
        optionalText(payload.cover_letter),
      ],
    );
    return;
  }

  if (formTypeCode === "career_counselling") {
    await connection.execute(
      `
        INSERT INTO career_counselling_forms (
          form_submission_id, qualification, institution, career_stage, area_of_interest,
          confusion, goals, preferred_mode, preferred_date, additional_message
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        submissionId,
        cleanText(payload.qualification),
        optionalText(payload.institution),
        optionalText(payload.career_stage),
        optionalText(payload.interest),
        optionalText(payload.confusion),
        optionalText(payload.goals),
        optionalText(payload.mode),
        optionalText(payload.preferred_time),
        optionalText(payload.message),
      ],
    );
    return;
  }

  if (formTypeCode === "placement_assistance") {
    await connection.execute(
      `
        INSERT INTO placement_assistance_forms (
          form_submission_id, current_location, highest_qualification, institution,
          graduation_year, skills, experience, preferred_job_role, preferred_work_location,
          linkedin_url, portfolio_url, additional_information
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        submissionId,
        cleanText(payload.location),
        cleanText(payload.qualification),
        optionalText(payload.institution),
        cleanText(payload.graduation_year),
        cleanText(payload.skills),
        optionalText(payload.experience),
        cleanText(payload.job_role),
        optionalText(payload.work_location),
        optionalText(payload.linkedin),
        optionalText(payload.portfolio),
        optionalText(payload.message),
      ],
    );
    return;
  }

  if (formTypeCode === "institution_partnership") {
    await connection.execute(
      `
        INSERT INTO institution_partnership_forms (
          form_submission_id, institution_name, contact_person, designation,
          institution_location, institution_type, number_of_students, areas_of_interest,
          preferred_collaboration, requirements_message
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        submissionId,
        cleanText(payload.institution),
        cleanText(payload.contact_person),
        cleanText(payload.designation),
        cleanText(payload.location),
        optionalText(payload.institution_type),
        optionalText(payload.students),
        optionalText(payload.interest),
        optionalText(payload.collaboration),
        optionalText(payload.message),
      ],
    );
    return;
  }

  if (formTypeCode === "website_development") {
    await connection.execute(
      `
        INSERT INTO website_development_forms (
          form_submission_id, company_name, existing_website_url, website_type,
          project_type, required_features, estimated_budget, project_description
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        submissionId,
        cleanText(payload.company),
        optionalText(payload.website),
        optionalText(payload.website_type),
        optionalText(payload.project_type),
        optionalText(payload.features),
        optionalText(payload.budget),
        cleanText(payload.message),
      ],
    );
    return;
  }

  if (formTypeCode === "digital_marketing") {
    await connection.execute(
      `
        INSERT INTO digital_marketing_forms (
          form_submission_id, company_name, industry, website_url, social_links,
          services_required, business_goals, target_audience, estimated_monthly_budget,
          additional_requirements
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        submissionId,
        cleanText(payload.company),
        cleanText(payload.industry),
        optionalText(payload.website),
        optionalText(payload.social_links),
        optionalText(payload.services),
        optionalText(payload.goals),
        optionalText(payload.audience),
        optionalText(payload.budget),
        optionalText(payload.message),
      ],
    );
    return;
  }

  if (formTypeCode === "contact_enquiry") {
    await connection.execute(
      "INSERT INTO contact_enquiry_forms (form_submission_id, subject, message) VALUES (?, ?, ?)",
      [submissionId, cleanText(payload.subject) || "General enquiry", cleanText(payload.message)],
    );
    return;
  }

  if (formTypeCode === "course_registration") {
    await connection.execute(
      `
        INSERT INTO course_registration_forms (
          form_submission_id, course_id, course_slug, course_title, qualification,
          experience_level, learning_goal, preferred_batch
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        submissionId,
        optionalText(payload.course_id),
        optionalText(payload.course_slug),
        cleanText(payload.course_title),
        optionalText(payload.qualification),
        optionalText(payload.experience_level),
        optionalText(payload.learning_goal) || optionalText(payload.message),
        optionalText(payload.preferred_batch),
      ],
    );
    return;
  }

  if (formTypeCode === "chatbot_lead") {
    await connection.execute(
      "INSERT INTO chatbot_lead_forms (form_submission_id, interested_service, conversation_topic, message) VALUES (?, ?, ?, ?)",
      [
        submissionId,
        cleanText(payload.interestedService) || cleanText(payload.interested_service) || "General Enquiry",
        optionalText(payload.conversation_topic),
        optionalText(payload.message),
      ],
    );
  }
}

function payloadFromRow(row: MysqlSubmissionRow) {
  const payload: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    if (
      [
        "id",
        "form_type",
        "status",
        "full_name",
        "email",
        "phone",
        "created_at",
        "resume_path",
      ].includes(key)
    ) {
      continue;
    }
    if (value !== null && value !== undefined && value !== "") {
      payload[key] = value;
    }
  }
  return payload;
}

async function listMysqlFormSubmissions(request: Request) {
  const url = new URL(request.url);
  const kind = url.searchParams.get("kind") || "all";
  const [rows] = await pool.query<MysqlSubmissionRow[]>(`
    SELECT
      fs.id,
      ft.code AS form_type,
      fss.label AS status,
      fs.full_name,
      fs.email,
      fs.phone,
      fs.submitted_at AS created_at,
      uf.stored_path AS resume_path,
      jaf.position_type,
      jaf.position_id,
      jaf.position_slug,
      jaf.position_title,
      jaf.current_location,
      jaf.highest_qualification,
      jaf.skills,
      jaf.experience,
      jaf.linkedin_url,
      jaf.github_url,
      jaf.portfolio_url,
      jaf.cover_letter,
      ccf.qualification AS counselling_qualification,
      ccf.institution AS counselling_institution,
      ccf.career_stage,
      ccf.area_of_interest,
      ccf.confusion,
      ccf.goals,
      ccf.preferred_mode,
      ccf.preferred_date,
      ccf.additional_message AS counselling_message,
      paf.current_location AS placement_location,
      paf.highest_qualification AS placement_qualification,
      paf.institution AS placement_institution,
      paf.graduation_year,
      paf.preferred_job_role,
      paf.preferred_work_location,
      paf.additional_information,
      ipf.institution_name,
      ipf.contact_person,
      ipf.designation,
      ipf.institution_location,
      ipf.institution_type,
      ipf.number_of_students,
      ipf.areas_of_interest,
      ipf.preferred_collaboration,
      ipf.requirements_message,
      wdf.company_name AS website_company,
      wdf.existing_website_url,
      wdf.website_type,
      wdf.project_type,
      wdf.required_features,
      wdf.estimated_budget,
      wdf.project_description,
      dmf.company_name AS marketing_company,
      dmf.industry,
      dmf.website_url,
      dmf.social_links,
      dmf.services_required,
      dmf.business_goals,
      dmf.target_audience,
      dmf.estimated_monthly_budget,
      dmf.additional_requirements,
      cef.subject,
      cef.message,
      crf.course_id,
      crf.course_slug,
      crf.course_title,
      crf.qualification AS course_qualification,
      crf.experience_level,
      crf.learning_goal,
      crf.preferred_batch,
      clf.interested_service,
      clf.conversation_topic,
      clf.message AS chatbot_message
    FROM form_submissions fs
    JOIN form_types ft ON ft.id = fs.form_type_id
    JOIN form_submission_statuses fss ON fss.id = fs.status_id
    LEFT JOIN uploaded_files uf ON uf.form_submission_id = fs.id AND uf.file_role = 'resume'
    LEFT JOIN job_application_forms jaf ON jaf.form_submission_id = fs.id
    LEFT JOIN career_counselling_forms ccf ON ccf.form_submission_id = fs.id
    LEFT JOIN placement_assistance_forms paf ON paf.form_submission_id = fs.id
    LEFT JOIN institution_partnership_forms ipf ON ipf.form_submission_id = fs.id
    LEFT JOIN website_development_forms wdf ON wdf.form_submission_id = fs.id
    LEFT JOIN digital_marketing_forms dmf ON dmf.form_submission_id = fs.id
    LEFT JOIN contact_enquiry_forms cef ON cef.form_submission_id = fs.id
    LEFT JOIN course_registration_forms crf ON crf.form_submission_id = fs.id
    LEFT JOIN chatbot_lead_forms clf ON clf.form_submission_id = fs.id
    ORDER BY fs.submitted_at DESC
  `);

  const records = rows.map((row) => {
    const isApplication = row.form_type === "job_application" || row.form_type === "internship_application";
    return {
    id: String(row.id),
    service_type: row.form_type,
    form_type: row.form_type,
    full_name: row.full_name,
    email: row.email,
    phone: row.phone || "",
    status: isApplication && row.status === "New" ? "Applied" : row.status,
    resume_path: row.resume_path,
    created_at: row.created_at,
    position_title: row.position_title || "",
    location: row.current_location,
    qualification: row.highest_qualification,
    skills: row.skills,
    experience: row.experience,
    linkedin: row.linkedin_url,
    github: row.github_url,
    portfolio: row.portfolio_url,
    cover_letter: row.cover_letter,
    payload: payloadFromRow(row),
    };
  });

  const filtered =
    kind === "applications"
      ? records.filter((item) => item.form_type === "job_application" || item.form_type === "internship_application")
      : kind === "services"
        ? records.filter((item) => item.form_type !== "job_application" && item.form_type !== "internship_application")
        : records;

  return Response.json({ ok: true, data: filtered });
}

async function updateMysqlFormSubmission(request: Request) {
  const body = (await request.json()) as { id?: string; status?: string };
  if (!body.id || !body.status) {
    return Response.json({ ok: false, error: "Submission id and status are required." }, { status: 400 });
  }

  const statusCode = statusLabelToCode[body.status] || body.status.toLowerCase().replaceAll(" ", "_");
  const [result] = await pool.execute<mysql.ResultSetHeader>(
    `
      UPDATE form_submissions fs
      JOIN form_submission_statuses fss ON fss.code = ?
      SET fs.status_id = fss.id
      WHERE fs.id = ?
    `,
    [statusCode, body.id],
  );

  if (!result.affectedRows) {
    return Response.json({ ok: false, error: "Submission or status was not found." }, { status: 404 });
  }

  return Response.json({ ok: true });
}

async function deleteMysqlFormSubmission(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return Response.json({ ok: false, error: "Submission id is required." }, { status: 400 });
  }

  await pool.execute("DELETE FROM form_submissions WHERE id = ?", [id]);
  return Response.json({ ok: true });
}

export async function handleMysqlFormSubmission(request: Request) {
  if (request.method === "GET") {
    return listMysqlFormSubmissions(request);
  }

  if (request.method === "PATCH") {
    return updateMysqlFormSubmission(request);
  }

  if (request.method === "DELETE") {
    return deleteMysqlFormSubmission(request);
  }

  if (request.method !== "POST") {
    return Response.json({ ok: false, error: "Method not allowed" }, { status: 405 });
  }

  const contentType = request.headers.get("content-type") || "";
  const uploadedFiles: File[] = [];
  let payload: FormPayload = {};

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        if (value.size > 0) uploadedFiles.push(value);
      } else {
        payload[key] = value;
      }
    }
  } else {
    payload = (await request.json()) as FormPayload;
  }

  const requestedType = cleanText(payload.form_type) || cleanText(payload.service_type);
  const formTypeCode = serviceTypeToFormType[requestedType] || requestedType;
  if (!formTypeCode) {
    return Response.json({ ok: false, error: "Form type is required." }, { status: 400 });
  }

  let connection: mysql.PoolConnection | undefined;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    const submissionId = await createBaseSubmission(connection, formTypeCode, payload, request);
    await insertSpecificForm(connection, submissionId, formTypeCode, payload);

    for (const file of uploadedFiles) {
      const savedFile = await saveUploadedFile(file, formTypeCode);
      if (!savedFile) continue;
      await connection.execute(
        `
          INSERT INTO uploaded_files (
            form_submission_id, file_role, original_name, stored_path, mime_type, size_bytes
          ) VALUES (?, ?, ?, ?, ?, ?)
        `,
        [submissionId, "resume", savedFile.originalName, savedFile.storedPath, savedFile.mimeType, savedFile.sizeBytes],
      );
    }

    await connection.commit();
    return Response.json({ ok: true, submission_id: submissionId });
  } catch (error) {
    if (connection) {
      await connection.rollback().catch(() => undefined);
    }
    const message = error instanceof Error ? error.message : "Unable to submit the form.";
    console.error("[MySQL form submission]", error);
    return Response.json({ ok: false, error: message }, { status: 400 });
  } finally {
    connection?.release();
  }
}
