import React from "react"
import { Button } from "../primitives"
import { LockIcon, UnlockedIcon } from "../icons"
import { InputRow, TextInput } from "../../styled"

// The answer row shared by the text puzzles and the map puzzle: a text field
// that submits on Enter, plus the Unlock button. When a hint is shown it
// replaces the placeholder.
export function PuzzleInput({
  input,
  setInput,
  onSubmit,
  isSolved,
  placeholder = "Type your answer",
  hint,
  hintShown,
  label,
}: {
  input: string
  setInput: (v: string) => void
  onSubmit: () => void
  isSolved: boolean
  placeholder?: string
  hint?: string
  hintShown?: boolean
  label?: string
}) {
  return (
    <InputRow>
      <TextInput
        $solved={isSolved}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            onSubmit()
          }
        }}
        placeholder={hintShown && hint ? hint : placeholder}
        aria-label={label ? `${label} answer` : "Answer"}
        disabled={isSolved}
      />
      <Button onClick={onSubmit} solved={isSolved} disabled={isSolved}>
        {isSolved ? <UnlockedIcon /> : <LockIcon />}
        {isSolved ? "Unlocked" : "Unlock"}
      </Button>
    </InputRow>
  )
}
