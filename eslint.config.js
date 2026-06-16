import js from "@eslint/js"
import tseslint from "typescript-eslint"
import reactHooks from "eslint-plugin-react-hooks"
import jsxA11y from "eslint-plugin-jsx-a11y"
import globals from "globals"

// Disallow font-weight literals that aren't part of the theme's weight tokens
// (400/500/700). Intentional exceptions are opted out with an inline
// `eslint-disable-next-line no-restricted-syntax`.
const noUntokenizedFontWeight = {
  selector:
    "Property[key.name='fontWeight'] > Literal[value!=400][value!=500][value!=700]",
  message:
    "Use the theme's font-weight tokens (400/500/700) instead of a literal weight.",
}

export default tseslint.config(
  { ignores: ["dist", "node_modules"] },
  {
    files: ["src/**/*.{ts,tsx}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    plugins: { "react-hooks": reactHooks, "jsx-a11y": jsxA11y },
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "jsx-a11y/no-autofocus": "warn",
      "no-restricted-syntax": ["warn", noUntokenizedFontWeight],
      // A BOM character is documented verbatim inside a comment in csv.ts.
      "no-irregular-whitespace": ["error", { skipComments: true }],
    },
  },
)
