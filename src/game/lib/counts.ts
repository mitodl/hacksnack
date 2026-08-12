// The board's copy spells out how many clues are in play ("Three clues. One
// hidden code."). A day normally has three, but the puzzle set decides, so the
// count is spelled out from the data rather than hard-coded.

const WORDS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
]

export const countWord = (n: number) => WORDS[n] ?? String(n)

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export const plural = (n: number, singular: string, suffix = "s") =>
  n === 1 ? singular : `${singular}${suffix}`
