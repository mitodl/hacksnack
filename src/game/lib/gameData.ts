// Fetching/parsing for the game's two data sources: the OCW course list
// (CSV) and the daily puzzle picker (JSON).
import { joinAssetPath } from "../config"

type Course = { dept: string; title: string; year: string }

// Cached per base path so two <HackSnackGame> instances pointing at different
// asset hosts don't read each other's data.
//
// Caches live for the lifetime of the module and are never invalidated: the
// puzzle data is static per day, so a single fetch per base path is correct in
// production. Call clearCaches() to reset between tests or after a dev
// hot-module reload, where a fresh fetch is wanted.
const _coursesCache = new Map<string, Course[]>()

export function parseCsvRows(text: string): string[][] {
  // Strip a leading UTF-8 BOM so the first header cell isn't "﻿dept",
  // which would break the name-based column lookup in fetchCourses.
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1)
  const rows: string[][] = []
  let cur: string[] = []
  let field = ""
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += ch
      }
    } else {
      if (ch === '"') {
        inQuotes = true
      } else if (ch === ",") {
        cur.push(field)
        field = ""
      } else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && text[i + 1] === "\n") continue
        cur.push(field)
        field = ""
        if (cur.length > 1 || cur[0] !== "") rows.push(cur)
        cur = []
      } else {
        field += ch
      }
    }
  }
  if (field !== "" || cur.length) {
    cur.push(field)
    rows.push(cur)
  }
  return rows
}

async function fetchCourses(basePath: string): Promise<Course[]> {
  const cached = _coursesCache.get(basePath)
  if (cached) return cached
  const paths = [joinAssetPath(basePath, "ocw_courses.csv")]
  let text: string | null = null
  for (const p of paths) {
    try {
      const res = await fetch(p)
      if (!res.ok) continue
      text = await res.text()
      break
    } catch {
      // try next
    }
  }
  if (!text) {
    _coursesCache.set(basePath, [])
    return []
  }

  const rows = parseCsvRows(text)

  // first row is header
  const header = rows.shift() || []
  const idx = (name: string) =>
    header.findIndex(
      (h) => h && h.toLowerCase().trim() === name.toLowerCase().trim(),
    )
  const di = idx("dept")
  const ti = idx("title")
  const yi = idx("year")

  const courses: Course[] = rows.map((r) => ({
    dept: (r[di] || r[0] || "").trim(),
    title: (r[ti] || r[1] || "").trim(),
    year: (r[yi] || r[2] || "").trim(),
  }))
  _coursesCache.set(basePath, courses)
  return courses
}

type CourseMatch = { title: string; url: string }

export async function findCourseMatches(
  query: string,
  basePath: string,
): Promise<CourseMatch[]> {
  const data = await fetchCourses(basePath)
  const q = query.toLowerCase()
  return data
    .filter(
      (course) =>
        course.title.toLowerCase().includes(q) ||
        course.dept.toLowerCase().includes(q) ||
        course.year.toLowerCase().includes(q),
    )
    .slice(0, 20)
    .map((course) => ({
      title: course.title,
      url: `https://ocw.mit.edu/courses/${[course.dept, course.title, course.year].join("-")}/`,
    }))
}

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

// Drop all cached course and picker data so the next fetch re-reads from the
// network. Intended for tests and dev hot-module reloads; see the cache note
// above for the production no-invalidation contract.
export function clearCaches(): void {
  _coursesCache.clear()
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
