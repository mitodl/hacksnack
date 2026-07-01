import { useEffect, useMemo, useRef, useState } from "react"
import type { PuzzleDay } from "../lib/gameData"
import {
  startOfDay,
  dateTime,
  getAvailableSetDates,
  findCurrentSetDate,
  findAdjacentSetDate,
  getDateFromHash,
  setDateInHash,
} from "../lib/dates"

// Owns the selected puzzle-set date and the navigation between available sets.
// Seeds from the URL hash, snaps to the current set on first load, redirects
// away from future dates, and keeps the hash in sync. `onResetGame` is invoked
// whenever the player moves to a different set so game progress is cleared.
export function useDateSet({
  pickerRows,
  pickerLoading,
  todayMidnight,
  onResetGame,
}: {
  pickerRows: PuzzleDay[]
  pickerLoading: boolean
  todayMidnight: Date
  onResetGame: () => void
}) {
  const [selectedDate, setSelectedDate] = useState<Date>(() =>
    startOfDay(new Date()),
  )
  const didSetInitialCurrentDateRef = useRef(false)

  useEffect(() => {
    const onHashChange = () => {
      const fromHash = getDateFromHash()
      if (fromHash) setSelectedDate(fromHash)
    }
    onHashChange() // sync on mount
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  const availableSetDates = useMemo(
    () => getAvailableSetDates(pickerRows),
    [pickerRows],
  )
  const currentSetDate = useMemo(
    () => findCurrentSetDate(availableSetDates, todayMidnight),
    [availableSetDates, todayMidnight],
  )

  useEffect(() => {
    if (
      pickerLoading ||
      didSetInitialCurrentDateRef.current ||
      getDateFromHash() ||
      !currentSetDate
    )
      return
    didSetInitialCurrentDateRef.current = true
    if (dateTime(selectedDate) !== dateTime(currentSetDate)) {
      setSelectedDate(currentSetDate)
      setDateInHash(currentSetDate)
    }
  }, [currentSetDate, pickerLoading, selectedDate])

  useEffect(() => {
    if (
      pickerLoading ||
      !currentSetDate ||
      dateTime(selectedDate) <= dateTime(todayMidnight)
    )
      return
    onResetGame()
    setSelectedDate(currentSetDate)
    setDateInHash(currentSetDate)
  }, [currentSetDate, pickerLoading, selectedDate, todayMidnight, onResetGame])

  const previousSetDate = useMemo(
    () => findAdjacentSetDate(availableSetDates, selectedDate, -1),
    [availableSetDates, selectedDate],
  )
  const nextSetDate = useMemo(
    () => findAdjacentSetDate(availableSetDates, selectedDate, 1),
    [availableSetDates, selectedDate],
  )
  const canGoNextSet =
    !!nextSetDate && dateTime(nextSetDate) <= dateTime(todayMidnight)

  const goToSetDate = (date: Date | null) => {
    if (!date) return
    onResetGame()
    setSelectedDate(date)
    setDateInHash(date)
  }
  const goPrevDay = () => {
    goToSetDate(previousSetDate)
  }
  const goNextDay = () => {
    if (!canGoNextSet) return
    goToSetDate(nextSetDate)
  }
  const goCurrentSet = () => {
    goToSetDate(currentSetDate)
  }

  return {
    selectedDate,
    currentSetDate,
    previousSetDate,
    nextSetDate,
    canGoNextSet,
    goPrevDay,
    goNextDay,
    goCurrentSet,
  }
}
