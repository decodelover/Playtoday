import baseConfig from "@playtoday/config/eslint/base";

export default [
  ...baseConfig,
  {
    ignores: ["apps/**", "packages/**", "services/**"],
  },
];
