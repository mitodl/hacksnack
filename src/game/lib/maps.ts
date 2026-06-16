// Minimal typing + loader for the subset of the Google Maps JS API used here
// (Street View only).

type StreetViewData = { location: { latLng: unknown } }

interface GoogleMapsApi {
  StreetViewService: new () => {
    getPanorama: (
      request: Record<string, unknown>,
      callback: (data: StreetViewData, status: unknown) => void,
    ) => void
  }
  StreetViewSource: { OUTDOOR: unknown }
  StreetViewStatus: { OK: unknown }
  StreetViewPanorama: new (
    el: HTMLElement,
    opts: Record<string, unknown>,
  ) => unknown
  event?: {
    trigger: (instance: unknown, eventName: string) => void
    clearInstanceListeners?: (instance: unknown) => void
  }
}

export function getGoogleMaps(): GoogleMapsApi | undefined {
  if (typeof window === "undefined") return undefined
  return (window as unknown as { google?: { maps?: GoogleMapsApi } }).google
    ?.maps
}

// Small helper to load Google Maps JS API (Street View)
let loadPromise: Promise<void> | null = null

export function loadGoogleMaps(apiKey?: string): Promise<void> {
  if (getGoogleMaps()) return Promise.resolve()
  if (loadPromise) return loadPromise

  if (!apiKey) return Promise.reject(new Error("Missing Google Maps API key"))

  loadPromise = new Promise<void>((resolve, reject) => {
    const s = document.createElement("script")
    s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly`
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => {
      loadPromise = null
      reject(new Error("Failed to load Google Maps JS API"))
    }
    document.head.appendChild(s)
  })

  return loadPromise
}
