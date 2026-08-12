import React from "react"
import { TextAnswerPuzzle } from "./TextAnswerPuzzle"
import { RebusClue } from "./RebusClue"
import { QuestionHeading, EquationPrompt, ScrambleClue } from "../../styled"
import type {
  RiddleType,
  EmojiType,
  ScrambleType,
  EquationType,
  SymbolInputTask,
  TextPuzzleProps,
} from "../../types"

// Each of these is just TextAnswerPuzzle with a type-specific label and clue;
// every other prop is forwarded unchanged.

export const PuzzleRiddle = ({
  riddle,
  ...rest
}: { riddle: RiddleType } & TextPuzzleProps) => (
  <TextAnswerPuzzle
    {...rest}
    label="Riddle"
    clue={<QuestionHeading>{riddle.q}</QuestionHeading>}
  />
)

export const PuzzleEmoji = ({
  emoji,
  ...rest
}: { emoji: EmojiType } & TextPuzzleProps) => (
  <TextAnswerPuzzle
    {...rest}
    label="Rebus"
    clue={<RebusClue prompt={emoji.prompt} />}
  />
)

export const PuzzleScramble = ({
  scramble,
  ...rest
}: { scramble: ScrambleType } & TextPuzzleProps) => (
  <TextAnswerPuzzle
    {...rest}
    label="Unscramble"
    clue={<ScrambleClue>{scramble.scrambled}</ScrambleClue>}
  />
)

export const PuzzleEquation = ({
  equation,
  ...rest
}: { equation: EquationType } & TextPuzzleProps) => (
  <TextAnswerPuzzle
    {...rest}
    label="Equation"
    clue={<EquationPrompt>{equation.clue}</EquationPrompt>}
  />
)

export const PuzzleSymbol = ({
  task,
  ...rest
}: { task: SymbolInputTask } & TextPuzzleProps) => (
  <TextAnswerPuzzle
    {...rest}
    label="Symbol"
    clue={<QuestionHeading>{task.prompt}</QuestionHeading>}
    placeholder="Type the symbol"
  />
)
