// Shared types for the game and its puzzle components.

export type GroupKey =
  | "riddle"
  | "emoji"
  | "scramble"
  | "symbol"
  | "image"
  | "equation"
  | "map"

export type RiddleType = { q: string; a: string[]; word: string }
export type EmojiType = { prompt: string; answer: string }
export type ScrambleType = { scrambled: string; answer: string }
export type EquationType = { clue: string; answer: string }
export type MapCoordType = { clue: string; answer: string }
export type SymbolInputTask = { prompt: string; answer: string }
export type ImagePuzzle = {
  src: string
  word?: string
  cols: number
  rows: number
}
export type ImageTile = { id: number; slot: number; rotation: number }

// ---- Puzzle component props ----

// Header / sequence-position / hint controls shared by every puzzle component.
// (stepIndex/totalSteps are the puzzle's position in the day's sequence.)
export type PuzzleShellProps = {
  stepIndex: number
  totalSteps: number
  isSolved: boolean
  hint?: string
  hintShown?: boolean
  onToggleHint?: () => void
}

// Adds the free-text answer contract used by the text puzzles and the map.
export type TextPuzzleProps = PuzzleShellProps & {
  input: string
  setInput: (v: string) => void
  onSubmit: () => void
  message: string
}
