"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "../../../lib/supabase/client";
import { AuthTabSwitcher } from "../auth-tab-switcher";
import styles from "../auth.module.css";
import { SocialButtons } from "../social-buttons";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage("Please complete all required fields.");
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

    if (!agreedToTerms) {
      setErrorMessage("Please accept the Terms of Use and Privacy Policy to continue.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const redirectUrl = `${window.location.origin}/auth/callback`;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: name,
            full_name: name,
          },
        },
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          setErrorMessage(
            "An account with this email address already exists. Please sign in instead.",
          );
        } else {
          setErrorMessage(error.message);
        }
        setLoading(false);
        return;
      }

      if (data.user && !data.session) {
        router.push(`/verify?email=${encodeURIComponent(email)}`);
      } else {
        router.push("/overview");
        router.refresh();
      }
    } catch {
      setErrorMessage("An unexpected error occurred during account creation.");
      setLoading(false);
    }
  };

  return (
    <>
      <AuthTabSwitcher />

      <form
        className={styles.authForm}
        onSubmit={(e) => {
          void handleSignUp(e);
        }}
      >
        {errorMessage && (
          <div className={styles.errorBanner} role="alert">
            {errorMessage}
          </div>
        )}

        <div className={styles.fieldGroup}>
          <label htmlFor="name">
            <span>Full name</span>
            <span className={styles.requiredStar}>*</span>
          </label>
          <div className={styles.inputWrapper}>
            <span aria-hidden="true" className={styles.inputIcon}>
              👤
            </span>
            <input
              autoComplete="name"
              className={styles.authInput}
              id="name"
              name="name"
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Morgan"
              required
              type="text"
              value={name}
            />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="email">
            <span>Email address</span>
            <span className={styles.requiredStar}>*</span>
          </label>
          <div className={styles.inputWrapper}>
            <span aria-hidden="true" className={styles.inputIcon}>
              ✉
            </span>
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
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="password">
            <span>Password (min 8 characters)</span>
            <span className={styles.requiredStar}>*</span>
          </label>
          <div className={styles.inputWrapper}>
            <span aria-hidden="true" className={styles.inputIcon}>
              🔑
            </span>
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
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="confirmPassword">
            <span>Confirm password</span>
            <span className={styles.requiredStar}>*</span>
          </label>
          <div className={styles.inputWrapper}>
            <span aria-hidden="true" className={styles.inputIcon}>
              🔑
            </span>
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
        </div>

        <div className={styles.checkboxGroup}>
          <input
            checked={agreedToTerms}
            id="terms"
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            required
            type="checkbox"
          />
          <label htmlFor="terms">
            I confirm I am 18+ and agree to the{" "}
            <Link className={styles.authLink} href="/terms" target="_blank">
              Terms of Use
            </Link>{" "}
            and{" "}
            <Link className={styles.authLink} href="/privacy" target="_blank">
              Privacy Policy
            </Link>
            .
          </label>
        </div>

        <button className={styles.submitBtn} disabled={loading} type="submit">
          {loading ? "Creating account..." : "Create account →"}
        </button>
      </form>

      <SocialButtons mode="sign-up" onError={setErrorMessage} />

      <div className={styles.authFooterLinks}>
        <span>Already have an account?</span>
        <Link className={styles.authLink} href="/sign-in">
          Sign in
        </Link>
      </div>
    </>
  );
}
