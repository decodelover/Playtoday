export const typographyTokens = {
  displayLarge: "pt-type-display-large",
  displayMedium: "pt-type-display-medium",
  heading1: "pt-type-heading-1",
  heading2: "pt-type-heading-2",
  heading3: "pt-type-heading-3",
  heading4: "pt-type-heading-4",
  bodyLarge: "pt-type-body-large",
  body: "pt-type-body",
  bodySmall: "pt-type-body-small",
  label: "pt-type-label",
  caption: "pt-type-caption",
  dataLarge: "pt-type-data-large",
  dataMedium: "pt-type-data-medium",
  dataSmall: "pt-type-data-small",
} as const;

export type TypographyToken = keyof typeof typographyTokens;
