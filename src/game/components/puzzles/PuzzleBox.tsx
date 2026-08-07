import React from "react"
import { TokenTitle } from "../TokenTitle"
import { CheckCircleIcon } from "../icons"
import { PuzzleCard, PuzzleRowNumber, PuzzleRowContent } from "../../styled"

// Shared chrome for every puzzle: the numbered row surface plus the TokenTitle
// header. The clue and answer field of each puzzle are passed as children.
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
      <PuzzleRowNumber
        $solved={isSolved}
        {...(isSolved
          ? { role: "img", "aria-label": "Solved" }
          : { "aria-hidden": true })}
      >
        {isSolved ? <CheckCircleIcon /> : stepIndex + 1}
      </PuzzleRowNumber>
      <PuzzleRowContent>
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
        {children}
      </PuzzleRowContent>
    </PuzzleCard>
  )
}
