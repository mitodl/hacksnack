import React from "react"
import { tokenizeRebus } from "../../lib/rebus"
import { RebusRow, RebusEmoji, RebusOperator } from "../../styled"

// A rebus clue: the pictures set larger than the operators and letters that
// join them.
export function RebusClue({ prompt }: { prompt: string }) {
  const tokens = React.useMemo(() => tokenizeRebus(prompt), [prompt])
  return (
    <RebusRow role="img" aria-label={`Rebus clue: ${prompt}`}>
      {tokens.map((token, i) =>
        token.isEmoji ? (
          <RebusEmoji key={i} aria-hidden>
            {token.text}
          </RebusEmoji>
        ) : (
          <RebusOperator key={i} aria-hidden>
            {token.text}
          </RebusOperator>
        ),
      )}
    </RebusRow>
  )
}
