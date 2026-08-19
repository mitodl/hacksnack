// Fetching/parsing for the daily puzzle picker (JSON).
import { joinAssetPath } from "../config"

// Cached per base path so two <HackSnackGame> instances pointing at different
// asset hosts don't read each other's data.
//
// Caches live for the lifetime of the module and are never invalidated: the
// puzzle data is static per day, so a single fetch per base path is correct in
// production. Call clearCaches() to reset between tests or after a dev
// hot-module reload, where a fresh fetch is wanted.
// Shape of the human-authored JSON puzzle list. Each day lists only the
// puzzles it actually uses; everything is optional so the file stays readable.
export type PuzzleEntry = { clue?: string; answer?: string; hint?: string }

export type PuzzleDay = {
  date?: string
  courseLink?: string
  fact?: { name?: string; text?: string; link?: string }
  puzzles?: {
    rebus?: PuzzleEntry
    scramble?: PuzzleEntry
    riddle?: PuzzleEntry
    mapCoord?: PuzzleEntry
    symbol?: PuzzleEntry
    equation?: PuzzleEntry
    image?: PuzzleEntry
  }
  notes?: string[]
}

const _pickerCache = new Map<string, PuzzleDay[]>()

// Drop cached picker data so the next fetch re-reads from the network. Intended for tests and dev hot-module reloads; see the cache note
// above for the production no-invalidation contract.
export function clearCaches(): void {
  _pickerCache.clear()
}

export async function fetchPuzzlePickerRows(
  basePath: string,
): Promise<PuzzleDay[]> {
  const cached = _pickerCache.get(basePath)
  if (cached) return cached

  let text: string | null = null
  try {
    const res = await fetch(joinAssetPath(basePath, "puzzle_picker_list.json"))
    if (res.ok) text = await res.text()
  } catch {
    // fall through to empty list
  }
  if (!text) {
    _pickerCache.set(basePath, [])
    return []
  }

  let days: PuzzleDay[] = []
  try {
    const parsed = JSON.parse(text)
    days = Array.isArray(parsed) ? parsed : parsed.days || []
  } catch {
    _pickerCache.set(basePath, [])
    return []
  }

  _pickerCache.set(basePath, days)
  return days
}

// A day is playable when at least one puzzle has both a clue and an answer.
export function hasPickerData(day: PuzzleDay | null): boolean {
  if (!day?.puzzles) return false
  const p = day.puzzles
  const filled = (entry?: PuzzleEntry) => !!(entry?.clue && entry?.answer)
  return (
    filled(p.rebus) ||
    filled(p.scramble) ||
    filled(p.riddle) ||
    filled(p.mapCoord) ||
    filled(p.symbol) ||
    filled(p.equation) ||
    filled(p.image)
  )
}
