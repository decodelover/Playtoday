"use client";

import { useActionState } from "react";

import { submitContactForm } from "../../../app/(public)/contact/actions";
import { initialContactFormState } from "./contact-form-state";
import { enquiryTypes } from "./contact-schema";
import styles from "./contact.module.css";

function FieldError({
  field,
  errors,
}: Readonly<{ field: string; errors: Readonly<Record<string, readonly string[]>> }>) {
  const error = errors[field]?.[0];
  return error ? (
    <p className={styles.fieldError} id={`${field}-error`}>
      {error}
    </p>
  ) : null;
}

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContactForm,
    initialContactFormState,
  );

  if (state.status === "success") {
    return (
      <section aria-live="polite" className={styles.successState}>
        <span>Submission saved</span>
        <h2>Thank you for writing to PlayToday.</h2>
        <p>{state.message}</p>
      </section>
    );
  }

  return (
    <form action={formAction} className={styles.form}>
      <div className={styles.formIntro}>
        <div>
          <span>Public contact form</span>
          <h2>Send a message</h2>
        </div>
        <p>
          Do not include passwords, payment details, bookmaker credentials, or other
          sensitive information.
        </p>
      </div>

      {state.status === "error" ? (
        <div aria-live="polite" className={styles.formError} role="alert">
          {state.message}
        </div>
      ) : null}

      <div className={styles.fieldGrid}>
        <div className={styles.field}>
          <label htmlFor="enquiry_type">Enquiry type</label>
          <select
            aria-describedby={
              state.fieldErrors.enquiry_type ? "enquiry_type-error" : undefined
            }
            aria-invalid={Boolean(state.fieldErrors.enquiry_type)}
            defaultValue=""
            id="enquiry_type"
            name="enquiry_type"
            required
          >
            <option disabled value="">
              Choose one
            </option>
            {enquiryTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <FieldError errors={state.fieldErrors} field="enquiry_type" />
        </div>

        <div className={styles.field}>
          <label htmlFor="name">Name</label>
          <input
            aria-describedby={state.fieldErrors.name ? "name-error" : undefined}
            aria-invalid={Boolean(state.fieldErrors.name)}
            autoComplete="name"
            id="name"
            maxLength={100}
            name="name"
            required
            type="text"
          />
          <FieldError errors={state.fieldErrors} field="name" />
        </div>

        <div className={styles.field}>
          <label htmlFor="email">Email address</label>
          <input
            aria-describedby={state.fieldErrors.email ? "email-error" : undefined}
            aria-invalid={Boolean(state.fieldErrors.email)}
            autoComplete="email"
            id="email"
            maxLength={254}
            name="email"
            required
            type="email"
          />
          <FieldError errors={state.fieldErrors} field="email" />
        </div>

        <div className={styles.field}>
          <label htmlFor="subject">Subject</label>
          <input
            aria-describedby={state.fieldErrors.subject ? "subject-error" : undefined}
            aria-invalid={Boolean(state.fieldErrors.subject)}
            id="subject"
            maxLength={160}
            minLength={3}
            name="subject"
            required
            type="text"
          />
          <FieldError errors={state.fieldErrors} field="subject" />
        </div>

        <div className={`${styles.field} ${styles.messageField}`}>
          <label htmlFor="message">Message</label>
          <textarea
            aria-describedby={`message-help${state.fieldErrors.message ? " message-error" : ""}`}
            aria-invalid={Boolean(state.fieldErrors.message)}
            id="message"
            maxLength={4000}
            minLength={20}
            name="message"
            required
            rows={8}
          />
          <p className={styles.helperText} id="message-help">
            20 to 4,000 characters.
          </p>
          <FieldError errors={state.fieldErrors} field="message" />
        </div>
      </div>

      <div aria-hidden="true" className={styles.honeypot}>
        <label htmlFor="website">Website</label>
        <input
          autoComplete="off"
          id="website"
          name="website"
          tabIndex={-1}
          type="text"
        />
      </div>

      <div className={styles.formFooter}>
        <p>Submitting stores the fields above so the enquiry can be reviewed.</p>
        <button disabled={pending} type="submit">
          {pending ? "Saving message..." : "Send message"}
        </button>
      </div>
    </form>
  );
}
