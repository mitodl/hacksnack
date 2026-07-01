import { resolve } from "node:path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// Local dev server for manually testing the library in a browser.
//
// This is intentionally separate from vite.config.ts (which builds the
// publishable library bundle). Here we just serve index.html + dev/main.tsx and
// host the ./assets directory at the web root, so `<HackSnackGame
// assetBasePath="" />` can load its runtime assets without a build step.
export default defineConfig({
  plugins: [react()],
  publicDir: resolve(__dirname, "assets"),
  server: {
    open: true,
  },
})
