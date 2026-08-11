"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "../../../lib/supabase/client";
import { AuthTabSwitcher } from "../auth-tab-switcher";
import styles from "../auth.module.css";
import { SocialButtons } from "../social-buttons";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("Please enter both your email address and password.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setErrorMessage("The email address or password you entered is incorrect.");
        } else if (error.message.includes("Email not confirmed")) {
          setErrorMessage("Please verify your email address before signing in.");
        } else {
          setErrorMessage(error.message);
        }
        setLoading(false);
        return;
      }

      const targetUrl =
        next && next.startsWith("/") && !next.startsWith("//") ? next : "/overview";

      router.push(targetUrl);
      router.refresh();
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <AuthTabSwitcher />

      <form
        className={styles.authForm}
        onSubmit={(e) => {
          void handleSignIn(e);
        }}
      >
        {errorMessage && (
          <div className={styles.errorBanner} role="alert">
            {errorMessage}
          </div>
        )}

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
            <span>Password</span>
            <span className={styles.requiredStar}>*</span>
          </label>
          <div className={styles.inputWrapper}>
            <span aria-hidden="true" className={styles.inputIcon}>
              🔑
            </span>
            <input
              autoComplete="current-password"
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

        <div className={styles.subRow}>
          <label className={styles.checkboxGroup} htmlFor="remember">
            <input
              checked={rememberMe}
              id="remember"
              onChange={(e) => setRememberMe(e.target.checked)}
              type="checkbox"
            />
            <span>Remember me</span>
          </label>
          <Link className={styles.authLink} href="/forgot-password">
            Forgot password?
          </Link>
        </div>

        <button className={styles.submitBtn} disabled={loading} type="submit">
          {loading ? "Signing in..." : "Sign in →"}
        </button>
      </form>

      <SocialButtons mode="sign-in" onError={setErrorMessage} />

      <div className={styles.authFooterLinks}>
        <span>Don&apos;t have an account?</span>
        <Link className={styles.authLink} href="/sign-up">
          Create an account
        </Link>
      </div>
    </>
  );
}
