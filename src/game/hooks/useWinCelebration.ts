import { useEffect, useRef, useState } from "react"
import React from "react"

// Long enough for the last confetti piece to fall out of view: the pieces are
// given up to 850ms of delay and 5600ms of travel by the game.
const CONFETTI_DURATION = 6500

// Runs the end-of-puzzle celebration: confetti, from the moment the last clue is
// solved until the last piece has fallen. Nothing gates the reveal of today's
// MIT connection — that appears with the confetti, not after it.
export function useWinCelebration({ allSolved }: { allSolved: boolean }) {
  const [isCelebrating, setIsCelebrating] = useState(false)
  const celebrationTimerRef = useRef<number | null>(null)
  const prevAllSolvedRef = useRef(false)

  // Tear down the celebration immediately (used by the game's resetAll). The
  // `allSolved` effect performs the same cleanup when the puzzle is no longer
  // solved, but resetAll needs it to happen synchronously.
  const resetCelebration = React.useCallback(() => {
    setIsCelebrating(false)
    if (celebrationTimerRef.current !== null) {
      window.clearTimeout(celebrationTimerRef.current)
      celebrationTimerRef.current = null
    }
    prevAllSolvedRef.current = false
  }, [])

  useEffect(() => {
    if (!allSolved) {
      resetCelebration()
      return
    }

    const justSolved = !prevAllSolvedRef.current && allSolved
    prevAllSolvedRef.current = allSolved
    if (!justSolved) return

    setIsCelebrating(true)
    if (celebrationTimerRef.current !== null) {
      window.clearTimeout(celebrationTimerRef.current)
    }
    celebrationTimerRef.current = window.setTimeout(() => {
      setIsCelebrating(false)
      celebrationTimerRef.current = null
    }, CONFETTI_DURATION)
  }, [allSolved, resetCelebration])

  useEffect(
    () => () => {
      if (celebrationTimerRef.current !== null) {
        window.clearTimeout(celebrationTimerRef.current)
      }
    },
    [],
  )

  return { isCelebrating, resetCelebration }
}
