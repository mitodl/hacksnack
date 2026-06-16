import { resolve } from "node:path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import dts from "vite-plugin-dts"

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ["src"],
      exclude: ["**/*.test.ts", "**/*.test.tsx"],
      insertTypesEntry: true,
      rollupTypes: false,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "mjs" : "cjs"}`,
    },
    sourcemap: true,
    rollupOptions: {
      output: {
        exports: "named",
        // Re-emit the "use client" directive that bundling otherwise strips,
        // so the package works when imported from a React Server Component
        // (e.g. Next.js App Router). The whole library is client-only.
        banner: '"use client";',
      },
      // Everything the consumer is expected to provide stays external so the
      // bundle is small and we don't ship duplicate copies of React/Emotion.
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "@emotion/react",
        "@emotion/styled",
        "pdfjs-dist",
      ],
    },
  },
})
