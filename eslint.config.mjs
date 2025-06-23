import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript"],
  }),

  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Disable the base rule for TypeScript files
      "no-unused-vars": "off",
      // Use the TypeScript-specific rule with error level
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
      // Warn on console.log usage
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
]

export default eslintConfig
