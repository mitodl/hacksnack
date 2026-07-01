type WindowWithGoogle = { google?: { maps?: unknown } }

const win = window as unknown as WindowWithGoogle

// loadGoogleMaps memoizes its in-flight load in module-level state, so reload
// the module before each test to keep them isolated.
let getGoogleMaps: typeof import("./maps").getGoogleMaps
let loadGoogleMaps: typeof import("./maps").loadGoogleMaps

beforeEach(async () => {
  vi.resetModules()
  ;({ getGoogleMaps, loadGoogleMaps } = await import("./maps"))
})

afterEach(() => {
  delete win.google
  document.head.querySelectorAll("script").forEach((s) => s.remove())
})

describe("getGoogleMaps", () => {
  it("returns undefined when google is not on window", () => {
    expect(getGoogleMaps()).toBeUndefined()
  })

  it("returns undefined when google exists but maps does not", () => {
    win.google = {}
    expect(getGoogleMaps()).toBeUndefined()
  })

  it("returns the maps namespace when present", () => {
    const maps = { StreetViewService: function () {} }
    win.google = { maps }
    expect(getGoogleMaps()).toBe(maps)
  })
})

describe("loadGoogleMaps", () => {
  it("resolves immediately and injects no script when maps is already loaded", async () => {
    win.google = { maps: {} }
    await expect(loadGoogleMaps("ignored-key")).resolves.toBeUndefined()
    expect(document.head.querySelector("script")).toBeNull()
  })

  it("rejects when no API key is provided and maps is not loaded", async () => {
    await expect(loadGoogleMaps()).rejects.toThrow(
      "Missing Google Maps API key",
    )
    expect(document.head.querySelector("script")).toBeNull()
  })

  it("injects a script with the API key and resolves once it loads", async () => {
    const promise = loadGoogleMaps("test-key")
    const script = document.head.querySelector("script")
    expect(script).not.toBeNull()
    expect(script?.src).toContain("key=test-key")
    expect(script?.async).toBe(true)
    script?.onload?.(new Event("load"))
    await expect(promise).resolves.toBeUndefined()
  })

  it("rejects when the injected script fails to load", async () => {
    const promise = loadGoogleMaps("test-key")
    const script = document.head.querySelector("script")
    script?.onerror?.(new Event("error"))
    await expect(promise).rejects.toThrow("Failed to load Google Maps JS API")
  })
})
