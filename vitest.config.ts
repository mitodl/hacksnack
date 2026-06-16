import { defineConfig } from "vitest/config"

// Test runner config, kept separate from the library build (vite.config.ts) and
// the dev server (vite.dev.config.ts). The lib's unit tests live next to the
// code they cover as src/**/*.test.ts.
export default defineConfig({
  test: {
    // Allow describe/it/expect/vi without per-file imports.
    globals: true,
    // dates.test.ts drives window.location.hash, so tests need a DOM.
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
  },
})
