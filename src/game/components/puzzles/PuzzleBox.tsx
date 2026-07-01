import React from "react"
import { TokenTitle } from "../TokenTitle"
import { PuzzleCard } from "../../styled"

// Shared chrome for every puzzle: the card surface plus the TokenTitle header.
// The body of each puzzle is passed as children.
export function PuzzleBox({
  label,
  stepIndex,
  totalSteps,
  hint,
  hintShown,
  onToggleHint,
  forceHintButton,
  hintButtonLabel,
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
  isSolved?: boolean
  children: React.ReactNode
}) {
  return (
    <PuzzleCard>
      <TokenTitle
        label={label}
        stepIndex={stepIndex}
        totalSteps={totalSteps}
        hint={hint}
        hintShown={hintShown}
        onToggleHint={onToggleHint}
        forceHintButton={forceHintButton}
        hintButtonLabel={hintButtonLabel}
        isSolved={isSolved}
      />
      {children}
    </PuzzleCard>
  )
}
