"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UserAvatar } from "../../../../components/user-avatar";
import styles from "../settings.module.css";

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80",
];

interface AvatarUploaderProps {
  currentAvatarUrl?: string | null | undefined;
  displayName?: string | null | undefined;
}

export function AvatarUploader({
  currentAvatarUrl,
  displayName,
}: Readonly<AvatarUploaderProps>) {
  const router = useRouter();
  const [avatar, setAvatar] = useState<string | null>(currentAvatarUrl ?? null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setStatusMessage({ type: "error", text: "Please select a valid image file (PNG, JPG, WebP)." });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize to 256x256 for optimal profile display and light payload
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const size = 256;
        canvas.width = size;
        canvas.height = size;

        // Cover fill
        const minDim = Math.min(img.width, img.height);
        const startX = (img.width - minDim) / 2;
        const startY = (img.height - minDim) / 2;
        ctx?.drawImage(img, startX, startY, minDim, minDim, 0, 0, size, size);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        saveAvatar(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const saveAvatar = async (avatarUrl: string) => {
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/account/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to update avatar");
      }

      setAvatar(avatarUrl);
      setStatusMessage({ type: "success", text: "Profile avatar updated successfully!" });
      router.refresh();
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to update avatar",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/account/avatar", {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to reset avatar");
      }

      setAvatar(null);
      setStatusMessage({ type: "success", text: "Avatar reset to default!" });
      router.refresh();
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to reset avatar",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <h2>Profile avatar</h2>
        <p>Upload a custom photo or choose a default avatar.</p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", margin: "1rem 0" }}>
        <UserAvatar name={displayName} size={68} src={avatar} />
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            <input
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileUpload}
              ref={fileInputRef}
              style={{ display: "none" }}
              type="file"
            />
            <button
              className={styles.submitBtn}
              disabled={isSaving}
              onClick={() => fileInputRef.current?.click()}
              type="button"
            >
              {isSaving ? "Saving..." : "Upload photo"}
            </button>
            {avatar && (
              <button
                className={styles.resetBtn}
                disabled={isSaving}
                onClick={handleRemoveAvatar}
                type="button"
              >
                Reset to default
              </button>
            )}
          </div>
          <span style={{ fontSize: "0.75rem", color: "var(--pt-stone-500)" }}>
            JPG, PNG or WebP. Max 5MB (auto-optimized).
          </span>
        </div>
      </div>

      {statusMessage && (
        <div
          style={{
            padding: "0.65rem 0.95rem",
            borderRadius: "0.6rem",
            fontSize: "0.82rem",
            fontWeight: "600",
            marginBottom: "1rem",
            background: statusMessage.type === "success" ? "var(--pt-emerald-50)" : "var(--pt-rose-50)",
            color: statusMessage.type === "success" ? "var(--pt-emerald-700)" : "var(--pt-rose-600)",
            border: `1px solid ${statusMessage.type === "success" ? "var(--pt-emerald-200)" : "var(--pt-rose-200)"}`,
          }}
        >
          {statusMessage.text}
        </div>
      )}

      <div>
        <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--pt-stone-700)", display: "block", marginBottom: "0.5rem" }}>
          Or select a preset avatar:
        </span>
        <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap" }}>
          {PRESET_AVATARS.map((url, idx) => (
            <button
              disabled={isSaving}
              key={idx}
              onClick={() => saveAvatar(url)}
              style={{
                background: "none",
                border: avatar === url ? "2px solid var(--pt-emerald-600)" : "1px solid var(--pt-border-default)",
                borderRadius: "999px",
                padding: "2px",
                cursor: "pointer",
                transition: "transform 140ms",
              }}
              type="button"
            >
              <UserAvatar name={`Preset ${idx + 1}`} size={42} src={url} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
