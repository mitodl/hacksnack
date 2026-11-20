#!/usr/bin/env node
// Copies the game's static assets into a target directory (typically your
// app's public folder), preserving the "games/hacksnack" sub-path that the
// default asset base path expects.
//
// Usage:
//   hacksnack-copy-assets <targetDir>
//   hacksnack-copy-assets ./public/games/hacksnack
//
// If <targetDir> is omitted it defaults to "./public/games/hacksnack".

import { copyFile, cp, mkdir } from "node:fs/promises"
import { createRequire } from "node:module"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const assetsDir = resolve(here, "..", "assets")

const target = resolve(process.cwd(), process.argv[2] ?? "public/games/hacksnack")

try {
  await mkdir(target, { recursive: true })
  await cp(assetsDir, target, { recursive: true })
  console.log(`Copied Hack Snack assets to ${target}`)
} catch (err) {
  console.error("Failed to copy Hack Snack assets:", err)
  process.exit(1)
}

// pdf.js refuses a worker from a different version, so serve the worker of the
// pdfjs-dist this package resolves to (the one the app bundles), not the copy in assets/.
try {
  const worker = createRequire(import.meta.url).resolve("pdfjs-dist/build/pdf.worker.mjs")
  await copyFile(worker, resolve(target, "pdf.worker.mjs"))
} catch (err) {
  console.warn("Could not copy the installed pdf.js worker; using the bundled copy:", err.message)
}
