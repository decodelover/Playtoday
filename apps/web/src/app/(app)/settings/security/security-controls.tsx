"use client";

import { PasswordChangeSchema } from "@playtoday/validation";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createSupabaseBrowserClient } from "../../../../lib/supabase/client";
import styles from "../settings.module.css";

function passwordError(code?: string) {
  switch (code) {
    case "invalid_credentials":
      return "Your current password was not accepted.";
    case "same_password":
      return "Choose a password you are not currently using.";
    case "weak_password":
      return "Choose a stronger password and try again.";
    case "reauthentication_needed":
      return "Sign in again before changing your password.";
    default:
      return "We couldn't change your password. Try again.";
  }
}

export function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  return (
    <form
      className={styles.formSection}
      onSubmit={(event) => {
        event.preventDefault();
        const result = PasswordChangeSchema.safeParse({
          currentPassword,
          newPassword,
          confirmPassword,
        });
        if (!result.success) {
          setStatus("error");
          setMessage(result.error.issues[0]?.message ?? "Check your passwords.");
          return;
        }

        setStatus("saving");
        setMessage(null);
        const supabase = createSupabaseBrowserClient();
        void supabase.auth
          .updateUser({
            current_password: result.data.currentPassword,
            password: result.data.newPassword,
          })
          .then(({ error }) => {
            if (error) {
              setStatus("error");
              setMessage(passwordError(error.code));
              return;
            }
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setStatus("saved");
            setMessage("Your password has been changed.");
          })
          .catch(() => {
            setStatus("error");
            setMessage("We couldn't change your password. Check your connection.");
          });
      }}
    >
      <div className={styles.panelHeader}>
        <h2>Password</h2>
        <p>Confirm your current password before choosing a new one.</p>
      </div>
      <div className={styles.field}>
        <label htmlFor="current-password">Current password</label>
        <div className={styles.passwordWrap}>
          <input
            autoComplete="current-password"
            id="current-password"
            onChange={(event) => setCurrentPassword(event.target.value)}
            required
            type={visible ? "text" : "password"}
            value={currentPassword}
          />
          <button
            aria-label={visible ? "Hide passwords" : "Show passwords"}
            className={styles.passwordToggle}
            onClick={() => setVisible((value) => !value)}
            type="button"
          >
            {visible ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      <div className={styles.field}>
        <label htmlFor="new-password">New password</label>
        <input
          autoComplete="new-password"
          id="new-password"
          minLength={8}
          onChange={(event) => setNewPassword(event.target.value)}
          required
          type={visible ? "text" : "password"}
          value={newPassword}
        />
        <p className={styles.helper}>Use at least 8 characters.</p>
      </div>
      <div className={styles.field}>
        <label htmlFor="confirm-password">Confirm new password</label>
        <input
          autoComplete="new-password"
          id="confirm-password"
          minLength={8}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
          type={visible ? "text" : "password"}
          value={confirmPassword}
        />
      </div>
      <div className={styles.buttonRow}>
        <button className={styles.button} disabled={status === "saving"} type="submit">
          {status === "saving" ? "Changing password..." : "Change password"}
        </button>
        {message ? (
          <p
            aria-live="polite"
            className={status === "saved" ? styles.formSuccess : styles.formError}
          >
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}

export function SessionControls() {
  const router = useRouter();
  const [working, setWorking] = useState<"local" | "others" | "global" | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function signOut(scope: "global" | "local" | "others") {
    setWorking(scope);
    setMessage(null);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signOut({ scope });
    if (error) {
      setWorking(null);
      setMessage("We couldn't update your sessions. Try again.");
      return;
    }

    if (scope === "others") {
      setWorking(null);
      setMessage("Other refresh sessions have been signed out.");
      return;
    }

    router.replace("/sign-in");
    router.refresh();
  }

  return (
    <section className={styles.formSection}>
      <div className={styles.panelHeader}>
        <h2>Sessions</h2>
        <p>
          You can sign out here, on other devices, or everywhere. A verified device
          history is not available, so no device list is shown.
        </p>
      </div>
      <div className={styles.buttonRow}>
        <button
          className={styles.button}
          data-secondary
          disabled={working !== null}
          onClick={() => void signOut("local")}
          type="button"
        >
          {working === "local" ? "Signing out..." : "Sign out this device"}
        </button>
        <button
          className={styles.button}
          data-secondary
          disabled={working !== null}
          onClick={() => void signOut("others")}
          type="button"
        >
          {working === "others" ? "Signing out..." : "Sign out other sessions"}
        </button>
        <button
          className={styles.dangerButton}
          disabled={working !== null}
          onClick={() => void signOut("global")}
          type="button"
        >
          {working === "global" ? "Signing out..." : "Sign out everywhere"}
        </button>
      </div>
      {message ? (
        <p aria-live="polite" className={styles.formSuccess}>
          {message}
        </p>
      ) : null}
      <p className={styles.helper}>
        Revoked access tokens may remain valid until they expire. Refresh sessions are
        revoked immediately.
      </p>
    </section>
  );
}
