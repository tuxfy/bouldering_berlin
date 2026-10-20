import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: [
      "app/vendor/**",
      "app/sw-precache.js",
      "node_modules/**",
      "tests/fixtures/**",
      "_kontext/designsystem/**",
      "playwright-report/**",
      "test-results/**",
    ],
  },
  js.configs.recommended,
  {
    files: ["app/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser, ...globals.serviceworker },
    },
  },
  {
    files: ["scripts/**/*.mjs", "*.config.js", "tests/**/*.{js,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.node },
    },
  },
];
