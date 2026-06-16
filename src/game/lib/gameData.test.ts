import { parseCsvRows, hasPickerData } from "./gameData"

describe("parseCsvRows", () => {
  it("parses simple rows", () => {
    expect(parseCsvRows("a,b,c\n1,2,3")).toEqual([
      ["a", "b", "c"],
      ["1", "2", "3"],
    ])
  })

  it("handles quoted fields containing commas", () => {
    expect(parseCsvRows('"a,b",c')).toEqual([["a,b", "c"]])
  })

  it("handles escaped double quotes", () => {
    expect(parseCsvRows('"she said ""hi""",x')).toEqual([
      ['she said "hi"', "x"],
    ])
  })

  it("handles CRLF line endings", () => {
    expect(parseCsvRows("a,b\r\n1,2")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ])
  })

  it("skips fully blank lines", () => {
    expect(parseCsvRows("a,b\n\n1,2")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ])
  })

  it("strips a leading UTF-8 BOM", () => {
    expect(parseCsvRows("﻿a,b\n1,2")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ])
  })
})

describe("hasPickerData", () => {
  it("returns false for null", () => {
    expect(hasPickerData(null)).toBe(false)
  })

  it("returns false for an empty day", () => {
    expect(hasPickerData({})).toBe(false)
    expect(hasPickerData({ puzzles: {} })).toBe(false)
  })

  it("returns true when a puzzle clue/answer pair is present", () => {
    expect(
      hasPickerData({ puzzles: { riddle: { clue: "q", answer: "a" } } }),
    ).toBe(true)
  })

  it("returns false when only a clue is present without an answer", () => {
    expect(hasPickerData({ puzzles: { riddle: { clue: "q" } } })).toBe(false)
  })
})
