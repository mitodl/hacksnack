import React from "react"
import { PuzzleBox } from "./PuzzleBox"
import { PuzzleInput } from "./PuzzleInput"
import { Message } from "../../styled"
import type { TextPuzzleProps } from "../../types"

// Shared layout for puzzles that ask the player to type a free-text answer.
// The only per-type differences are the label, the rendered clue and the
// placeholder (see TextAnswerPuzzles).
export function TextAnswerPuzzle({
  label,
  clue,
  input,
  setInput,
  onSubmit,
  message,
  stepIndex,
  totalSteps,
  isSolved,
  hint,
  hintShown,
  onToggleHint,
  placeholder = "Type your answer",
}: {
  label: string
  clue: React.ReactNode
  placeholder?: string
} & TextPuzzleProps) {
  return (
    <PuzzleBox
      label={label}
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      hint={hint}
      hintShown={hintShown}
      onToggleHint={onToggleHint}
      isSolved={isSolved}
    >
      {clue}
      <PuzzleInput
        input={input}
        setInput={setInput}
        onSubmit={onSubmit}
        isSolved={isSolved}
        placeholder={placeholder}
        hint={hint}
        hintShown={hintShown}
      />
      {message && <Message>{message}</Message>}
    </PuzzleBox>
  )
}
