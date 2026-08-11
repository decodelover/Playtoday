"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "../../../lib/supabase/client";
import styles from "../auth.module.css";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!password || !confirmPassword) {
      setErrorMessage("Please complete both password fields.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify both entries.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/sign-in");
      }, 3000);
    } catch {
      setErrorMessage("Failed to update password. Please request a new reset link.");
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.authHeader}>
        <h1>Set new password</h1>
        <p>Choose a new password for your PlayToday account.</p>
      </div>

      {success ? (
        <div className={styles.authForm}>
          <div className={styles.successBanner} role="status">
            Your password has been successfully updated. Redirecting to sign in...
          </div>
          <div className={styles.authFooterLinks} style={{ justifyContent: "center" }}>
            <Link className={styles.authLink} href="/sign-in">
              Sign in now
            </Link>
          </div>
        </div>
      ) : (
        <form
          className={styles.authForm}
          onSubmit={(e) => {
            void handleUpdatePassword(e);
          }}
        >
          {errorMessage && (
            <div className={styles.errorBanner} role="alert">
              {errorMessage}
            </div>
          )}

          <div className={styles.fieldGroup}>
            <label htmlFor="password">New password (min 8 characters)</label>
            <div className={styles.inputWrapper}>
              <input
                autoComplete="new-password"
                className={styles.authInput}
                id="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                type={showPassword ? "text" : "password"}
                value={password}
              />
              <button
                aria-label={showPassword ? "Hide password" : "Show password"}
                className={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="confirmPassword">Confirm new password</label>
            <input
              autoComplete="new-password"
              className={styles.authInput}
              id="confirmPassword"
              name="confirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
            />
          </div>

          <button className={styles.submitBtn} disabled={loading} type="submit">
            {loading ? "Updating password..." : "Update password →"}
          </button>
        </form>
      )}
    </>
  );
}
