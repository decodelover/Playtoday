"use client";

import { useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "../../../lib/supabase/client";
import styles from "../auth.module.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const redirectUrl = `${window.location.origin}/reset-password`;

      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      // Always show success message to prevent account enumeration
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.authHeader}>
        <h1>Reset your password</h1>
        <p>Enter your account email address to receive password reset instructions.</p>
      </div>

      {submitted ? (
        <div className={styles.authForm}>
          <div className={styles.successBanner} role="status">
            If an account exists for <strong>{email}</strong>, you will receive password
            reset instructions shortly. Please check your inbox and spam folder.
          </div>
          <div className={styles.authFooterLinks} style={{ justifyContent: "center" }}>
            <Link className={styles.authLink} href="/sign-in">
              Return to sign in
            </Link>
          </div>
        </div>
      ) : (
        <form
          className={styles.authForm}
          onSubmit={(e) => {
            void handleResetRequest(e);
          }}
        >
          {errorMessage && (
            <div className={styles.errorBanner} role="alert">
              {errorMessage}
            </div>
          )}

          <div className={styles.fieldGroup}>
            <label htmlFor="email">Email address</label>
            <input
              autoComplete="email"
              className={styles.authInput}
              id="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              type="email"
              value={email}
            />
          </div>

          <button className={styles.submitBtn} disabled={loading} type="submit">
            {loading ? "Sending reset link..." : "Send reset instructions →"}
          </button>

          <div className={styles.authFooterLinks} style={{ justifyContent: "center" }}>
            <Link className={styles.authLink} href="/sign-in">
              Return to sign in
            </Link>
          </div>
        </form>
      )}
    </>
  );
}
