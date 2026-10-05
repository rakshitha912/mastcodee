import { type FormEvent, useState } from "react";
import { CheckCircle2, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { submitJsonForm } from "@/lib/form-submit";

type TrainingContactDialogProps = {
  courseTitle: string;
  triggerLabel: string;
};

export function TrainingContactDialog({ courseTitle, triggerLabel }: TrainingContactDialogProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    try {
      await submitJsonForm({
        form_type: "technical_training_contact",
        service_type: "technical_training",
        course_title: courseTitle,
        full_name: String(formData.get("full_name") ?? "").trim(),
        email: String(formData.get("email") ?? "").trim(),
        phone: String(formData.get("phone") ?? "").trim(),
        message: String(formData.get("message") ?? "").trim(),
      });
      setSubmitted(true);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to submit your request. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setSubmitted(false);
          setError("");
        }
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 font-semibold transition-colors hover:border-accent hover:text-accent"
        >
          <Mail className="h-4 w-4" />
          {triggerLabel}
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Connect with MastCode</DialogTitle>
          <DialogDescription>
            Share your details about {courseTitle}. We’ll open WhatsApp with your enquiry ready to send.
          </DialogDescription>
        </DialogHeader>
        {submitted ? (
          <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            WhatsApp is ready with your enquiry. Tap Send there to contact MastCode.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}
            <input
              name="full_name"
              required
              autoComplete="name"
              aria-label="Name"
              placeholder="Name"
              className="w-full rounded-lg border border-input bg-white px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
            <input
              name="email"
              required
              type="email"
              autoComplete="email"
              aria-label="Email"
              placeholder="Gmail or email address"
              className="w-full rounded-lg border border-input bg-white px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
            <input
              name="phone"
              required
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              pattern="[0-9+()\s-]{7,20}"
              aria-label="Phone number"
              placeholder="Phone number"
              className="w-full rounded-lg border border-input bg-white px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
            <textarea
              name="message"
              aria-label="Message"
              placeholder="Message (optional)"
              rows={3}
              className="w-full rounded-lg border border-input bg-white px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
