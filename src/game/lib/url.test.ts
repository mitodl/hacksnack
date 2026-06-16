import {
  getEmbedUrl,
  isPdfUrl,
  parseLatLngFromClue,
  streetViewEmbedUrl,
} from "./url"

describe("getEmbedUrl", () => {
  it("converts a youtube watch URL to an embed URL", () => {
    expect(getEmbedUrl("https://www.youtube.com/watch?v=abc123")).toBe(
      "https://www.youtube.com/embed/abc123",
    )
  })

  it("includes a numeric start time", () => {
    expect(getEmbedUrl("https://www.youtube.com/watch?v=abc123&t=90")).toBe(
      "https://www.youtube.com/embed/abc123?start=90",
    )
  })

  it("parses an h/m/s start time", () => {
    expect(getEmbedUrl("https://www.youtube.com/watch?v=abc123&t=1m30s")).toBe(
      "https://www.youtube.com/embed/abc123?start=90",
    )
  })

  it("handles youtu.be short links", () => {
    expect(getEmbedUrl("https://youtu.be/xyz")).toBe(
      "https://www.youtube.com/embed/xyz",
    )
  })

  it("returns non-youtube URLs unchanged", () => {
    expect(getEmbedUrl("https://example.com/page")).toBe(
      "https://example.com/page",
    )
  })

  it("returns an empty string for empty or invalid input", () => {
    expect(getEmbedUrl("")).toBe("")
    expect(getEmbedUrl("not a url")).toBe("")
  })
})

describe("isPdfUrl", () => {
  it("detects PDF paths", () => {
    expect(isPdfUrl("https://example.com/file.pdf")).toBe(true)
  })

  it("rejects non-PDF paths and invalid URLs", () => {
    expect(isPdfUrl("https://example.com/page.html")).toBe(false)
    expect(isPdfUrl("not a url")).toBe(false)
  })
})

describe("parseLatLngFromClue", () => {
  it("extracts coordinates", () => {
    expect(parseLatLngFromClue("48.8584, 2.2945")).toEqual({
      lat: 48.8584,
      lng: 2.2945,
    })
  })

  it("returns null for out-of-range or missing coordinates", () => {
    expect(parseLatLngFromClue("200, 0")).toBeNull()
    expect(parseLatLngFromClue("no coordinates here")).toBeNull()
  })
})

describe("streetViewEmbedUrl", () => {
  it("builds a keyless Street View embed URL from coordinates", () => {
    expect(streetViewEmbedUrl(34.987108, 135.759616)).toBe(
      "https://maps.google.com/maps?q=&layer=c&cbll=34.987108,135.759616&cbp=11,0,0,0,0&output=svembed",
    )
  })
})

