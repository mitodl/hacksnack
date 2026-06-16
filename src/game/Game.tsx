"use client"

import React, { useEffect, useMemo, useReducer, useRef, useState } from "react"
import { useAsset, useAssetBasePath } from "./AssetContext"
import { useGoogleMapsApiKey } from "./GoogleMapsContext"
import { titleCase, passwordDisplay } from "./lib/strings"
import { formatDateKey, startOfDay, formatElapsed } from "./lib/dates"
import { getEmbedUrl, isPdfUrl } from "./lib/url"
import { estimateStrength } from "./lib/strength"
import { findCourseMatches } from "./lib/gameData"
import type { GroupKey } from "./types"
import { initialGroupMaps, groupMapsReducer } from "./state"
import { loadProgress, saveProgress, hasProgress } from "./lib/progress"
import { useWinCelebration } from "./hooks/useWinCelebration"
import { usePuzzlePickerRows } from "./hooks/usePuzzlePickerRows"
import { useDateSet } from "./hooks/useDateSet"
import { useDailyPuzzle } from "./hooks/useDailyPuzzle"
import { PdfFactViewer } from "./components/PdfFactViewer"
import { Card } from "./components/primitives"
import { ProgressSentence } from "./components/ProgressSentence"
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
  Strong,
  SecondaryButton,
  GameRoot,
  ConfettiLayer,
  ConfettiPiece,
  TimImg,
  Shell,
  GameHeader,
  IconWrap,
  GameIcon,
  TitleCol,
  GameTitle,
  MobileLinks,
  LearnLink,
  HeaderRight,
  DesktopLinks,
  Timer,
  ProgressArea,
  LinkButton,
  Stack,
  SmallLabel,
  LoadingBody,
  MobileNav,
  NavButton,
  DesktopNav,
  NavArrow,
  NavContent,
  OcwBody,
  OcwHeading,
  OcwNote,
  OcwList,
  Footer,
  DateButtons,
  OverlayBackdrop,
  OverlayWrap,
  OverlayPanel,
  OverlayHead,
  OverlayHeadInner,
  OverlayKicker,
  OverlaySentence,
  OverlayMeta,
  CloseButton,
  FunFactAnchor,
  FunFactRow,
  FunFactImg,
  FunFactLink,
  FunFactName,
  FunFactText,
  FactEmbed,
  FactVideo,
  FactPlaceholder,
} from "./styled"

// Number of confetti pieces rained down on the win screen.
const CONFETTI_PIECE_COUNT = 400

// Display labels for each puzzle type, shown in the progress tracker.
const PROGRESS_LABELS: Record<GroupKey, string> = {
  riddle: "Riddle",
  emoji: "Rebus",
  scramble: "Scramble",
  symbol: "Symbol",
  image: "Image",
  equation: "Equation",
  map: "Map",
}

export default function Game() {
  const asset = useAsset()
  const assetBasePath = useAssetBasePath()
  const googleMapsApiKey = useGoogleMapsApiKey()
  const [step, setStep] = useState(0)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [timerRunning, setTimerRunning] = useState(true)
  const timerStartRef = useRef<number>(Date.now())
  const todayMidnight = useMemo(() => startOfDay(new Date()), [])

  const [groupMaps, dispatchGroups] = useReducer(
    groupMapsReducer,
    initialGroupMaps,
  )
  const wordsByGroup = groupMaps.words
  const inputsByGroup = groupMaps.inputs
  const hintShownByGroup = groupMaps.hintShown
  const hintCountedByGroup = groupMaps.hintCounted
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

  const [message, setMessage] = useState<string>("")
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

  // Hide any open OCW panels whenever we restart the flow.
  React.useEffect(() => {
    if (step === 0) {
      setShowScrambleOCWList(false)
      setShowRiddleOCWList(false)
    }
  }, [step])

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

  React.useEffect(() => {
    if (step >= activeGroups.length && activeGroups.length > 0) {
      setStep(activeGroups.length - 1)
    }
  }, [activeGroups.length, step])

  const sentence = useMemo(() => {
    const parts = activeGroups
      .map((g) => {
        if (g === "symbol") return symbol
        if (g === "image")
          return wordsByGroup.image
            ? passwordDisplay(titleCase(wordsByGroup.image))
            : ""
        const val = wordsByGroup[g]
        return val ? passwordDisplay(titleCase(val)) : ""
      })
      .filter(Boolean)
    return parts.join("")
  }, [activeGroups, wordsByGroup, symbol])

  const strength = useMemo(() => estimateStrength(sentence), [sentence])

  function next() {
    if (activeGroups.length === 0) return
    setStep((s) => (s >= activeGroups.length - 1 ? 0 : s + 1))
    setMessage("")
  }

  function prev() {
    if (activeGroups.length === 0) return
    setStep((s) => (s <= 0 ? activeGroups.length - 1 : s - 1))
    setMessage("")
  }

  function resetAll() {
    // Snapshot the outgoing day's progress so returning to it restores the
    // solved puzzles. The actual restore happens in the selectedDate effect.
    if (prevDateKeyRef.current !== null) {
      saveProgress(prevDateKeyRef.current, {
        groupMaps: groupMapsRef.current,
        symbol: symbolRef.current,
      })
    }
    setStep(0)
    setMessage("")
    setElapsedMs(0)
    setTimerRunning(true)
    timerStartRef.current = Date.now()
    setShowScrambleOCWList(false)
    setScrambleOCWLoading(false)
    setScrambleMatches([])
    setShowRiddleOCWList(false)
    setRiddleOCWLoading(false)
    setRiddleMatches([])
    resetCelebration()
  }
  resetAllRef.current = resetAll
  const dailyHintClicks = React.useMemo(
    () => Object.values(hintCountedByGroup).filter(Boolean).length,
    [hintCountedByGroup],
  )
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

  // Show OCW list for Scramble word when user clicks the Scramble label
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

  // Show OCW list for Riddle word when user clicks the Riddle label
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

  const setGroupInput = (group: GroupKey) => (value: string) =>
    dispatchGroups({ type: "setInput", group, value })

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
      setMessage("")
    } else setMessage(cfg.failMessage)
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
      setMessage("")
    } else setMessage("Nope, try again.")
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

  const currentGroup =
    step < activeGroups.length ? activeGroups[step] : undefined
  const canNavigate = activeGroups.length > 1
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
    showWinOverlay,
    setShowWinOverlay,
    showFunFact,
    winOverlayLayout,
    updateWinOverlayLayout,
    funFactAnchorRef,
    winSummaryAreaRef,
    resetCelebration,
  } = useWinCelebration({ allSolved, hasFunFact })

  useEffect(() => {
    if (!timerRunning) return
    timerStartRef.current = Date.now() - elapsedMs
    const id = window.setInterval(() => {
      setElapsedMs(Date.now() - timerStartRef.current)
    }, 250)
    return () => window.clearInterval(id)
    // elapsedMs only seeds the start time when the timer (re)starts; including
    // it would restart the interval on every tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerRunning])

  useEffect(() => {
    if (allSolved && timerRunning) setTimerRunning(false)
  }, [allSolved, timerRunning])

  const progressClickHandlers: Partial<Record<GroupKey, () => void>> = {
    riddle: handleRiddleClick,
    scramble: handleScrambleClick,
  }
  const progressItems = activeGroups.map((g, idx) => {
    const solvedWord = g === "symbol" ? symbol : wordsByGroup[g]
    const onClick = progressClickHandlers[g]
    return {
      key: `${g}-${idx}`,
      label: PROGRESS_LABELS[g],
      value: solvedWord ? passwordDisplay(solvedWord) : undefined,
      ...(onClick ? { onClick, clickable: !!solvedWord } : {}),
    }
  })

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
      <Shell>
        <GameHeader>
          <IconWrap>
            <GameIcon src={asset("icon.png")} alt="Hack Snack icon" />
          </IconWrap>
          <TitleCol>
            <GameTitle>Hack Snack</GameTitle>
            <MobileLinks>
              <LearnLink href="#/learn">Click to Learn to Play</LearnLink>
            </MobileLinks>
          </TitleCol>
          <HeaderRight>
            <DesktopLinks>
              <LearnLink href="#/learn">Click to Learn to Play</LearnLink>
            </DesktopLinks>
            <Timer>
              {formatElapsed(elapsedMs)} | Hints: {dailyHintClicks}
            </Timer>
          </HeaderRight>
        </GameHeader>

        <ProgressArea ref={winSummaryAreaRef}>
          <ProgressSentence
            items={progressItems}
            footerAction={
              allSolved && !showWinOverlay ? (
                <LinkButton
                  type="button"
                  onClick={() => {
                    updateWinOverlayLayout()
                    setShowWinOverlay(true)
                  }}
                >
                  Show win summary
                </LinkButton>
              ) : undefined
            }
          />
        </ProgressArea>

        <Stack>
          {pickerLoading && (
            <Card>
              <SmallLabel>Loading puzzles</SmallLabel>
              <LoadingBody>Fetching today's puzzle set...</LoadingBody>
            </Card>
          )}
          {!pickerLoading && noPuzzlesToday && (
            <Card>
              <SmallLabel>No puzzles</SmallLabel>
              <LoadingBody>No puzzles available for this date.</LoadingBody>
            </Card>
          )}

          {activeGroups.length > 0 && (
            <MobileNav>
              <NavButton
                type="button"
                onClick={prev}
                disabled={!canNavigate}
                aria-label="Previous puzzle"
              >
                &lt; Prev
              </NavButton>
              <NavButton
                type="button"
                onClick={next}
                disabled={!canNavigate}
                aria-label="Next puzzle"
              >
                Next &gt;
              </NavButton>
            </MobileNav>
          )}

          {activeGroups.length > 0 && (
            <DesktopNav>
              <NavArrow
                type="button"
                onClick={prev}
                disabled={!canNavigate}
                aria-label="Previous puzzle"
              >
                &lt;
              </NavArrow>
              <NavContent
                $solved={
                  !!currentGroup &&
                  currentGroup !== "image" &&
                  isGroupSolved(currentGroup)
                }
              >
                {currentGroup === "riddle" && activeRiddle && (
                  <PuzzleRiddle
                    riddle={activeRiddle}
                    input={inputsByGroup.riddle || ""}
                    setInput={setGroupInput("riddle")}
                    onSubmit={() => submitAnswer("riddle")}
                    message={message}
                    stepIndex={step}
                    totalSteps={totalSteps}
                    isSolved={isGroupSolved("riddle")}
                    hint={activeHints.riddle}
                    hintShown={!!hintShownByGroup.riddle}
                    onToggleHint={() => toggleHint("riddle")}
                  />
                )}

                {currentGroup === "emoji" && activeEmoji && (
                  <PuzzleEmoji
                    emoji={activeEmoji}
                    input={inputsByGroup.emoji || ""}
                    setInput={setGroupInput("emoji")}
                    onSubmit={() => submitAnswer("emoji")}
                    message={message}
                    stepIndex={step}
                    totalSteps={totalSteps}
                    isSolved={isGroupSolved("emoji")}
                    hint={activeHints.emoji}
                    hintShown={!!hintShownByGroup.emoji}
                    onToggleHint={() => toggleHint("emoji")}
                  />
                )}

                {currentGroup === "scramble" && activeScramble && (
                  <PuzzleScramble
                    scramble={activeScramble}
                    input={inputsByGroup.scramble || ""}
                    setInput={setGroupInput("scramble")}
                    onSubmit={() => submitAnswer("scramble")}
                    message={message}
                    stepIndex={step}
                    totalSteps={totalSteps}
                    isSolved={isGroupSolved("scramble")}
                    hint={activeHints.scramble}
                    hintShown={!!hintShownByGroup.scramble}
                    onToggleHint={() => toggleHint("scramble")}
                  />
                )}

                {currentGroup === "equation" && pickerEquation && (
                  <PuzzleEquation
                    equation={pickerEquation}
                    input={inputsByGroup.equation || ""}
                    setInput={setGroupInput("equation")}
                    onSubmit={() => submitAnswer("equation")}
                    message={message}
                    stepIndex={step}
                    totalSteps={totalSteps}
                    isSolved={isGroupSolved("equation")}
                    hint={activeHints.equation}
                    hintShown={!!hintShownByGroup.equation}
                    onToggleHint={() => toggleHint("equation")}
                  />
                )}

                {currentGroup === "map" && pickerMapCoord && (
                  <PuzzleMap
                    mapCoord={pickerMapCoord}
                    input={inputsByGroup.map || ""}
                    setInput={setGroupInput("map")}
                    onSubmit={() => submitAnswer("map")}
                    message={message}
                    stepIndex={step}
                    totalSteps={totalSteps}
                    apiKey={googleMapsApiKey}
                    isSolved={isGroupSolved("map")}
                    hint={activeHints.map}
                    hintShown={!!hintShownByGroup.map}
                    onToggleHint={() => toggleHint("map")}
                  />
                )}

                {currentGroup === "image" && activeImagePuzzle && (
                  <PuzzleImage
                    puzzle={activeImagePuzzle}
                    onSolved={handleImageSolved}
                    stepIndex={step}
                    totalSteps={totalSteps}
                    isSolved={!!wordsByGroup.image}
                    hint={activeHints.image}
                    hintShown={!!hintShownByGroup.image}
                    onToggleHint={() => toggleHint("image")}
                  />
                )}

                {currentGroup === "symbol" && pickerSymbol && (
                  <PuzzleSymbol
                    task={pickerSymbol}
                    input={inputsByGroup.symbol || ""}
                    setInput={setGroupInput("symbol")}
                    onSubmit={handleSymbolInput}
                    message={message}
                    stepIndex={step}
                    totalSteps={totalSteps}
                    isSolved={isGroupSolved("symbol")}
                    hint={activeHints.symbol}
                    hintShown={!!hintShownByGroup.symbol}
                    onToggleHint={() => toggleHint("symbol")}
                  />
                )}
              </NavContent>
              <NavArrow
                type="button"
                onClick={next}
                disabled={!canNavigate}
                aria-label="Next puzzle"
              >
                &gt;
              </NavArrow>
            </DesktopNav>
          )}

          {/* Show OCW matches under the riddle box only when toggled by click */}
          {showRiddleOCWList && (
            <Card>
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
                      <GameLink href={c.url} target="_blank" rel="noreferrer">
                        {c.title}
                      </GameLink>
                    </li>
                  ))}
                </OcwList>
              </OcwBody>
            </Card>
          )}
          {showScrambleOCWList && (
            <Card>
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
                      <GameLink href={c.url} target="_blank" rel="noreferrer">
                        {c.title}
                      </GameLink>
                    </li>
                  ))}
                </OcwList>
              </OcwBody>
            </Card>
          )}
        </Stack>

        <Footer>
          © MIT Learn - Puzzle date: {formatDateKey(selectedDate)}
        </Footer>
        <DateButtons>
          <SecondaryButton onClick={goPrevDay} disabled={!previousSetDate}>
            Previous Set
          </SecondaryButton>
          <SecondaryButton onClick={goNextDay} disabled={!canGoNextSet}>
            Next Set
          </SecondaryButton>
          <SecondaryButton onClick={goCurrentSet} disabled={!currentSetDate}>
            Current
          </SecondaryButton>
        </DateButtons>
      </Shell>
      {showWinOverlay && allSolved && (
        <>
          <OverlayBackdrop onClick={() => setShowWinOverlay(false)} />
          <OverlayWrap
            style={
              winOverlayLayout
                ? {
                    top: winOverlayLayout.top,
                    left: winOverlayLayout.left,
                    width: winOverlayLayout.width,
                    maxHeight: winOverlayLayout.maxHeight,
                  }
                : {
                    top: 16,
                    left: 16,
                    right: 16,
                    maxHeight: "calc(100vh - 32px)",
                  }
            }
            onClick={(event) => event.stopPropagation()}
          >
            <OverlayPanel>
              <OverlayHead>
                <OverlayHeadInner>
                  <div>
                    <OverlayKicker>Puzzle Cracked</OverlayKicker>
                    <OverlaySentence>{sentence}</OverlaySentence>
                    <OverlayMeta>
                      <Strong>{strength.label}</Strong> |{" "}
                      <Strong>{strength.entropy} bits entropy</Strong> |{" "}
                      <Strong>{strength.crackTime} to crack</Strong>{" "}
                    </OverlayMeta>
                    <OverlayMeta>
                      <Strong>
                        You took {formatElapsed(elapsedMs)} minutes
                      </Strong>{" "}
                      | <Strong>Hints: {dailyHintClicks}</Strong>
                    </OverlayMeta>
                  </div>
                </OverlayHeadInner>
                <CloseButton
                  type="button"
                  onClick={() => setShowWinOverlay(false)}
                >
                  Close
                </CloseButton>
              </OverlayHead>
              {hasFunFact && (
                <Card>
                  <FunFactAnchor ref={funFactAnchorRef} />
                  {showFunFact ? (
                    <>
                      <FunFactRow>
                        <FunFactImg src={asset("tim.png")} alt="Tim" />
                        <div>
                          <SmallLabel>Fun Fact</SmallLabel>
                          {pickerRow?.courseLink ? (
                            <FunFactLink
                              href={pickerRow.courseLink}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {pickerRow?.fact?.name || ""}
                            </FunFactLink>
                          ) : (
                            <FunFactName>
                              {pickerRow?.fact?.name || ""}
                            </FunFactName>
                          )}
                        </div>
                      </FunFactRow>
                      {factText && <FunFactText>{factText}</FunFactText>}
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
                    </>
                  ) : hasFactLink ? (
                    <FactPlaceholder />
                  ) : null}
                </Card>
              )}
            </OverlayPanel>
          </OverlayWrap>
        </>
      )}
    </GameRoot>
  )
}
