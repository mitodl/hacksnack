"use client"

import React, { createContext, useContext, useMemo } from "react"
import {
  DEFAULT_ASSET_BASE_PATH,
  joinAssetPath,
  normalizeAssetBasePath,
} from "./config"

// The base URL path where the consuming app hosts the game's static assets,
// scoped to a single <HackSnackGame> instance via context. Defaulting to
// DEFAULT_ASSET_BASE_PATH means components still work if rendered without the
// provider (e.g. in isolation tests).
const AssetBasePathContext = createContext<string>(DEFAULT_ASSET_BASE_PATH)

export function AssetBasePathProvider({
  basePath,
  children,
}: {
  basePath?: string
  children: React.ReactNode
}) {
  const value = useMemo(
    () => normalizeAssetBasePath(basePath ?? DEFAULT_ASSET_BASE_PATH),
    [basePath],
  )
  return (
    <AssetBasePathContext.Provider value={value}>
      {children}
    </AssetBasePathContext.Provider>
  )
}

/** The normalized asset base path for the current game instance. */
export const useAssetBasePath = (): string => useContext(AssetBasePathContext)

/**
 * Returns a resolver that turns a packaged file name into a full URL using the
 * current instance's base path. The function identity is stable as long as the
 * base path doesn't change, so it's safe to use in effect/memo dependencies.
 */
export function useAsset(): (fileName: string) => string {
  const basePath = useAssetBasePath()
  return useMemo(
    () => (fileName: string) => joinAssetPath(basePath, fileName),
    [basePath],
  )
}
