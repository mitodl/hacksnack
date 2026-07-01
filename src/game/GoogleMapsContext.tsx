"use client"

import React, { createContext, useContext } from "react"

// The Google Maps JS API key used by Street View puzzles, scoped to a single
// <HackSnackGame> instance via context. Defaulting to an empty string means the
// game still renders without the provider; Street View features are simply
// disabled until a consumer supplies a key.
const GoogleMapsApiKeyContext = createContext<string>("")

export function GoogleMapsApiKeyProvider({
  apiKey,
  children,
}: {
  apiKey?: string
  children: React.ReactNode
}) {
  return (
    <GoogleMapsApiKeyContext.Provider value={apiKey ?? ""}>
      {children}
    </GoogleMapsApiKeyContext.Provider>
  )
}

/** The Google Maps JS API key for the current game instance ("" if unset). */
export const useGoogleMapsApiKey = (): string =>
  useContext(GoogleMapsApiKeyContext)
