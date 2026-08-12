// Rebus clues arrive as a single string mixing pictures with the operators and
// letters that combine them, e.g. "👀 + 🦌 - R" or "L+👁️+🐜🐜🐜". The board
// renders the pictures larger than the operators, so the clue is split into
// tokens first.

export type RebusToken = { text: string; isEmoji: boolean }

// A run of adjacent pictographs, keeping ZWJ sequences, skin-tone modifiers and
// variation selectors together. Adjacent pictures stay in one token so a clue
// like "🐜🐜🐜" reads as a group rather than three spaced-out pictures.
const EMOJI_RUN =
  /(?:\p{Extended_Pictographic}(?:\uFE0F|\u200D|\p{Emoji_Modifier})*)+/gu

// Operators are split off from surrounding letters so "L+" renders as the two
// tokens the design spaces apart.
const OPERATOR = /([+\-−–—=×÷*/·])/

export function tokenizeRebus(prompt: string): RebusToken[] {
  const tokens: RebusToken[] = []

  const pushText = (text: string) => {
    for (const word of text.split(/\s+/)) {
      if (!word) continue
      for (const part of word.split(OPERATOR)) {
        if (part) tokens.push({ text: part, isEmoji: false })
      }
    }
  }

  let cursor = 0
  for (const match of prompt.matchAll(EMOJI_RUN)) {
    const start = match.index ?? 0
    if (start > cursor) pushText(prompt.slice(cursor, start))
    tokens.push({ text: match[0], isEmoji: true })
    cursor = start + match[0].length
  }
  if (cursor < prompt.length) pushText(prompt.slice(cursor))

  return tokens
}
