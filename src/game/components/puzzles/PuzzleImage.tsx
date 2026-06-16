import React from "react"
import { PuzzleBox } from "./PuzzleBox"
import { useImagePuzzle } from "./useImagePuzzle"
import {
  SmallPrompt,
  ImageSolvedFrame,
  ImageSolvedInner,
  PuzzleGrid,
  PuzzleSlot,
  PuzzleTile,
} from "../../styled"
import type { ImagePuzzle, PuzzleShellProps } from "../../types"

export function PuzzleImage({
  puzzle,
  onSolved,
  stepIndex,
  totalSteps,
  isSolved,
  hint,
  hintShown,
  onToggleHint,
}: { puzzle: ImagePuzzle; onSolved: () => void } & PuzzleShellProps) {
  const {
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
  } = useImagePuzzle({ puzzle, isSolved, hintShown, onToggleHint, onSolved })

  return (
    <PuzzleBox
      label="Image"
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      hint={hint}
      hintShown={hintShown}
      onToggleHint={handleHintToggle}
      forceHintButton
      hintButtonLabel="Get a hint (orient all tiles the right way)"
      isSolved={solved || isSolved}
    >
      {solved || isSolved ? (
        <ImageSolvedFrame
          style={{
            aspectRatio: `${puzzle.cols} / ${puzzle.rows}`,
            maxWidth: "520px",
          }}
        >
          <ImageSolvedInner
            style={{
              backgroundImage: `url(${puzzle.src})`,
              backgroundSize: "100% 100%",
              backgroundPosition: "center",
            }}
          />
        </ImageSolvedFrame>
      ) : (
        <>
          <SmallPrompt>
            Tap/right-click to rotate tiles, and drag them to their correct
            places on the grid. Using a keyboard, Tab to a tile, then press Enter
            or Space to pick it up and again on another tile to swap them, or R
            to rotate.
          </SmallPrompt>
          <PuzzleGrid
            ref={containerRef}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            style={{
              gridTemplateColumns: `repeat(${puzzle.cols}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${puzzle.rows}, minmax(0, 1fr))`,
              aspectRatio: `${puzzle.cols} / ${puzzle.rows}`,
              maxWidth: "520px",
            }}
          >
            {slots.map((tile, slotIndex) => (
              <PuzzleSlot key={slotIndex}>
                {tile && (
                  <PuzzleTile
                    draggable
                    $selected={selectedId === tile.id}
                    tabIndex={0}
                    role="button"
                    aria-pressed={selectedId === tile.id}
                    aria-label={`Image tile ${tile.id + 1}${
                      selectedId === tile.id ? ", selected" : ""
                    }`}
                    onDragStart={(e) => handleDragStart(tile.id, e)}
                    onDoubleClick={() => handleRotate(tile.id)}
                    onTouchEnd={() => handleRotate(tile.id)}
                    onContextMenu={(e) => {
                      e.preventDefault()
                      handleRotate(tile.id)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        handleSelect(tile.id)
                      } else if (e.key === "r" || e.key === "R") {
                        e.preventDefault()
                        handleRotate(tile.id)
                      }
                    }}
                    style={{
                      backgroundImage: `url(${puzzle.src})`,
                      backgroundSize: `${puzzle.cols * 100}% ${puzzle.rows * 100}%`,
                      backgroundPosition: getBackgroundPosition(tile.id),
                      transform: `rotate(${tile.rotation}deg)`,
                    }}
                  />
                )}
              </PuzzleSlot>
            ))}
          </PuzzleGrid>
        </>
      )}
    </PuzzleBox>
  )
}
