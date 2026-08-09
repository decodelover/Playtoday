import { z } from "zod";

export const enquiryTypes = [
  { label: "General enquiry", value: "general" },
  { label: "Product question", value: "product" },
  { label: "Data and performance", value: "data_and_performance" },
  { label: "Responsible play", value: "responsible_play" },
  { label: "Privacy request", value: "privacy" },
] as const;

const enquiryTypeValues = enquiryTypes.map((item) => item.value) as [
  (typeof enquiryTypes)[number]["value"],
  ...(typeof enquiryTypes)[number]["value"][],
];

export const contactSubmissionSchema = z.object({
  enquiry_type: z.enum(enquiryTypeValues, {
    error: "Choose an enquiry type.",
  }),
  name: z
    .string()
    .min(2, "Enter your name.")
    .max(100, "Name must be 100 characters or fewer."),
  email: z
    .string()
    .min(3, "Enter your email address.")
    .max(254, "Email must be 254 characters or fewer.")
    .email("Enter a valid email address."),
  subject: z
    .string()
    .min(3, "Enter a subject.")
    .max(160, "Subject must be 160 characters or fewer."),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters.")
    .max(4000, "Message must be 4,000 characters or fewer."),
  website: z.string().max(0, "This submission could not be accepted."),
});

export type ContactSubmissionInput = Omit<
  z.infer<typeof contactSubmissionSchema>,
  "website"
>;

function readText(formData: FormData, field: string) {
  const value = formData.get(field);
  return typeof value === "string" ? value : "";
}

function removeDisallowedControls(value: string) {
  return Array.from(value)
    .filter((character) => {
      const code = character.charCodeAt(0);
      return !(
        code <= 8 ||
        code === 11 ||
        code === 12 ||
        (code >= 14 && code <= 31) ||
        code === 127
      );
    })
    .join("");
}

function cleanSingleLine(value: string) {
  return removeDisallowedControls(value.normalize("NFKC")).replace(/\s+/gu, " ").trim();
}

function cleanMessage(value: string) {
  return removeDisallowedControls(value.normalize("NFKC"))
    .replace(/\r\n?/gu, "\n")
    .trim();
}

export function parseContactSubmission(formData: FormData) {
  return contactSubmissionSchema.safeParse({
    enquiry_type: cleanSingleLine(readText(formData, "enquiry_type")),
    name: cleanSingleLine(readText(formData, "name")),
    email: cleanSingleLine(readText(formData, "email")).toLocaleLowerCase(),
    subject: cleanSingleLine(readText(formData, "subject")),
    message: cleanMessage(readText(formData, "message")),
    website: cleanSingleLine(readText(formData, "website")),
  });
}
