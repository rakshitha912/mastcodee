import { useState } from "react";
import { CheckCircle2, Upload } from "lucide-react";
import type { ServicePage } from "@/lib/service-pages";
import { toast } from "sonner";
import { submitMultipartForm } from "@/lib/form-submit";

type ServiceInquiryFormProps = {
  page: ServicePage;
};

export function ServiceInquiryForm({ page }: ServiceInquiryFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [resume, setResume] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const updateValue = (name: string, value: string) => {
    setValues((current) => ({ ...current, [name]: value }));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.set("service_type", page.type);
      formData.set("form_type", page.type);
      Object.entries(values).forEach(([key, value]) => {
        formData.set(key, value);
      });
      if (resume) {
        formData.set("resume", resume);
      }

      await submitMultipartForm(formData);

      toast.success("Submitted successfully", {
        description: "Your request has been saved. Our team will contact you shortly.",
      });
      setSubmitted(true);
      setValues({});
      setResume(null);
    } catch (submissionError) {
      const errorMessage =
        submissionError instanceof Error
          ? submissionError.message
          : typeof submissionError === "object" && submissionError !== null && "message" in submissionError
            ? String((submissionError as { message: unknown }).message)
            : "Unable to submit your request. Please try again.";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center shadow-sm">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
        <h2 className="mt-4 font-display text-2xl font-bold text-emerald-800">Submission Received</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-emerald-700">{page.successMessage}</p>
        <button type="button" onClick={() => setSubmitted(false)} className="mt-6 rounded-lg border border-emerald-200 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100">
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Get in touch</p>
        <h2 className="mt-2 font-display text-2xl font-bold">Tell us how we can help</h2>
      </div>
      {error && <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <div className="grid gap-5 md:grid-cols-2">
        {page.fields.map((field) => {
          const isFullWidth = field.type === "textarea" || field.type === "file";
          return (
            <label key={field.name} className={`block ${isFullWidth ? "md:col-span-2" : ""}`}>
              <span className="mb-2 block text-sm font-medium text-foreground">
                {field.label}{field.required ? " *" : ""}
              </span>
              {field.type === "textarea" ? (
                <textarea required={field.required} value={values[field.name] || ""} onChange={(event) => updateValue(field.name, event.target.value)} rows={4} className="w-full rounded-lg border border-input bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20" />
              ) : field.type === "select" ? (
                <select required={field.required} value={values[field.name] || ""} onChange={(event) => updateValue(field.name, event.target.value)} className="w-full rounded-lg border border-input bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20">
                  <option value="">Select an option</option>
                  {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              ) : field.type === "file" ? (
                <span className="flex items-center gap-3 rounded-lg border border-dashed border-input bg-white px-4 py-3 text-sm text-muted-foreground">
                  <Upload className="h-4 w-4 text-primary" />
                  <input required={field.required} type="file" accept=".pdf,.doc,.docx" onChange={(event) => setResume(event.target.files?.[0] || null)} className="min-w-0 flex-1 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-sm file:font-semibold file:text-foreground" />
                </span>
              ) : (
                <input required={field.required} type={field.type || "text"} value={values[field.name] || ""} onChange={(event) => updateValue(field.name, event.target.value)} placeholder={field.placeholder} className="w-full rounded-lg border border-input bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20" />
              )}
            </label>
          );
        })}
      </div>
      <button type="submit" disabled={submitting} className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60">
        {submitting ? "Submitting..." : page.submitLabel}
      </button>
    </form>
  );
}
