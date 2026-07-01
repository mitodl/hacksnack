import {
  formatDateKey,
  parseDateKey,
  startOfDay,
  dateTime,
  getAvailableSetDates,
  findCurrentSetDate,
  findAdjacentSetDate,
  formatElapsed,
  getDateFromHash,
  setDateInHash,
} from "./dates"

describe("formatDateKey", () => {
  it("formats a date as M/D/YYYY", () => {
    expect(formatDateKey(new Date(2024, 0, 5))).toBe("1/5/2024")
    expect(formatDateKey(new Date(2024, 11, 25))).toBe("12/25/2024")
  })
})

describe("parseDateKey", () => {
  it("parses a M/D/YYYY string", () => {
    const parsed = parseDateKey("1/5/2024")
    expect(parsed).not.toBeNull()
    expect(parsed?.getFullYear()).toBe(2024)
    expect(parsed?.getMonth()).toBe(0)
    expect(parsed?.getDate()).toBe(5)
  })

  it("returns null for malformed input", () => {
    expect(parseDateKey("1/2")).toBeNull()
    expect(parseDateKey("not-a-date")).toBeNull()
    expect(parseDateKey("a/b/c")).toBeNull()
  })
})

describe("startOfDay / dateTime", () => {
  it("strips the time component", () => {
    const start = startOfDay(new Date(2024, 5, 15, 13, 45, 30))
    expect(start.getHours()).toBe(0)
    expect(start.getMinutes()).toBe(0)
    expect(start.getSeconds()).toBe(0)
  })

  it("dateTime equals the timestamp of the start of day", () => {
    const date = new Date(2024, 5, 15, 13, 45, 30)
    expect(dateTime(date)).toBe(startOfDay(date).getTime())
  })
})

describe("getAvailableSetDates", () => {
  it("dedupes and sorts dates ascending, ignoring invalid rows", () => {
    const result = getAvailableSetDates([
      { date: "1/2/2024" },
      { date: "1/1/2024" },
      { date: "1/2/2024" },
      { date: "bad" },
    ])
    expect(result.map(formatDateKey)).toEqual(["1/1/2024", "1/2/2024"])
  })
})

describe("findCurrentSetDate", () => {
  const dates = [
    new Date(2024, 0, 1),
    new Date(2024, 0, 5),
    new Date(2024, 0, 10),
  ]

  it("returns the latest date on or before today", () => {
    const current = findCurrentSetDate(dates, new Date(2024, 0, 7))
    expect(formatDateKey(current as Date)).toBe("1/5/2024")
  })

  it("returns null when today precedes all dates", () => {
    expect(findCurrentSetDate(dates, new Date(2023, 11, 31))).toBeNull()
  })
})

describe("findAdjacentSetDate", () => {
  const dates = [
    new Date(2024, 0, 1),
    new Date(2024, 0, 5),
    new Date(2024, 0, 10),
  ]

  it("finds the next date", () => {
    const next = findAdjacentSetDate(dates, new Date(2024, 0, 5), 1)
    expect(formatDateKey(next as Date)).toBe("1/10/2024")
  })

  it("finds the previous date", () => {
    const prev = findAdjacentSetDate(dates, new Date(2024, 0, 5), -1)
    expect(formatDateKey(prev as Date)).toBe("1/1/2024")
  })

  it("returns null when there is no adjacent date", () => {
    expect(findAdjacentSetDate(dates, new Date(2024, 0, 10), 1)).toBeNull()
    expect(findAdjacentSetDate(dates, new Date(2024, 0, 1), -1)).toBeNull()
  })
})

describe("formatElapsed", () => {
  it("formats milliseconds as MM:SS", () => {
    expect(formatElapsed(0)).toBe("00:00")
    expect(formatElapsed(65000)).toBe("01:05")
    expect(formatElapsed(3600000)).toBe("60:00")
  })
})

describe("getDateFromHash", () => {
  it("reads a date from the location hash", () => {
    window.location.hash = "#/demo?date=1-5-2024"
    const parsed = getDateFromHash()
    expect(parsed).not.toBeNull()
    expect(formatDateKey(parsed as Date)).toBe("1/5/2024")
  })

  it("returns null when no date is present", () => {
    window.location.hash = "#/demo"
    expect(getDateFromHash()).toBeNull()
  })
})

describe("setDateInHash", () => {
  it("writes the date into the location hash with dashes", () => {
    setDateInHash(new Date(2024, 0, 5))
    expect(window.location.hash).toBe("#/demo?date=1-5-2024")
  })

  it("round-trips through getDateFromHash", () => {
    setDateInHash(new Date(2024, 11, 25))
    expect(formatDateKey(getDateFromHash() as Date)).toBe("12/25/2024")
  })
})
