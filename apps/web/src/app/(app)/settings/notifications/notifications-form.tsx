"use client";

import type { NotificationChannelsInput } from "@playtoday/validation";
import { useState } from "react";

import { updateNotificationChannelsAction } from "../../../actions/settings";
import styles from "../settings.module.css";

export function NotificationsForm({
  initial,
}: Readonly<{ initial: NotificationChannelsInput }>) {
  const [channels, setChannels] = useState(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  return (
    <form
      className={styles.formSection}
      onSubmit={(event) => {
        event.preventDefault();
        setStatus("saving");
        setMessage(null);
        void updateNotificationChannelsAction(channels).then((result) => {
          setStatus(result.success ? "saved" : "error");
          setMessage(
            result.success
              ? "Your notification choices are saved."
              : (result.error ?? null),
          );
        });
      }}
    >
      <div className={styles.panelHeader}>
        <h2>Delivery channels</h2>
        <p>
          These preferences are stored now. Delivery depends on notifications that
          PlayToday has actually enabled.
        </p>
      </div>
      <fieldset className={styles.fieldset}>
        <legend className={styles.helper}>Available channels</legend>
        <label className={styles.choice}>
          <input
            checked={channels.in_app}
            onChange={(event) => {
              setChannels((current) => ({ ...current, in_app: event.target.checked }));
              setStatus("idle");
            }}
            type="checkbox"
          />
          <span>
            <span>In-app</span>
            <small>Show supported notifications inside PlayToday.</small>
          </span>
        </label>
        <label className={styles.choice}>
          <input
            checked={channels.email}
            onChange={(event) => {
              setChannels((current) => ({ ...current, email: event.target.checked }));
              setStatus("idle");
            }}
            type="checkbox"
          />
          <span>
            <span>Email</span>
            <small>Allow supported account and product email delivery.</small>
          </span>
        </label>
      </fieldset>
      <div className={styles.notice}>
        Push notifications are not available, so there is no push setting here.
      </div>
      <div className={styles.buttonRow}>
        <button className={styles.button} disabled={status === "saving"} type="submit">
          {status === "saving" ? "Saving..." : "Save notifications"}
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
