import React from "react"
import { HowToPlayIcon } from "./icons"
import { countWord, plural } from "../lib/counts"
import {
  SideCard,
  SideTitleRow,
  SideTitle,
  SideBody,
  SideList,
  SideTerm,
} from "../styled"
import type { GroupKey } from "../types"

// One line per puzzle type, shown for whichever types are in play today.
const PUZZLE_HELP: Record<GroupKey, { term: string; text: string }> = {
  emoji: { term: "Rebus", text: "Solve the picture clue." },
  scramble: {
    term: "Unscramble",
    text: "Rearrange the letters to find the word.",
  },
  riddle: { term: "Riddle", text: "read the clue and enter the answer." },
  equation: { term: "Equation", text: "solve the short maths prompt." },
  image: { term: "Image", text: "rearrange the tiles to rebuild the picture." },
  map: { term: "Map", text: "name the place shown in the street view." },
  symbol: { term: "Symbol", text: "type the symbol the clue describes." },
}

export function HowToPlay({ groups }: { groups: GroupKey[] }) {
  const count = groups.length
  return (
    <SideCard>
      <SideTitleRow>
        <HowToPlayIcon />
        <SideTitle>How to play</SideTitle>
      </SideTitleRow>
      <SideBody>
        Solve {countWord(count)} connected {plural(count, "clue")} to unlock{" "}
        {countWord(count)} code {plural(count, "word")}. The code words combine
        to reveal the final code. Crack the final code to unlock today's MIT
        connection
      </SideBody>
      <SideList>
        {groups.map((group) => (
          <li key={group}>
            <SideTerm>{PUZZLE_HELP[group].term}:</SideTerm>{" "}
            {PUZZLE_HELP[group].text}
          </li>
        ))}
      </SideList>
    </SideCard>
  )
}
