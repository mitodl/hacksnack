"use client"

import React, { useMemo, useReducer, useRef, useState } from "react"
import { useAsset, useAssetBasePath } from "./AssetContext"
import { useGoogleMapsApiKey } from "./GoogleMapsContext"
import { titleCase, passwordDisplay } from "./lib/strings"
import { formatDateKey, startOfDay } from "./lib/dates"
import { countWord, capitalize, plural } from "./lib/counts"
import { getEmbedUrl, isPdfUrl } from "./lib/url"
import { findCourseMatches } from "./lib/gameData"
import type { GroupKey } from "./types"
import { initialGroupMaps, groupMapsReducer } from "./state"
import { loadProgress, saveProgress, hasProgress } from "./lib/progress"
import { useWinCelebration } from "./hooks/useWinCelebration"
import { usePuzzlePickerRows } from "./hooks/usePuzzlePickerRows"
import { useDateSet } from "./hooks/useDateSet"
import { useDailyPuzzle } from "./hooks/useDailyPuzzle"
import { PdfFactViewer } from "./components/PdfFactViewer"
import { FinalCode } from "./components/FinalCode"
import type { FinalCodeSlot } from "./components/FinalCode"
import { MitConnection } from "./components/MitConnection"
import { HowToPlay } from "./components/HowToPlay"
import { StarIcon } from "./components/icons"
import {
  PuzzleRiddle,
  PuzzleEmoji,
  PuzzleScramble,
  PuzzleEquation,
  PuzzleSymbol,
} from "./components/puzzles/TextAnswerPuzzles"
import { PuzzleMap } from "./components/puzzles/PuzzleMap"
import { PuzzleImage } from "./components/puzzles/PuzzleImage"
import {
  FullFrame,
  GameLink,
  SecondaryButton,
  GameRoot,
  ConfettiLayer,
  ConfettiPiece,
  TimImg,
  BoardPage,
  BoardContainer,
  BoardMain,
  BoardCard,
  BoardHeaderRow,
  BoardHeadings,
  BoardHeadline,
  BoardSubhead,
  BoardSide,
  BoardControls,
  BoardControlsMeta,
  SolvedPill,
  SolvedPillText,
  LearnLink,
  Stack,
  SmallLabel,
  LoadingBody,
  InfoPanel,
  OcwBody,
  OcwHeading,
  OcwNote,
  OcwList,
  FactEmbed,
  FactVideo,
} from "./styled"

// Number of confetti pieces rained down on the win screen.
const CONFETTI_PIECE_COUNT = 400

// Display labels for each puzzle type, used by the final-code slots.
const PROGRESS_LABELS: Record<GroupKey, string> = {
  riddle: "Riddle",
  emoji: "Rebus",
  scramble: "Unscramble",
  symbol: "Symbol",
  image: "Image",
  equation: "Equation",
  map: "Map",
}

export default function Game() {
  const asset = useAsset()
  const assetBasePath = useAssetBasePath()
  const googleMapsApiKey = useGoogleMapsApiKey()
  const todayMidnight = useMemo(() => startOfDay(new Date()), [])

  const [groupMaps, dispatchGroups] = useReducer(
    groupMapsReducer,
    initialGroupMaps,
  )
  const wordsByGroup = groupMaps.words
  const inputsByGroup = groupMaps.inputs
  const hintShownByGroup = groupMaps.hintShown
  const [symbol, setSymbol] = useState<string>("")

  // Per-set-date progress is persisted in sessionStorage (see lib/progress) so
  // navigating between days keeps each day's solved puzzles solved, even if the
  // host app remounts the game on hash navigation. Refs hold the latest live
  // progress so we can snapshot the outgoing day before switching, and track
  // which date the live progress currently belongs to.
  const groupMapsRef = useRef(groupMaps)
  groupMapsRef.current = groupMaps
  const symbolRef = useRef(symbol)
  symbolRef.current = symbol
  const prevDateKeyRef = useRef<string | null>(null)

  // Every puzzle is on screen at once, so a retry message belongs to the
  // puzzle that produced it rather than the board as a whole.
  const [messages, setMessages] = useState<Partial<Record<GroupKey, string>>>({})
  const [showScrambleOCWList, setShowScrambleOCWList] = useState(false)
  const [scrambleOCWLoading, setScrambleOCWLoading] = useState(false)
  const [scrambleMatches, setScrambleMatches] = useState<
    Array<{ title: string; url: string }>
  >([])
  const [showRiddleOCWList, setShowRiddleOCWList] = useState(false)
  const [riddleOCWLoading, setRiddleOCWLoading] = useState(false)
  const [riddleMatches, setRiddleMatches] = useState<
    Array<{ title: string; url: string }>
  >([])
  const confettiPieces = useMemo(
    () =>
      Array.from({ length: CONFETTI_PIECE_COUNT }, (_, i) => ({
        id: i,
        left: Math.round((i / CONFETTI_PIECE_COUNT) * 100 + Math.random() * 4),
        delay: Math.round(Math.random() * 850),
        duration: 3600 + Math.round(Math.random() * 2000),
        drift: Math.round((Math.random() - 1.5) * 220),
        rotate: Math.round(Math.random() * 360),
        color: [
          "#ef4444",
          "#f59e0b",
          "#22c55e",
          "#3b82f6",
          "#ec4899",
          "#14b8a6",
        ][i % 6],
      })),
    [],
  )

  const handlePuzzleChange = React.useCallback(
    () => dispatchGroups({ type: "resetHints" }),
    [],
  )

  // resetAll closes over resetCelebration, which comes from a hook declared
  // below useDateSet, so it can't be memoized before this point. Keep a stable
  // callback that defers to the latest resetAll via a ref, so useDateSet's
  // effects can depend on it without re-running every render.
  const resetAllRef = useRef<() => void>(() => {})
  const onResetGame = React.useCallback(() => resetAllRef.current(), [])

  const { pickerRows, pickerLoading } = usePuzzlePickerRows(assetBasePath)
  const {
    selectedDate,
    currentSetDate,
    previousSetDate,
    canGoNextSet,
    goPrevDay,
    goNextDay,
    goCurrentSet,
  } = useDateSet({
    pickerRows,
    pickerLoading,
    todayMidnight,
    onResetGame,
  })
  const {
    pickerRow,
    noPuzzlesToday,
    activeGroups,
    activeRiddle,
    activeEmoji,
    activeScramble,
    activeImagePuzzle,
    pickerEquation,
    pickerMapCoord,
    pickerSymbol,
    activeHints,
  } = useDailyPuzzle({
    asset,
    pickerRows,
    pickerLoading,
    selectedDate,
    currentSetDate,
    todayMidnight,
    onPuzzleChange: handlePuzzleChange,
  })

  // Restore the selected day's saved progress (or start fresh). Runs after
  // useDailyPuzzle's effect so the loaded snapshot wins over its hint reset.
  const selectedDateKey = formatDateKey(selectedDate)
  React.useEffect(() => {
    if (prevDateKeyRef.current === selectedDateKey) return
    prevDateKeyRef.current = selectedDateKey
    const saved = loadProgress(selectedDateKey)
    dispatchGroups({ type: "load", state: saved?.groupMaps ?? initialGroupMaps })
    setSymbol(saved?.symbol ?? "")
  }, [selectedDateKey])

  // Persist the active day's progress on every change so it survives a remount.
  // Depends only on the progress maps (not the date key): on a date switch the
  // maps stay unchanged until the restore effect above reloads them, so this
  // never writes one day's answers under another day's key. The hasProgress
  // guard avoids clobbering saved progress with the empty initial state on
  // mount, before the restore effect has loaded it.
  React.useEffect(() => {
    const key = prevDateKeyRef.current
    if (!key) return
    const snapshot = { groupMaps, symbol }
    if (hasProgress(snapshot)) saveProgress(key, snapshot)
  }, [groupMaps, symbol])

  const totalSteps = Math.max(1, activeGroups.length)
  const isGroupSolved = React.useCallback(
    (g: GroupKey) => {
      if (g === "symbol") return !!symbol
      if (g === "image") return !!wordsByGroup.image
      return !!wordsByGroup[g]
    },
    [symbol, wordsByGroup],
  )
  const solvedCount = activeGroups.reduce(
    (count, g) => count + (isGroupSolved(g) ? 1 : 0),
    0,
  )

  const solvedWord = React.useCallback(
    (g: GroupKey) => (g === "symbol" ? symbol : wordsByGroup[g]),
    [symbol, wordsByGroup],
  )

  function resetAll() {
    // Snapshot the outgoing day's progress so returning to it restores the
    // solved puzzles. The actual restore happens in the selectedDate effect.
    if (prevDateKeyRef.current !== null) {
      saveProgress(prevDateKeyRef.current, {
        groupMaps: groupMapsRef.current,
        symbol: symbolRef.current,
      })
    }
    setMessages({})
    setShowScrambleOCWList(false)
    setScrambleOCWLoading(false)
    setScrambleMatches([])
    setShowRiddleOCWList(false)
    setRiddleOCWLoading(false)
    setRiddleMatches([])
    resetCelebration()
  }
  resetAllRef.current = resetAll
  const toggleHint = React.useCallback(
    (group: GroupKey) => {
      dispatchGroups({
        type: "toggleHint",
        group,
        hint: activeHints[group]?.trim(),
      })
    },
    [activeHints],
  )

  // Show OCW list for the Scramble word when its final-code slot is clicked
  const handleScrambleClick = async () => {
    if (!wordsByGroup.scramble) return
    if (showScrambleOCWList) {
      setShowScrambleOCWList(false)
      return
    }
    setScrambleOCWLoading(true)
    setShowScrambleOCWList(true)
    try {
      setScrambleMatches(
        await findCourseMatches(wordsByGroup.scramble, assetBasePath),
      )
    } catch {
      setScrambleMatches([])
    }
    setScrambleOCWLoading(false)
  }

  // Show OCW list for the Riddle word when its final-code slot is clicked
  const handleRiddleClick = async () => {
    if (!wordsByGroup.riddle) return
    if (showRiddleOCWList) {
      setShowRiddleOCWList(false)
      return
    }
    setRiddleOCWLoading(true)
    setShowRiddleOCWList(true)
    try {
      setRiddleMatches(
        await findCourseMatches(wordsByGroup.riddle || "", assetBasePath),
      )
    } catch {
      setRiddleMatches([])
    }
    setRiddleOCWLoading(false)
  }

  const setGroupInput = (group: GroupKey) => (value: string) => {
    dispatchGroups({ type: "setInput", group, value })
    setMessages((prev) => (prev[group] ? { ...prev, [group]: "" } : prev))
  }

  // Every text-answer puzzle validates the same way: normalize the typed
  // input, compare it to the expected answer, and on success store the raw
  // input plus the display word. They differ only in how the input is
  // normalized and compared, the stored word, and the retry message.
  const answerConfigs: Partial<
    Record<
      GroupKey,
      {
        task: object | null
        normalize: (raw: string) => string
        isCorrect: (clean: string) => boolean
        inputValue: string
        wordValue: string
        failMessage: string
      }
    >
  > = {
    riddle: {
      task: activeRiddle,
      normalize: (raw) => raw.trim().toLowerCase(),
      isCorrect: (clean) => !!activeRiddle && activeRiddle.a.includes(clean),
      inputValue: activeRiddle?.word ?? "",
      wordValue: activeRiddle?.word ?? "",
      failMessage: "Not quite, try again.",
    },
    emoji: {
      task: activeEmoji,
      normalize: (raw) => raw.trim().toLowerCase(),
      isCorrect: (clean) =>
        !!activeEmoji && clean === activeEmoji.answer.toLowerCase(),
      inputValue: activeEmoji?.answer ?? "",
      wordValue: activeEmoji ? titleCase(activeEmoji.answer) : "",
      failMessage: "Not quite, try again.",
    },
    scramble: {
      task: activeScramble,
      normalize: (raw) => raw.replace(/\s/g, "").toLowerCase(),
      isCorrect: (clean) =>
        !!activeScramble && clean === activeScramble.answer.toLowerCase(),
      inputValue: activeScramble?.answer ?? "",
      wordValue: activeScramble ? titleCase(activeScramble.answer) : "",
      failMessage: "Try unscrambling again.",
    },
    equation: {
      task: pickerEquation,
      normalize: (raw) => raw.trim(),
      isCorrect: (clean) =>
        !!pickerEquation && clean === pickerEquation.answer.trim(),
      inputValue: pickerEquation?.answer.trim() ?? "",
      wordValue: pickerEquation?.answer.trim() ?? "",
      failMessage: "Not quite, try again.",
    },
    map: {
      task: pickerMapCoord,
      normalize: (raw) => raw.trim().toLowerCase(),
      isCorrect: (clean) =>
        !!pickerMapCoord &&
        clean === pickerMapCoord.answer.trim().toLowerCase(),
      inputValue: pickerMapCoord?.answer.trim() ?? "",
      wordValue: pickerMapCoord?.answer.trim() ?? "",
      failMessage: "Not quite, try again.",
    },
  }

  const submitAnswer = (group: GroupKey) => {
    const cfg = answerConfigs[group]
    if (!cfg || !cfg.task) return
    const raw = inputsByGroup[group] || ""
    if (!raw.trim()) return
    if (cfg.isCorrect(cfg.normalize(raw))) {
      dispatchGroups({ type: "setInput", group, value: cfg.inputValue })
      dispatchGroups({ type: "setWord", group, value: cfg.wordValue })
      setMessages((prev) => ({ ...prev, [group]: "" }))
    } else setMessages((prev) => ({ ...prev, [group]: cfg.failMessage }))
  }

  // Symbol is special: its solved value lives in its own `symbol` state
  // rather than the per-group word map, so it can't use submitAnswer.
  const handleSymbolInput = () => {
    const raw = inputsByGroup.symbol || ""
    if (!pickerSymbol || !raw.trim()) return
    const clean = raw.trim()
    const expected = pickerSymbol.answer.trim()
    if (clean === expected) {
      dispatchGroups({ type: "setInput", group: "symbol", value: expected })
      setSymbol(expected)
      setMessages((prev) => ({ ...prev, symbol: "" }))
    } else setMessages((prev) => ({ ...prev, symbol: "Nope, try again." }))
  }

  const handleImageSolved = () => {
    if (activeImagePuzzle?.word) {
      dispatchGroups({
        type: "setWord",
        group: "image",
        value: activeImagePuzzle.word || "",
      })
    }
  }

  const allSolved =
    solvedCount === activeGroups.length && activeGroups.length > 0
  const factText = pickerRow?.fact?.text?.trim() || ""
  const factEmbedUrl = getEmbedUrl(pickerRow?.fact?.link || "")
  const hasFactLink = !!factEmbedUrl
  const factIsPdf = isPdfUrl(factEmbedUrl)
  const hasFunFact = !!(factText || hasFactLink)

  const {
    isCelebrating,
    timPath,
    showFunFact,
    funFactAnchorRef,
    resetCelebration,
  } = useWinCelebration({ allSolved, hasFunFact })

  // A solved code word can be explored: clicking its slot lists the OCW
  // courses that mention it. Only the word puzzles have such a list.
  const slotClickHandlers: Partial<Record<GroupKey, () => void>> = {
    riddle: handleRiddleClick,
    scramble: handleScrambleClick,
  }
  const finalCodeSlots: FinalCodeSlot[] = activeGroups.map((group, idx) => {
    const word = solvedWord(group)
    const onClick = slotClickHandlers[group]
    return {
      key: `${group}-${idx}`,
      label: PROGRESS_LABELS[group],
      // Shown exactly as the word appears in the final code (see `sentence`).
      ...(word
        ? {
            word: passwordDisplay(
              group === "symbol" ? word : titleCase(word),
            ),
          }
        : {}),
      ...(onClick && word ? { onClick } : {}),
    }
  })

  const clueCount = activeGroups.length
  const puzzleShellProps = (group: GroupKey, index: number) => ({
    stepIndex: index,
    totalSteps,
    isSolved: isGroupSolved(group),
    hint: activeHints[group],
    hintShown: !!hintShownByGroup[group],
    onToggleHint: () => toggleHint(group),
  })
  const textPuzzleProps = (group: GroupKey, index: number) => ({
    ...puzzleShellProps(group, index),
    input: inputsByGroup[group] || "",
    setInput: setGroupInput(group),
    onSubmit: () => submitAnswer(group),
    message: messages[group] || "",
  })

  const renderPuzzle = (group: GroupKey, index: number) => {
    switch (group) {
      case "emoji":
        return (
          activeEmoji && (
            <PuzzleEmoji
              key={group}
              emoji={activeEmoji}
              {...textPuzzleProps(group, index)}
            />
          )
        )
      case "scramble":
        return (
          activeScramble && (
            <PuzzleScramble
              key={group}
              scramble={activeScramble}
              {...textPuzzleProps(group, index)}
            />
          )
        )
      case "riddle":
        return (
          activeRiddle && (
            <PuzzleRiddle
              key={group}
              riddle={activeRiddle}
              {...textPuzzleProps(group, index)}
            />
          )
        )
      case "equation":
        return (
          pickerEquation && (
            <PuzzleEquation
              key={group}
              equation={pickerEquation}
              {...textPuzzleProps(group, index)}
            />
          )
        )
      case "map":
        return (
          pickerMapCoord && (
            <PuzzleMap
              key={group}
              mapCoord={pickerMapCoord}
              apiKey={googleMapsApiKey}
              {...textPuzzleProps(group, index)}
            />
          )
        )
      case "symbol":
        return (
          pickerSymbol && (
            <PuzzleSymbol
              key={group}
              task={pickerSymbol}
              {...puzzleShellProps(group, index)}
              input={inputsByGroup.symbol || ""}
              setInput={setGroupInput("symbol")}
              onSubmit={handleSymbolInput}
              message={messages.symbol || ""}
            />
          )
        )
      case "image":
        return (
          activeImagePuzzle && (
            <PuzzleImage
              key={group}
              puzzle={activeImagePuzzle}
              onSolved={handleImageSolved}
              {...puzzleShellProps(group, index)}
              isSolved={!!wordsByGroup.image}
            />
          )
        )
      default:
        return null
    }
  }

  return (
    <GameRoot>
      <style>{`
        @keyframes tim-funfact-wipe {
          0% {
            transform: translate(var(--tim-start-x), var(--tim-start-y)) rotate(-18deg) scale(0.9);
          }
          58% {
            transform: translate(var(--tim-mid-x), var(--tim-mid-y)) rotate(24deg) scale(2.1);
          }
          100% {
            transform: translate(var(--tim-end-x), var(--tim-end-y)) rotate(0deg) scale(1);
          }
        }
        @keyframes confetti-fall {
          0% {
            transform: translate3d(0, -12vh, 0) rotate(0deg);
            opacity: 0;
          }
          8% {
            opacity: 1;
          }
          100% {
            transform: translate3d(var(--drift), 115vh, 0) rotate(780deg);
            opacity: 0;
          }
        }
      `}</style>
      {isCelebrating && (
        <>
          <ConfettiLayer>
            {confettiPieces.map((piece) => (
              <ConfettiPiece
                key={piece.id}
                style={
                  {
                    left: `${piece.left}%`,
                    backgroundColor: piece.color,
                    animation: `confetti-fall ${piece.duration}ms linear ${piece.delay}ms forwards`,
                    "--drift": `${piece.drift}px`,
                    transform: `rotate(${piece.rotate}deg)`,
                  } as React.CSSProperties
                }
              />
            ))}
          </ConfettiLayer>
          <TimImg
            src={asset("tim.png")}
            alt="Tim celebration"
            style={
              {
                animation:
                  "tim-funfact-wipe 4100ms cubic-bezier(0.24, 0.88, 0.2, 1) forwards",
                "--tim-start-x": `${timPath.startX}px`,
                "--tim-start-y": `${timPath.startY}px`,
                "--tim-mid-x": `${timPath.midX}px`,
                "--tim-mid-y": `${timPath.midY}px`,
                "--tim-end-x": `${timPath.endX}px`,
                "--tim-end-y": `${timPath.endY}px`,
              } as React.CSSProperties
            }
          />
        </>
      )}
      <BoardPage>
        <BoardContainer>
          <BoardMain>
            <BoardCard>
              <BoardHeaderRow>
                <BoardHeadings>
                  <BoardHeadline>
                    {capitalize(countWord(clueCount))}{" "}
                    {plural(clueCount, "clue")}. One hidden code.
                    <br />
                    Can you crack it?
                  </BoardHeadline>
                  <BoardSubhead>Solve the clues in any order</BoardSubhead>
                </BoardHeadings>
                <SolvedPill>
                  <StarIcon />
                  <SolvedPillText>
                    {solvedCount} of {clueCount} solved
                  </SolvedPillText>
                </SolvedPill>
              </BoardHeaderRow>

              <Stack>
                {pickerLoading && (
                  <InfoPanel>
                    <SmallLabel>Loading puzzles</SmallLabel>
                    <LoadingBody>Fetching today's puzzle set...</LoadingBody>
                  </InfoPanel>
                )}
                {!pickerLoading && noPuzzlesToday && (
                  <InfoPanel>
                    <SmallLabel>No puzzles</SmallLabel>
                    <LoadingBody>
                      No puzzles available for this date.
                    </LoadingBody>
                  </InfoPanel>
                )}

                {activeGroups.map((group, index) => renderPuzzle(group, index))}

                {activeGroups.length > 0 && (
                  <FinalCode
                    slots={finalCodeSlots}
                    note={`Solve all ${countWord(clueCount)} ${plural(
                      clueCount,
                      "clue",
                    )} to reveal the final code and today's MIT connection.`}
                    unlocked={allSolved}
                    anchorRef={funFactAnchorRef}
                  >
                    {/* Held back until the celebrating Tim lands on the panel */}
                    {allSolved && hasFunFact && showFunFact && (
                      <MitConnection
                        text={factText}
                        courseName={pickerRow?.fact?.name}
                        courseLink={pickerRow?.courseLink}
                      >
                        {hasFactLink && (
                          <FactEmbed>
                            {factIsPdf ? (
                              <PdfFactViewer url={factEmbedUrl} />
                            ) : (
                              <FactVideo>
                                <FullFrame
                                  title="Course fact video"
                                  src={factEmbedUrl}
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              </FactVideo>
                            )}
                          </FactEmbed>
                        )}
                      </MitConnection>
                    )}
                  </FinalCode>
                )}

                {/* OCW matches for a solved code word, opened from its slot */}
                {showRiddleOCWList && (
                  <InfoPanel>
                    <SmallLabel>List of OCW Courses</SmallLabel>
                    <OcwBody>
                      <OcwHeading>
                        Courses mentioning "{wordsByGroup.riddle || ""}"
                      </OcwHeading>
                      {riddleOCWLoading && <OcwNote>Loading…</OcwNote>}
                      {!riddleOCWLoading && riddleMatches.length === 0 && (
                        <OcwNote>No courses found.</OcwNote>
                      )}
                      <OcwList>
                        {riddleMatches.map((c, i) => (
                          <li key={i}>
                            <GameLink
                              href={c.url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {c.title}
                            </GameLink>
                          </li>
                        ))}
                      </OcwList>
                    </OcwBody>
                  </InfoPanel>
                )}
                {showScrambleOCWList && (
                  <InfoPanel>
                    <SmallLabel>List of OCW Courses</SmallLabel>
                    <OcwBody>
                      <OcwHeading>
                        Courses mentioning "{wordsByGroup.scramble || ""}"
                      </OcwHeading>
                      {scrambleOCWLoading && <OcwNote>Loading…</OcwNote>}
                      {!scrambleOCWLoading && scrambleMatches.length === 0 && (
                        <OcwNote>No courses found.</OcwNote>
                      )}
                      <OcwList>
                        {scrambleMatches.map((c, i) => (
                          <li key={i}>
                            <GameLink
                              href={c.url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {c.title}
                            </GameLink>
                          </li>
                        ))}
                      </OcwList>
                    </OcwBody>
                  </InfoPanel>
                )}
              </Stack>
            </BoardCard>

            <BoardControls>
              <BoardControlsMeta>
                Puzzle date - {formatDateKey(selectedDate)}
              </BoardControlsMeta>
              <SecondaryButton onClick={goPrevDay} disabled={!previousSetDate}>
                Previous Set
              </SecondaryButton>
              <SecondaryButton onClick={goNextDay} disabled={!canGoNextSet}>
                Next Set
              </SecondaryButton>
              <SecondaryButton onClick={goCurrentSet} disabled={!currentSetDate}>
                Current
              </SecondaryButton>
              <LearnLink href="#/learn">Learn to play</LearnLink>
            </BoardControls>
          </BoardMain>

          <BoardSide>
            <HowToPlay groups={activeGroups} />
          </BoardSide>
        </BoardContainer>
      </BoardPage>
    </GameRoot>
  )
}
