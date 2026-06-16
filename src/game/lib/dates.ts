// Date helpers for the daily puzzle set selection and demo deep-links.

export function formatDateKey(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
}

export function parseDateKey(dateStr: string): Date | null {
  const parts = dateStr.split("/")
  if (parts.length !== 3) return null
  const [mRaw, dRaw, yRaw] = parts
  const month = Number(mRaw)
  const day = Number(dRaw)
  const year = Number(yRaw)
  if (
    !Number.isFinite(month) ||
    !Number.isFinite(day) ||
    !Number.isFinite(year)
  )
    return null
  return new Date(year, month - 1, day)
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function dateTime(date: Date): number {
  return startOfDay(date).getTime()
}

export function getAvailableSetDates(rows: Array<{ date?: string }>): Date[] {
  const times = new Set<number>()
  rows.forEach((row) => {
    if (!row.date) return
    const parsed = parseDateKey(row.date)
    if (parsed) times.add(dateTime(parsed))
  })
  return Array.from(times)
    .sort((a, b) => a - b)
    .map((time) => new Date(time))
}

export function findCurrentSetDate(
  availableDates: Date[],
  today: Date,
): Date | null {
  const todayTime = dateTime(today)
  let current: Date | null = null
  for (const date of availableDates) {
    if (dateTime(date) > todayTime) break
    current = date
  }
  return current
}

export function findAdjacentSetDate(
  availableDates: Date[],
  selectedDate: Date,
  direction: -1 | 1,
): Date | null {
  const selectedTime = dateTime(selectedDate)
  if (direction > 0) {
    return availableDates.find((date) => dateTime(date) > selectedTime) || null
  }
  for (let i = availableDates.length - 1; i >= 0; i--) {
    if (dateTime(availableDates[i]) < selectedTime) return availableDates[i]
  }
  return null
}

export function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

export function getDateFromHash(): Date | null {
  if (typeof window === "undefined") return null
  const hash = window.location.hash || ""
  const match = hash.match(/date=([^&]+)/i)
  if (!match) return null
  const raw = decodeURIComponent(match[1]).trim()
  if (!raw) return null
  const normalized = raw.replace(/-/g, "/")
  const parsed = parseDateKey(normalized)
  if (!parsed) return null
  return startOfDay(parsed)
}

export function setDateInHash(date: Date) {
  if (typeof window === "undefined") return
  const key = formatDateKey(date).replace(/\//g, "-")
  window.location.hash = `#/demo?date=${key}`
}
