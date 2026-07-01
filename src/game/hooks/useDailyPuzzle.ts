import { useEffect, useMemo, useState } from "react"
import type { PuzzleDay } from "../lib/gameData"
import { hasPickerData } from "../lib/gameData"
import { parseDateKey, dateTime } from "../lib/dates"
import type {
  GroupKey,
  RiddleType,
  EmojiType,
  ScrambleType,
  EquationType,
  MapCoordType,
  SymbolInputTask,
  ImagePuzzle,
} from "../types"

// The image puzzle scrambles a single picture into a fixed tile grid.
const IMAGE_PUZZLE_COLS = 4
const IMAGE_PUZZLE_ROWS = 3

// Selects the puzzle row for the active date and derives the typed puzzle
// objects, the ordered list of active groups, and per-group hints the game
// renders. When no picker row applies, activeGroups is empty and every typed
// puzzle is null, so the game shows its "no puzzles" state.
export function useDailyPuzzle({
  asset,
  pickerRows,
  pickerLoading,
  selectedDate,
  currentSetDate,
  todayMidnight,
  onPuzzleChange,
}: {
  asset: (fileName: string) => string
  pickerRows: PuzzleDay[]
  pickerLoading: boolean
  selectedDate: Date
  currentSetDate: Date | null
  todayMidnight: Date
  onPuzzleChange: () => void
}) {
  const [pickerRow, setPickerRow] = useState<PuzzleDay | null>(null)
  const [noPuzzlesToday, setNoPuzzlesToday] = useState(false)

  useEffect(() => {
    const rowDate =
      currentSetDate && dateTime(selectedDate) > dateTime(todayMidnight)
        ? currentSetDate
        : selectedDate
    const selectedTime = dateTime(rowDate)
    const picked =
      pickerRows.find((row) => {
        const parsed = row.date ? parseDateKey(row.date) : null
        return parsed ? dateTime(parsed) === selectedTime : false
      }) || null
    const emptyToday = !picked || !hasPickerData(picked)
    setPickerRow(picked)
    setNoPuzzlesToday(emptyToday)
    onPuzzleChange()
  }, [currentSetDate, pickerRows, selectedDate, todayMidnight, onPuzzleChange])

  const hasPickerClues = hasPickerData(pickerRow)
  const usePicker =
    !pickerLoading && !!pickerRow && !noPuzzlesToday && hasPickerClues

  const activeGroups = useMemo<GroupKey[]>(() => {
    const p = pickerRow?.puzzles
    if (!usePicker || !p) return []
    const groups: GroupKey[] = []
    if (p.rebus?.clue && p.rebus?.answer) groups.push("emoji")
    if (p.scramble?.clue && p.scramble?.answer) groups.push("scramble")
    if (p.riddle?.clue && p.riddle?.answer) groups.push("riddle")
    if (p.mapCoord?.clue && p.mapCoord?.answer) groups.push("map")
    if (p.symbol?.clue && p.symbol?.answer) groups.push("symbol")
    if (p.equation?.clue && p.equation?.answer) groups.push("equation")
    if (p.image?.clue && p.image?.answer) groups.push("image")
    return groups
  }, [usePicker, pickerRow])

  // Typed puzzle objects derived from the active picker row. Each is null
  // unless its clue/answer pair is present in the row.
  const pickerRiddle = useMemo<RiddleType | null>(() => {
    const r = pickerRow?.puzzles?.riddle
    if (!usePicker || !r?.clue || !r.answer) return null
    return { q: r.clue, a: [r.answer.toLowerCase()], word: r.answer }
  }, [usePicker, pickerRow])
  const pickerEmoji = useMemo<EmojiType | null>(() => {
    const e = pickerRow?.puzzles?.rebus
    if (!usePicker || !e?.clue || !e.answer) return null
    return { prompt: e.clue, answer: e.answer }
  }, [usePicker, pickerRow])
  const pickerScramble = useMemo<ScrambleType | null>(() => {
    const s = pickerRow?.puzzles?.scramble
    if (!usePicker || !s?.clue || !s.answer) return null
    const spaced = s.clue.toUpperCase().split("").join(" ")
    return { scrambled: spaced, answer: s.answer }
  }, [usePicker, pickerRow])
  const pickerSymbol = useMemo<SymbolInputTask | null>(() => {
    const s = pickerRow?.puzzles?.symbol
    if (!usePicker || !s?.clue || !s.answer) return null
    return { prompt: s.clue, answer: s.answer }
  }, [usePicker, pickerRow])
  const pickerEquation = useMemo<EquationType | null>(() => {
    const eq = pickerRow?.puzzles?.equation
    if (!usePicker || !eq?.clue || !eq.answer) return null
    // The game expects the equation clue to end with an "=" sign.
    return { clue: `${eq.clue}=`, answer: eq.answer }
  }, [usePicker, pickerRow])
  const pickerMapCoord = useMemo<MapCoordType | null>(() => {
    const m = pickerRow?.puzzles?.mapCoord
    if (!usePicker || !m?.clue || !m.answer) return null
    return { clue: m.clue, answer: m.answer }
  }, [usePicker, pickerRow])
  const pickerImage = useMemo<ImagePuzzle | null>(() => {
    const img = pickerRow?.puzzles?.image
    if (!usePicker || !img?.clue) return null
    return {
      src: asset(img.clue),
      cols: IMAGE_PUZZLE_COLS,
      rows: IMAGE_PUZZLE_ROWS,
      word: img.answer,
    }
  }, [usePicker, pickerRow, asset])

  const activeRiddle = pickerRiddle
  const activeEmoji = pickerEmoji
  const activeScramble = pickerScramble
  const activeImagePuzzle = pickerImage
  const activeHints = useMemo<Partial<Record<GroupKey, string>>>(() => {
    const p = pickerRow?.puzzles
    if (!usePicker || !p) return {}
    return {
      riddle: p.riddle?.hint,
      emoji: p.rebus?.hint,
      scramble: p.scramble?.hint,
      map: p.mapCoord?.hint,
      symbol: p.symbol?.hint,
      equation: p.equation?.hint,
      image: p.image?.hint,
    }
  }, [usePicker, pickerRow])

  return {
    pickerRow,
    noPuzzlesToday,
    activeGroups,
    activeRiddle,
    activeEmoji,
    activeScramble,
    activeImagePuzzle,
    pickerEquation,
    pickerMapCoord,
    pickerSymbol,
    activeHints,
  }
}
