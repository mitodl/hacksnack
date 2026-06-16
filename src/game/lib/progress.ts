import type { GroupMaps } from "../state"

// Solved-puzzle progress is persisted per set-date in localStorage so it
// survives component remounts — e.g. when a host app remounts the game in
// response to the hash changing during set navigation — as well as full page
// reloads and reopening the tab. All access is SSR-safe and best-effort:
// localStorage is undefined on the server and can throw in sandboxed iframes /
// privacy modes, so every call is guarded.
export type DateProgress = { groupMaps: GroupMaps; symbol: string }

const KEY_PREFIX = "hacksnack:progress:"

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null
  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function loadProgress(dateKey: string): DateProgress | undefined {
  const storage = getStorage()
  if (!storage) return undefined
  try {
    const raw = storage.getItem(KEY_PREFIX + dateKey)
    return raw ? (JSON.parse(raw) as DateProgress) : undefined
  } catch {
    return undefined
  }
}

export function saveProgress(dateKey: string, value: DateProgress): void {
  const storage = getStorage()
  if (!storage) return
  try {
    storage.setItem(KEY_PREFIX + dateKey, JSON.stringify(value))
  } catch {
    // Ignore quota / serialization errors; persistence is best-effort.
  }
}

// True when a snapshot holds any real progress. Used to avoid clobbering saved
// progress with the empty initial state on mount, before it has been restored.
export function hasProgress(value: DateProgress): boolean {
  if (value.symbol) return true
  const { words, inputs, hintShown, hintCounted } = value.groupMaps
  return (
    Object.keys(words).length > 0 ||
    Object.keys(inputs).length > 0 ||
    Object.keys(hintShown).length > 0 ||
    Object.keys(hintCounted).length > 0
  )
}
