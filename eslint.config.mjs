import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const webFiles = ["apps/web/**/*.{js,jsx,mjs,ts,tsx,mts,cts}"];
const scopedNextConfig = nextCoreWebVitals.map((config) =>
  "ignores" in config ? config : { ...config, files: webFiles },
);

export default [
  ...nextTypeScript,
  ...scopedNextConfig,
  {
    ignores: [
      "**/.next/**",
      "**/.turbo/**",
      "**/build/**",
      "**/coverage/**",
      "**/dist/**",
      "**/next-env.d.ts",
      "**/node_modules/**",
    ],
  },
];
