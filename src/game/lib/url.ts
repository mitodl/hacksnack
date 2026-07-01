// URL / clue parsing helpers (YouTube embeds, PDFs, map coordinates).

export function getEmbedUrl(rawUrl: string): string {
  const trimmedUrl = rawUrl.trim()
  if (!trimmedUrl) return ""
  try {
    const url = new URL(trimmedUrl)
    const parseStartSeconds = (value: string | null) => {
      if (!value) return 0
      const trimmed = value.trim()
      const direct = Number(trimmed)
      if (Number.isFinite(direct)) return direct
      let total = 0
      const hours = trimmed.match(/(\d+)h/)
      const minutes = trimmed.match(/(\d+)m/)
      const seconds = trimmed.match(/(\d+)s/)
      if (hours) total += Number(hours[1]) * 3600
      if (minutes) total += Number(minutes[1]) * 60
      if (seconds) total += Number(seconds[1])
      return total
    }

    if (url.hostname.includes("youtube.com")) {
      const videoId = url.searchParams.get("v")
      if (videoId) {
        const start = parseStartSeconds(url.searchParams.get("t"))
        return start
          ? `https://www.youtube.com/embed/${videoId}?start=${start}`
          : `https://www.youtube.com/embed/${videoId}`
      }
    }
    if (url.hostname === "youtu.be") {
      const id = url.pathname.replace("/", "")
      if (id) {
        const start = parseStartSeconds(url.searchParams.get("t"))
        return start
          ? `https://www.youtube.com/embed/${id}?start=${start}`
          : `https://www.youtube.com/embed/${id}`
      }
    }
  } catch {
    return ""
  }
  return trimmedUrl
}

export function isPdfUrl(value: string): boolean {
  try {
    return new URL(value).pathname.toLowerCase().endsWith(".pdf")
  } catch {
    return false
  }
}

export function parseLatLngFromClue(
  clue: string,
): { lat: number; lng: number } | null {
  const match = clue.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/)
  if (!match) return null
  const lat = Number(match[1])
  const lng = Number(match[2])
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null
  return { lat, lng }
}

// Build a keyless Google Maps Street View embed URL for the given coordinates.
// Used as a fallback when no Maps JS API key is configured: `output=svembed`
// renders a panorama in an <iframe> without requiring a key (the JS API does).
// Staying in Street View also avoids the labelled map view giving away the
// "what country is this?" answer.
export function streetViewEmbedUrl(lat: number, lng: number): string {
  return `https://maps.google.com/maps?q=&layer=c&cbll=${lat},${lng}&cbp=11,0,0,0,0&output=svembed`
}

