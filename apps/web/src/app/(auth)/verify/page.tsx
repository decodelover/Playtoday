"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "../auth.module.css";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <>
      <div className={styles.authHeader}>
        <h1>Check your inbox</h1>
        <p>
          We sent a verification link to{" "}
          <strong>{email ? decodeURIComponent(email) : "your email address"}</strong>.
        </p>
      </div>

      <div className={styles.authForm}>
        <div className={styles.successBanner} role="status">
          Click the link in the email to activate your account and access sports
          intelligence tools.
        </div>

        <p
          style={{
            fontSize: "0.82rem",
            color: "rgb(255 255 255 / 60%)",
            textAlign: "center",
          }}
        >
          Didn’t receive the email? Check your spam folder or try signing in to request
          another link.
        </p>

        <div className={styles.authFooterLinks} style={{ justifyContent: "center" }}>
          <Link className={styles.authLink} href="/sign-in">
            Return to sign in
          </Link>
        </div>
      </div>
    </>
  );
}
