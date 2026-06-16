import React from "react"
import { sample, shuffleList } from "../../lib/strings"
import { TILE_ROTATIONS } from "../../data/puzzles"
import type { ImagePuzzle, ImageTile } from "../../types"

// The tile state machine behind PuzzleImage: shuffle/reshuffle, drag + swap,
// rotation, the orientation hint, and solved-detection (which fires onSolved
// shortly after the grid becomes correct). Kept separate from the rendering.
export function useImagePuzzle({
  puzzle,
  isSolved,
  hintShown,
  onToggleHint,
  onSolved,
}: {
  puzzle: ImagePuzzle
  isSolved: boolean
  hintShown?: boolean
  onToggleHint?: () => void
  onSolved: () => void
}) {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const tileCount = puzzle.cols * puzzle.rows
  const onSolvedRef = React.useRef(onSolved)

  const initTiles = React.useCallback(() => {
    const ids = Array.from({ length: tileCount }, (_, i) => i)
    let nextTiles: ImageTile[] = []
    do {
      const shuffledSlots = shuffleList(ids)
      nextTiles = ids.map((id) => ({
        id,
        slot: shuffledSlots[id],
        rotation: sample(TILE_ROTATIONS),
      }))
    } while (
      nextTiles.every(
        (tile) => tile.slot === tile.id && tile.rotation % 360 === 0,
      )
    )
    return nextTiles
  }, [tileCount])

  const [tiles, setTiles] = React.useState<ImageTile[]>(() => initTiles())
  const [dragId, setDragId] = React.useState<number | null>(null)
  const [selectedId, setSelectedId] = React.useState<number | null>(null)
  const [solved, setSolved] = React.useState(false)

  const handleHintToggle = React.useCallback(() => {
    const willShowHint = !hintShown
    if (willShowHint) {
      setTiles((prev) => prev.map((tile) => ({ ...tile, rotation: 0 })))
    } else {
      setTiles((prev) =>
        prev.map((tile) => ({ ...tile, rotation: sample(TILE_ROTATIONS) })),
      )
    }
    onToggleHint?.()
  }, [hintShown, onToggleHint])

  React.useEffect(() => {
    if (isSolved) return
    setTiles(initTiles())
    setSolved(false)
    setDragId(null)
    setSelectedId(null)
  }, [initTiles, puzzle.src, isSolved])

  React.useEffect(() => {
    if (!hintShown) return
    // Keep the orientation hint sticky when revisiting this puzzle.
    setTiles((prev) => prev.map((tile) => ({ ...tile, rotation: 0 })))
  }, [hintShown])

  React.useEffect(() => {
    onSolvedRef.current = onSolved
  }, [onSolved])

  const slots = React.useMemo(() => {
    const arr: Array<ImageTile | null> = Array.from(
      { length: tileCount },
      () => null,
    )
    tiles.forEach((tile) => {
      arr[tile.slot] = tile
    })
    return arr
  }, [tiles, tileCount])

  const getBackgroundPosition = (id: number) => {
    const col = id % puzzle.cols
    const row = Math.floor(id / puzzle.cols)
    const colPct = puzzle.cols === 1 ? 0 : (col / (puzzle.cols - 1)) * 100
    const rowPct = puzzle.rows === 1 ? 0 : (row / (puzzle.rows - 1)) * 100
    return `${colPct}% ${rowPct}%`
  }

  const getNearestSlot = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return null
    const cellW = rect.width / puzzle.cols
    const cellH = rect.height / puzzle.rows
    const col = Math.min(
      puzzle.cols - 1,
      Math.max(0, Math.round((clientX - rect.left - cellW / 2) / cellW)),
    )
    const row = Math.min(
      puzzle.rows - 1,
      Math.max(0, Math.round((clientY - rect.top - cellH / 2) / cellH)),
    )
    return row * puzzle.cols + col
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const data = event.dataTransfer.getData("text/plain")
    const fromId = dragId ?? (data ? Number(data) : NaN)
    if (!Number.isFinite(fromId)) return
    const slot = getNearestSlot(event.clientX, event.clientY)
    if (slot === null) return

    setTiles((prev) => {
      const next = prev.map((tile) => ({ ...tile }))
      const moving = next.find((tile) => tile.id === fromId)
      if (!moving) return prev
      const occupant = next.find((tile) => tile.slot === slot)
      if (occupant && occupant.id !== moving.id) {
        const temp = moving.slot
        moving.slot = occupant.slot
        occupant.slot = temp
      } else {
        moving.slot = slot
      }
      return next
    })
    setDragId(null)
    setSelectedId(null)
  }

  const handleDragStart = (
    id: number,
    event: React.DragEvent<HTMLDivElement>,
  ) => {
    setDragId(id)
    event.dataTransfer.setData("text/plain", String(id))
    event.dataTransfer.effectAllowed = "move"
  }

  const handleRotate = (id: number) => {
    setTiles((prev) =>
      prev.map((tile) =>
        tile.id === id
          ? { ...tile, rotation: (tile.rotation + 90) % 360 }
          : tile,
      ),
    )
  }

  // Keyboard-accessible alternative to dragging: activate one tile to pick it
  // up, then activate another to swap their positions (activating the same
  // tile again cancels the selection).
  const handleSelect = (id: number) => {
    if (selectedId === null || selectedId === id) {
      setSelectedId(selectedId === id ? null : id)
      return
    }
    setTiles((prev) => {
      const next = prev.map((tile) => ({ ...tile }))
      const first = next.find((tile) => tile.id === selectedId)
      const second = next.find((tile) => tile.id === id)
      if (first && second) {
        const temp = first.slot
        first.slot = second.slot
        second.slot = temp
      }
      return next
    })
    setSelectedId(null)
  }

  React.useEffect(() => {
    if (isSolved) return
    const allCorrect = tiles.every(
      (tile) => tile.slot === tile.id && tile.rotation % 360 === 0,
    )
    if (allCorrect && !solved) {
      setSolved(true)
    }
  }, [tiles, solved, isSolved])

  React.useEffect(() => {
    if (!solved) return
    const timer = window.setTimeout(() => {
      onSolvedRef.current()
    }, 500)
    return () => window.clearTimeout(timer)
  }, [solved])

  return {
    containerRef,
    slots,
    solved,
    selectedId,
    getBackgroundPosition,
    handleDrop,
    handleDragStart,
    handleRotate,
    handleSelect,
    handleHintToggle,
  }
}
