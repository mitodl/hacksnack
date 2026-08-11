import React from "react"
import { HintIcon, CheckIcon } from "./icons"
import {
  TokenTitleRow,
  PuzzleRowNumber,
  TokenCounter,
  TokenLabel,
  HintButton,
} from "../styled"

// A puzzle row's header: its position as a numbered badge, then the puzzle type
// and which code word it unlocks, then the hint toggle.
export function TokenTitle({
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
}) {
  // Once a puzzle is solved there's nothing left to hint at, so hide the button.
  const hasHint = !isSolved && (!!hint?.trim() || !!forceHintButton)
  return (
    <TokenTitleRow>
      <PuzzleRowNumber
        $solved={isSolved}
        {...(isSolved
          ? { role: "img", "aria-label": "Solved" }
          : { "aria-hidden": true })}
      >
        {isSolved ? <CheckIcon /> : stepIndex + 1}
      </PuzzleRowNumber>
      <TokenCounter>
        <TokenLabel>{label}</TokenLabel>
        {` • Code word ${stepIndex + 1} of ${totalSteps}`}
      </TokenCounter>
      {hasHint && (
        <HintButton
          type="button"
          onClick={onToggleHint}
          title={hintDescription}
          aria-label={`${hintShown ? "Hide" : "Show"} the ${label} hint`}
        >
          <HintIcon />
          {hintShown ? "Hide hint" : hintButtonLabel || "Hint"}
        </HintButton>
      )}
    </TokenTitleRow>
  )
}
