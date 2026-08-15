"use client";

import styles from "./user-avatar.module.css";

interface UserAvatarProps {
  src?: string | null | undefined;
  name?: string | null | undefined;
  size?: number | undefined;
  className?: string | undefined;
}

export function UserAvatar({
  src,
  name,
  size = 36,
  className = "",
}: Readonly<UserAvatarProps>) {
  if (src && src.trim().length > 0) {
    return (
      <div
        className={`${styles.avatarContainer} ${className}`}
        style={{ width: size, height: size }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={name ? `${name}'s avatar` : "User avatar"}
          className={styles.avatarImage}
          src={src}
        />
      </div>
    );
  }

  // Sleek, modern default avatar with glowing emerald-stone gradient and user silhouette
  return (
    <div
      aria-label={name ? `${name}'s avatar` : "Default user avatar"}
      className={`${styles.avatarContainer} ${styles.defaultAvatar} ${className}`}
      role="img"
      style={{ width: size, height: size }}
    >
      <svg
        fill="currentColor"
        height={Math.round(size * 0.58)}
        viewBox="0 0 24 24"
        width={Math.round(size * 0.58)}
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    </div>
  );
}
