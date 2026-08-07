import React from "react"
import { HintIcon } from "./icons"
import {
  TokenTitleRow,
  TokenLabel,
  TokenSeparator,
  TokenCounter,
  HintButton,
} from "../styled"

// A puzzle row's header: the puzzle type, its position among the day's code
// words, and the hint toggle.
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
      <TokenLabel>{label}</TokenLabel>
      <TokenSeparator aria-hidden>•</TokenSeparator>
      <TokenCounter>
        Code word {stepIndex + 1} of {totalSteps}
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
