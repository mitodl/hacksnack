import { describe, it, expect } from "vitest"
import { tokenizeRebus } from "./rebus"

const shape = (prompt: string) =>
  tokenizeRebus(prompt).map((t) => `${t.isEmoji ? "e" : "t"}:${t.text}`)

describe("tokenizeRebus", () => {
  it("splits spaced pictures and operators", () => {
    expect(shape("👀 + 🦌 - R")).toEqual(["e:👀", "t:+", "e:🦌", "t:-", "t:R"])
  })

  it("splits operators that touch their letters", () => {
    expect(shape("N+🗝️")).toEqual(["t:N", "t:+", "e:🗝️"])
  })

  it("keeps adjacent pictures in one token", () => {
    expect(shape("L+👁️+🐜🐜🐜")).toEqual([
      "t:L",
      "t:+",
      "e:👁️",
      "t:+",
      "e:🐜🐜🐜",
    ])
  })

  it("treats non-pictographic symbols as text", () => {
    expect(shape("π + 🐈🐕")).toEqual(["t:π", "t:+", "e:🐈🐕"])
  })

  it("collapses runs of whitespace", () => {
    expect(shape("🖥️   ⛑️+ ed   De +🪧")).toEqual([
      "e:🖥️",
      "e:⛑️",
      "t:+",
      "t:ed",
      "t:De",
      "t:+",
      "e:🪧",
    ])
  })

  it("returns nothing for an empty clue", () => {
    expect(tokenizeRebus("")).toEqual([])
  })
})
