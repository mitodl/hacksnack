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

import { cp, mkdir } from "node:fs/promises"
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
