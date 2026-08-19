import { hasPickerData } from "./gameData"

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
