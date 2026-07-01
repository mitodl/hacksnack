import React from "react"
import { Button } from "../primitives"
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
}: {
  input: string
  setInput: (v: string) => void
  onSubmit: () => void
  isSolved: boolean
  placeholder?: string
  hint?: string
  hintShown?: boolean
}) {
  return (
    <InputRow>
      <TextInput
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            onSubmit()
          }
        }}
        /* Focus the answer input: each puzzle shows a single prompt. Skip when
         * solved so navigating back to a solved puzzle doesn't steal focus
         * from the nav buttons. */
        /* eslint-disable-next-line jsx-a11y/no-autofocus */
        autoFocus={!isSolved}
        placeholder={hintShown && hint ? hint : placeholder}
        disabled={isSolved}
      />
      <Button onClick={onSubmit} solved={isSolved} disabled={isSolved}>
        {isSolved ? "Unlocked" : "Unlock"}
      </Button>
    </InputRow>
  )
}
