import React from "react"
import { TokenTitleWrap, TokenTitleRow, HintButton } from "../styled"

export function TokenTitle({
  label,
  stepIndex,
  totalSteps,
  hint,
  hintShown,
  onToggleHint,
  forceHintButton,
  hintButtonLabel,
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
  isSolved?: boolean
}) {
  // Once a puzzle is solved there's nothing left to hint at, so hide the button.
  const hasHint = !isSolved && (!!hint?.trim() || !!forceHintButton)
  return (
    <TokenTitleWrap>
      <TokenTitleRow>
        <span>
          {label} • Token {stepIndex + 1} / {totalSteps}
        </span>
        {hasHint && (
          <HintButton type="button" onClick={onToggleHint}>
            {hintShown ? "Hide hint" : hintButtonLabel || "Get a hint"}
          </HintButton>
        )}
      </TokenTitleRow>
    </TokenTitleWrap>
  )
}
