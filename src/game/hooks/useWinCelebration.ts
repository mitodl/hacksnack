import { useEffect, useRef, useState } from "react"
import React from "react"

type TimPath = {
  startX: number
  startY: number
  midX: number
  midY: number
  endX: number
  endY: number
}

// How long to wait between attempts to measure where Tim should land, and how
// many times to try before flying to a sensible default.
const MEASURE_RETRY_MS = 16
const MEASURE_ATTEMPTS = 8

// Orchestrates the end-of-puzzle celebration: "Tim" flies across the screen and
// lands on the revealed MIT connection, which is held back until he gets there.
// Driven by whether every puzzle is solved (`allSolved`) and whether there is a
// connection to reveal (`hasFunFact`).
export function useWinCelebration({
  allSolved,
  hasFunFact,
}: {
  allSolved: boolean
  hasFunFact: boolean
}) {
  const [isCelebrating, setIsCelebrating] = useState(false)
  const [showFunFact, setShowFunFact] = useState(false)
  const [timPath, setTimPath] = useState<TimPath>({
    startX: -120,
    startY: 220,
    midX: 300,
    midY: 240,
    endX: 500,
    endY: 320,
  })
  const celebrationTimerRef = useRef<number | null>(null)
  const prevAllSolvedRef = useRef(false)
  const funFactAnchorRef = useRef<HTMLDivElement | null>(null)

  // Tear down the celebration immediately (used by the game's resetAll). The
  // `allSolved` effect performs the same cleanup when the puzzle is no longer
  // solved, but resetAll needs it to happen synchronously.
  const resetCelebration = React.useCallback(() => {
    setIsCelebrating(false)
    setShowFunFact(false)
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
    if (!hasFunFact) {
      setShowFunFact(true)
      return
    }

    // Timers rather than requestAnimationFrame: the reveal is the payoff for
    // solving the puzzle, and an rAF callback can be deferred indefinitely when
    // the page isn't producing frames — which would strand the player on a
    // solved board with nothing revealed.
    let measureTimer: number | null = null
    let attempts = 0
    const startTimAnimation = () => {
      measureTimer = null
      const anchor = funFactAnchorRef.current?.getBoundingClientRect()
      if (!anchor && attempts < MEASURE_ATTEMPTS) {
        attempts += 1
        measureTimer = window.setTimeout(startTimAnimation, MEASURE_RETRY_MS)
        return
      }

      const endX = Math.round(anchor?.left ?? window.innerWidth * 0.55)
      const endY = Math.round(anchor?.top ?? window.innerHeight * 0.28)
      const midX = Math.round(window.innerWidth * 0.45)
      const midY = Math.max(140, Math.round(endY + 140))
      const startX = -120
      const startY = Math.max(150, Math.round(endY + 120))

      setTimPath({ startX, startY, midX, midY, endX, endY })
      setShowFunFact(false)
      setIsCelebrating(true)

      if (celebrationTimerRef.current !== null) {
        window.clearTimeout(celebrationTimerRef.current)
      }
      celebrationTimerRef.current = window.setTimeout(() => {
        setIsCelebrating(false)
        setShowFunFact(true)
        celebrationTimerRef.current = null
      }, 4200)
    }
    startTimAnimation()

    return () => {
      if (measureTimer !== null) window.clearTimeout(measureTimer)
    }
  }, [allSolved, hasFunFact, resetCelebration])

  useEffect(
    () => () => {
      if (celebrationTimerRef.current !== null) {
        window.clearTimeout(celebrationTimerRef.current)
      }
    },
    [],
  )

  return {
    isCelebrating,
    timPath,
    showFunFact,
    funFactAnchorRef,
    resetCelebration,
  }
}
