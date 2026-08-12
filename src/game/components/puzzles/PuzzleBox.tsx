import React from "react"
import { TokenTitle } from "../TokenTitle"
import { PuzzleCard, PuzzleRowContent } from "../../styled"

// Shared chrome for every puzzle: the row surface, its header, and below it the
// clue and answer field passed as children.
export function PuzzleBox({
  label,
  stepIndex,
  totalSteps,
  hint,
  hintShown,
  onToggleHint,
  forceHintButton,
  hintButtonLabel,
  hintDescription,
  isSolved,
  children,
}: {
  label: string
  stepIndex: number
  totalSteps: number
  hint?: string
  hintShown?: boolean
  onToggleHint?: () => void
  forceHintButton?: boolean
  hintButtonLabel?: string
  hintDescription?: string
  isSolved?: boolean
  children: React.ReactNode
}) {
  return (
    <PuzzleCard $solved={isSolved}>
      <TokenTitle
        label={label}
        stepIndex={stepIndex}
        totalSteps={totalSteps}
        hint={hint}
        hintShown={hintShown}
        onToggleHint={onToggleHint}
        forceHintButton={forceHintButton}
        hintButtonLabel={hintButtonLabel}
        hintDescription={hintDescription}
        isSolved={isSolved}
      />
      <PuzzleRowContent>{children}</PuzzleRowContent>
    </PuzzleCard>
  )
}
