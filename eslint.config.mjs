import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: [
      "app/**/page.tsx",
      "app/**/layout.tsx",
      "app/**/loading.tsx",
      "app/**/error.tsx",
      "components/**/*.{ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            "@/src/application/*",
            "@/src/infrastructure/*",
            "@/lib/actions/*",
            "@/lib/supabase/*",
            "@/contexts/*",
          ],
        },
      ],
    },
  },
  {
    files: ["src/interface-adapters/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            "@/app/*",
            "@/components/*",
            "@/contexts/*",
            "@/src/infrastructure/*",
            "next/*",
            "react",
            "react/*",
          ],
        },
      ],
    },
  },
  {
    files: ["src/application/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            "@/app/*",
            "@/components/*",
            "@/contexts/*",
            "@/src/infrastructure/*",
            "next",
            "next/*",
            "react",
            "react/*",
            "@supabase/*",
            "stream-chat",
            "@stream-io/*",
          ],
        },
      ],
    },
  },
  {
    files: ["src/entities/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            "@/app/*",
            "@/components/*",
            "@/contexts/*",
            "@/src/application/*",
            "@/src/infrastructure/*",
            "@/src/interface-adapters/*",
            "next",
            "next/*",
            "react",
            "react/*",
            "@supabase/*",
            "stream-chat",
            "@stream-io/*",
          ],
        },
      ],
    },
  },
  {
    files: ["src/infrastructure/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: ["@/app/*", "@/components/*", "@/contexts/*"],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
