import globals from "globals";
import airbnbBase from "eslint-config-airbnb-base";
import importPlugin from "eslint-plugin-import";
import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin-js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ["dist/**"],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        document: "readonly",
      },
    },
    plugins: {
      import: importPlugin,
      "@stylistic/js": stylistic,
    },
    rules: {
      ...airbnbBase.rules,
      "@stylistic/js/indent": ["error", 2],
      "@stylistic/js/quotes": ["error", "single"],
      "@stylistic/js/semi": ["error", "never"],
      "no-console": "off",
      eqeqeq: "error",
    },
  },
  js.configs.recommended,
];
