import { z } from "zod";

import { UserPreferencesSchema } from "./onboarding";

export const DisplayNameSchema = z
  .string()
  .trim()
  .min(2, "Enter at least 2 characters.")
  .max(100, "Keep your display name under 100 characters.");

export const TimezoneSchema = z
  .string()
  .trim()
  .min(1, "Choose a timezone.")
  .max(64, "Choose a valid timezone.")
  .refine((timezone) => {
    try {
      new Intl.DateTimeFormat("en", { timeZone: timezone }).format();
      return true;
    } catch {
      return false;
    }
  }, "Choose a valid timezone.");

export const NotificationChannelsSchema = z
  .object({
    email: z.boolean(),
    in_app: z.boolean(),
  })
  .strict();

export const SettingsPreferencesSchema = UserPreferencesSchema;

export const PasswordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password.").max(1024),
    newPassword: z
      .string()
      .min(8, "Use at least 8 characters.")
      .max(72, "Use no more than 72 characters."),
    confirmPassword: z.string(),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: "The new passwords do not match.",
    path: ["confirmPassword"],
  })
  .refine((value) => value.currentPassword !== value.newPassword, {
    message: "Choose a password you are not currently using.",
    path: ["newPassword"],
  });

export type NotificationChannelsInput = z.infer<typeof NotificationChannelsSchema>;
export type PasswordChangeInput = z.infer<typeof PasswordChangeSchema>;
