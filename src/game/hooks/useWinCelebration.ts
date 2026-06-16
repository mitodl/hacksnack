import React, { useEffect, useRef, useState } from "react"

type WinOverlayLayout = {
  top: number
  left: number
  width: number
  maxHeight: number
}

type TimPath = {
  startX: number
  startY: number
  midX: number
  midY: number
  endX: number
  endY: number
}

// Orchestrates the end-of-puzzle celebration: the responsively-positioned win
// summary overlay, and "Tim" flying across the screen before the fun fact is
// revealed. Driven by whether every puzzle is solved (`allSolved`) and whether
// there is a fun fact to show (`hasFunFact`).
export function useWinCelebration({
  allSolved,
  hasFunFact,
}: {
  allSolved: boolean
  hasFunFact: boolean
}) {
  const [isCelebrating, setIsCelebrating] = useState(false)
  const [showFunFact, setShowFunFact] = useState(false)
  const [showWinOverlay, setShowWinOverlay] = useState(false)
  const [lockWinOverlayLayout, setLockWinOverlayLayout] = useState(false)
  const [winOverlayLayout, setWinOverlayLayout] =
    useState<WinOverlayLayout | null>(null)
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
  const winSummaryAreaRef = useRef<HTMLDivElement | null>(null)

  const updateWinOverlayLayout = React.useCallback(() => {
    const area = winSummaryAreaRef.current
    if (!area || typeof window === "undefined") return null
    const rect = area.getBoundingClientRect()
    const isDesktop = window.innerWidth >= 1024
    const gap = 16
    const rawWidth = isDesktop ? ((rect.width - gap) / 2) * 1.5 : rect.width
    const maxWidth = Math.max(280, window.innerWidth - 32)
    const width = Math.min(Math.max(rawWidth, 280), maxWidth)
    const unclampedLeft = isDesktop
      ? (window.innerWidth - width) / 2
      : rect.left
    const left = Math.min(
      Math.max(16, unclampedLeft),
      window.innerWidth - width - 16,
    )
    const top = isDesktop ? 100 : Math.max(16, rect.top - 72)
    const maxHeight = Math.max(320, window.innerHeight - top - 24)
    const next = { top, left, width, maxHeight }
    setWinOverlayLayout(next)
    return next
  }, [])

  // Tear down the celebration immediately (used by the game's resetAll). The
  // `allSolved` effect performs the same cleanup when the puzzle is no longer
  // solved, but resetAll needs it to happen synchronously.
  const resetCelebration = React.useCallback(() => {
    setIsCelebrating(false)
    setShowFunFact(false)
    setShowWinOverlay(false)
    setLockWinOverlayLayout(false)
    setWinOverlayLayout(null)
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
    setLockWinOverlayLayout(true)
    updateWinOverlayLayout()
    setShowWinOverlay(true)
    if (!hasFunFact) {
      setShowFunFact(true)
      return
    }

    let raf: number | null = null
    let attempts = 0
    const startTimAnimation = () => {
      const anchor = funFactAnchorRef.current?.getBoundingClientRect()
      if (!anchor && attempts < 8) {
        attempts += 1
        raf = window.requestAnimationFrame(startTimAnimation)
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
        setLockWinOverlayLayout(false)
        celebrationTimerRef.current = null
      }, 4200)
    }
    raf = window.requestAnimationFrame(startTimAnimation)

    return () => {
      if (raf !== null) window.cancelAnimationFrame(raf)
    }
  }, [allSolved, hasFunFact, updateWinOverlayLayout, resetCelebration])

  useEffect(
    () => () => {
      if (celebrationTimerRef.current !== null) {
        window.clearTimeout(celebrationTimerRef.current)
      }
    },
    [],
  )

  useEffect(() => {
    if (!showWinOverlay) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowWinOverlay(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showWinOverlay])

  useEffect(() => {
    if (!showWinOverlay || lockWinOverlayLayout) return
    const handleLayout = () => {
      updateWinOverlayLayout()
    }
    handleLayout()
    window.addEventListener("resize", handleLayout)
    window.addEventListener("scroll", handleLayout, true)
    return () => {
      window.removeEventListener("resize", handleLayout)
      window.removeEventListener("scroll", handleLayout, true)
    }
  }, [showWinOverlay, lockWinOverlayLayout, updateWinOverlayLayout])

  return {
    isCelebrating,
    timPath,
    showWinOverlay,
    setShowWinOverlay,
    showFunFact,
    winOverlayLayout,
    updateWinOverlayLayout,
    funFactAnchorRef,
    winSummaryAreaRef,
    resetCelebration,
  }
}
