import { useEffect, useState } from "react"
import { fetchPuzzlePickerRows } from "../lib/gameData"
import type { PuzzleDay } from "../lib/gameData"

// Fetches the daily puzzle list once per asset base path. Returns the parsed
// rows plus a loading flag while the request is in flight.
export function usePuzzlePickerRows(assetBasePath: string) {
  const [pickerRows, setPickerRows] = useState<PuzzleDay[]>([])
  const [pickerLoading, setPickerLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const loadPicker = async () => {
      setPickerLoading(true)
      const rows = await fetchPuzzlePickerRows(assetBasePath)
      if (!cancelled) {
        setPickerRows(rows)
        setPickerLoading(false)
      }
    }
    loadPicker()
    return () => {
      cancelled = true
    }
  }, [assetBasePath])

  return { pickerRows, pickerLoading }
}
