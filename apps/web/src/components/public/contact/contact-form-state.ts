export type ContactFormState = Readonly<{
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors: Readonly<Record<string, readonly string[]>>;
}>;

export const initialContactFormState: ContactFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};
