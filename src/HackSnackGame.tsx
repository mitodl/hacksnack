"use client"

import React from "react"
import GameApp from "./game/GameApp"
import { AssetBasePathProvider } from "./game/AssetContext"
import { GoogleMapsApiKeyProvider } from "./game/GoogleMapsContext"

export interface HackSnackGameProps {
  /**
   * Base URL path under which the game's static assets (images, puzzle JSON,
   * OCW course CSV and the pdf.js worker) are hosted by your app.
   *
   * Defaults to `"/games/hacksnack"`. Use the bundled `hacksnack-copy-assets`
   * script to copy the asset files into your public directory.
   */
  assetBasePath?: string
  /**
   * Google Maps JS API key used by Street View ("map") puzzles.
   */
  googleMapsApiKey?: string
}

/**
 * Hack Snack — a daily MIT OpenCourseWare puzzle game.
 *
 * This component is client-only (it reads `window` and loads the pdf.js worker
 * in the browser). In a server-rendered framework like Next.js, load it without
 * SSR, e.g. `dynamic(() => import("hacksnack").then((m) => m.HackSnackGame),
 * { ssr: false })`.
 */
export function HackSnackGame({
  assetBasePath,
  googleMapsApiKey,
}: HackSnackGameProps) {
  return (
    <AssetBasePathProvider basePath={assetBasePath}>
      <GoogleMapsApiKeyProvider apiKey={googleMapsApiKey}>
        <GameApp />
      </GoogleMapsApiKeyProvider>
    </AssetBasePathProvider>
  )
}

export default HackSnackGame
