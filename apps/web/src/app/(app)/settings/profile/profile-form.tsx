"use client";

import { useState } from "react";

import {
  updateDisplayNameAction,
  updateTimezoneAction,
} from "../../../actions/settings";
import styles from "../settings.module.css";

export function ProfileForm({
  displayName,
  timezone,
}: Readonly<{ displayName: string | null; timezone: string }>) {
  const [name, setName] = useState(displayName ?? "");
  const [zone, setZone] = useState(timezone);
  const [nameState, setNameState] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const [timezoneState, setTimezoneState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [nameMessage, setNameMessage] = useState<string | null>(null);
  const [timezoneMessage, setTimezoneMessage] = useState<string | null>(null);

  return (
    <>
      <form
        className={styles.formSection}
        onSubmit={(event) => {
          event.preventDefault();
          setNameState("saving");
          setNameMessage(null);
          void updateDisplayNameAction(name).then((result) => {
            setNameState(result.success ? "saved" : "error");
            setNameMessage(
              result.success ? "Your display name is saved." : (result.error ?? null),
            );
          });
        }}
      >
        <div className={styles.panelHeader}>
          <h2>Display name</h2>
          <p>This name appears in your PlayToday account menu.</p>
        </div>
        <div className={styles.field}>
          <label htmlFor="display-name">Display name</label>
          <input
            autoComplete="name"
            id="display-name"
            maxLength={100}
            minLength={2}
            onChange={(event) => {
              setName(event.target.value);
              setNameState("idle");
            }}
            required
            value={name}
          />
          <p className={styles.helper}>Use between 2 and 100 characters.</p>
        </div>
        <div className={styles.buttonRow}>
          <button
            className={styles.button}
            disabled={nameState === "saving"}
            type="submit"
          >
            {nameState === "saving" ? "Saving..." : "Save name"}
          </button>
          {nameMessage ? (
            <p
              aria-live="polite"
              className={nameState === "saved" ? styles.formSuccess : styles.formError}
            >
              {nameMessage}
            </p>
          ) : null}
        </div>
      </form>

      <form
        className={styles.formSection}
        onSubmit={(event) => {
          event.preventDefault();
          setTimezoneState("saving");
          setTimezoneMessage(null);
          void updateTimezoneAction(zone).then((result) => {
            setTimezoneState(result.success ? "saved" : "error");
            setTimezoneMessage(
              result.success ? "Your timezone is saved." : (result.error ?? null),
            );
          });
        }}
      >
        <div className={styles.panelHeader}>
          <h2>Timezone</h2>
          <p>
            PlayToday stores timestamps in UTC and uses this timezone for local display.
          </p>
        </div>
        <div className={styles.field}>
          <label htmlFor="timezone">IANA timezone</label>
          <input
            autoCapitalize="none"
            autoComplete="off"
            id="timezone"
            maxLength={64}
            onChange={(event) => {
              setZone(event.target.value);
              setTimezoneState("idle");
            }}
            required
            spellCheck={false}
            value={zone}
          />
          <p className={styles.helper}>For example: Africa/Lagos or Europe/London.</p>
        </div>
        <div className={styles.buttonRow}>
          <button
            className={styles.button}
            disabled={timezoneState === "saving"}
            type="submit"
          >
            {timezoneState === "saving" ? "Saving..." : "Save timezone"}
          </button>
          {timezoneMessage ? (
            <p
              aria-live="polite"
              className={
                timezoneState === "saved" ? styles.formSuccess : styles.formError
              }
            >
              {timezoneMessage}
            </p>
          ) : null}
        </div>
      </form>
    </>
  );
}
