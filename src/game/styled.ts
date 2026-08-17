import styled from "@emotion/styled"
import { theme } from "./theme"

// Elevation from the board design: the card drop shadow ("SearchShadow") and
// the 04dp shadow carried by the Unlock buttons.
const CARD_SHADOW = "0 8px 10px rgba(120, 147, 172, 0.1)"
const BUTTON_SHADOW =
  "0 2px 4px rgba(37, 38, 43, 0.1), 0 3px 8px rgba(37, 38, 43, 0.12)"
// The cracked final-code panel is washed with its own green at 10%.
const GREEN_TINT = "rgba(0, 128, 0, 0.1)"

// ---------- UI Pieces ----------
export const PdfViewerRoot = styled.div({
  height: "288px",
  overflowY: "auto",
  backgroundColor: theme.custom.colors.lightGray1,
  padding: "12px",
  // Rendered PDF pages are <canvas> elements appended imperatively by
  // PdfFactViewer; style them here rather than via (absent) Tailwind classes.
  "& canvas": {
    display: "block",
    margin: "0 auto 12px",
    borderRadius: "2px",
    border: `1px solid ${theme.custom.colors.lightGray2}`,
    backgroundColor: theme.custom.colors.white,
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  },
})

export const PdfStatus = styled.div({
  ...theme.typography.body2,
  marginBottom: "12px",
  borderRadius: "6px",
  border: `1px solid ${theme.custom.colors.lightGray2}`,
  backgroundColor: theme.custom.colors.white,
  padding: "8px 12px",
  color: theme.custom.colors.silverGrayDark,
})

// The Unlock button: near-black, 4px radius, a lock glyph and its label. It
// stretches to the height of the answer field beside it.
export const StyledButton = styled.button<{ $solved?: boolean }>(
  ({ $solved }) => ({
    ...theme.typography.buttonLarge,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    flexShrink: 0,
    boxSizing: "border-box",
    alignSelf: "stretch",
    padding: $solved ? "12px" : "12px 24px 12px 20px",
    borderRadius: "4px",
    boxShadow: $solved ? "none" : BUTTON_SHADOW,
    cursor: "pointer",
    transition: "background-color 150ms ease, transform 150ms ease",
    // Solved, it reads "Unlocked" as plain green text rather than a filled block.
    backgroundColor: $solved ? "transparent" : theme.custom.colors.darkGray2,
    color: $solved ? theme.custom.colors.green1 : theme.custom.colors.white,
    border: "none",
    ":hover": {
      backgroundColor: $solved ? "transparent" : theme.custom.colors.black,
    },
    ":active": {
      transform: "scale(0.98)",
    },
    // The button is only ever disabled once its puzzle is solved, which the
    // green fill already communicates — so it isn't dimmed.
    ":disabled": {
      cursor: "default",
    },
  }),
)

// ---------- Board layout ----------
// The page shell: a centred two-column board (puzzles + "How to play").
export const BoardPage = styled.div({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "56px 16px",
  [theme.breakpoints.up("md")]: {
    padding: "56px 40px",
  },
  [theme.breakpoints.up("xl")]: {
    padding: "56px 200px",
  },
})

export const BoardContainer = styled.div({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "56px",
  width: "100%",
  // The design's side-by-side columns need 722 + 56 + 304; below that the
  // "How to play" panel drops under the board.
  [theme.breakpoints.up(1140)]: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
})

export const BoardMain = styled.div({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: "812px",
})

export const BoardCard = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  padding: "40px",
  // Square-bottomed: the puzzle-date controls sit directly beneath the card.
  borderRadius: "4px 4px 0 0",
  backgroundColor: theme.custom.colors.white,
  boxShadow: CARD_SHADOW,
  [theme.breakpoints.down("sm")]: {
    padding: "24px",
  },
})

export const BoardHeaderRow = styled.div({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "4px",
  flexWrap: "wrap",
})

export const BoardHeadings = styled.div({
  display: "flex",
  flex: 1,
  flexDirection: "column",
  gap: "4px",
  minWidth: "240px",
})

export const BoardHeadline = styled.h1({
  ...theme.typography.h5,
  margin: 0,
  color: theme.custom.colors.darkGray2,
})

export const BoardSubhead = styled.p({
  ...theme.typography.subtitle1,
  margin: 0,
  color: theme.custom.colors.red,
})

export const SolvedPill = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  flexShrink: 0,
  padding: "12px 16px",
  borderRadius: "4px",
  border: `1px solid ${theme.custom.colors.lightGray2}`,
  backgroundColor: theme.custom.colors.white,
})

export const SolvedPillText = styled.span({
  ...theme.typography.subtitle2,
  whiteSpace: "nowrap",
  color: theme.custom.colors.darkGray2,
})

// ---------- Puzzle components ----------
// One puzzle row: a stack of header, clue and answer field on a grey surface.
// Solved, it gains a green outline and its number becomes a check.
export const PuzzleCard = styled.div<{ $solved?: boolean }>(({ $solved }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "24px",
  padding: "32px",
  borderRadius: "8px",
  border: $solved
    ? `1px solid ${theme.custom.colors.green1}`
    : "1px solid transparent",
  backgroundColor: theme.custom.colors.lightGray1,
  [theme.breakpoints.down("sm")]: {
    gap: "16px",
    padding: "20px",
  },
}))

// The count sits inline at the head of the row rather than in its own column.
export const PuzzleRowNumber = styled.div<{ $solved?: boolean }>(
  ({ $solved }) => ({
    ...theme.typography.body3Bold,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxSizing: "border-box",
    width: "26px",
    height: "26px",
    borderRadius: "100px",
    textAlign: "center",
    color: theme.custom.colors.white,
    backgroundColor: $solved
      ? theme.custom.colors.green1
      : theme.custom.colors.darkGray2,
  }),
)

export const PuzzleRowContent = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  width: "100%",
  minWidth: 0,
  [theme.breakpoints.down("sm")]: {
    gap: "16px",
  },
})

export const TokenTitleRow = styled.div({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  width: "100%",
})

// The type and its position read as one sentence — "Rebus • Code word 1 of 3" —
// with only the type in the darker colour.
export const TokenCounter = styled.p({
  ...theme.typography.body1,
  flex: 1,
  minWidth: 0,
  margin: 0,
  color: theme.custom.colors.silverGrayDark,
})

export const TokenLabel = styled.span({
  color: theme.custom.colors.darkGray2,
})

export const HintButton = styled.button({
  ...theme.typography.body2,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "4px",
  flexShrink: 0,
  textTransform: "none",
  textDecoration: "underline",
  color: theme.custom.colors.red,
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 0,
  ":hover": {
    textDecoration: "none",
  },
})

export const QuestionHeading = styled.h2({
  ...theme.typography.h5,
  margin: 0,
  color: theme.custom.colors.darkGray2,
})

// Rebus clues are a row of pictures and the operators joining them, the
// pictures set larger than the operators.
export const RebusRow = styled.div({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "24px",
})

// The design sets each picture 38px tall; the operators between them are
// smaller, so the pictures carry the clue.
export const RebusEmoji = styled.span({
  fontFamily: theme.typography.fontFamily,
  fontWeight: theme.typography.fontWeightMedium,
  fontSize: "38px",
  lineHeight: "38px",
  color: theme.custom.colors.darkGray2,
})

export const RebusOperator = styled.span({
  ...theme.typography.h4,
  textAlign: "center",
  color: theme.custom.colors.darkGray2,
})

// Equation clues match the rebus scale but in a monospace face so the math
// symbols line up.
export const EquationPrompt = styled.div({
  ...theme.typography.h2,
  fontFamily: "Lucida Sans Console, monospace",
  wordBreak: "break-word",
  color: theme.custom.colors.darkGray2,
})

// The scrambled letters, spread apart so each reads as its own tile. Narrow
// screens tighten the tracking so a typical word still fits the row.
export const ScrambleClue = styled.div({
  ...theme.typography.h2,
  letterSpacing: "12px",
  overflowX: "auto",
  whiteSpace: "nowrap",
  color: theme.custom.colors.darkGray2,
  [theme.breakpoints.down("sm")]: {
    letterSpacing: "8px",
  },
})

export const InputRow = styled.div({
  display: "flex",
  alignItems: "stretch",
  gap: "16px",
  width: "100%",
})

// Solved, the field keeps its white surface but states the answer in bold green
// caps.
export const TextInput = styled.input<{ $solved?: boolean }>(({ $solved }) => ({
  ...theme.typography.body1,
  flex: 1,
  minWidth: 0,
  boxSizing: "border-box",
  height: "56px",
  padding: "8px 16px",
  borderRadius: "8px",
  border: `1px solid ${theme.custom.colors.silverGrayLight}`,
  backgroundColor: theme.custom.colors.white,
  color: theme.custom.colors.darkGray2,
  "::placeholder": {
    color: theme.custom.colors.silverGrayDark,
  },
  ":focus": {
    outline: `2px solid ${theme.custom.colors.darkGray2}`,
    outlineOffset: "-1px",
  },
  ":disabled": {
    backgroundColor: theme.custom.colors.white,
    color: theme.custom.colors.darkGray2,
  },
  ...($solved
    ? {
        ...theme.typography.h5,
        textTransform: "uppercase",
        ":disabled": {
          backgroundColor: theme.custom.colors.white,
          color: theme.custom.colors.green1,
        },
      }
    : {}),
}))

export const Message = styled.p({
  ...theme.typography.body2,
  margin: 0,
  color: theme.custom.colors.red,
})

export const SmallPrompt = styled.p({
  ...theme.typography.body2,
  margin: 0,
  color: theme.custom.colors.silverGrayDark,
})

// ---------- Final code ----------
// While the code is incomplete the panel is only an outline, set apart from the
// solvable rows by its dashes. Cracked, it fills with green and holds the
// revealed MIT connection.
export const FinalPanel = styled.div<{ $unlocked?: boolean }>(
  ({ $unlocked }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: $unlocked ? "32px" : "24px",
    padding: "32px",
    borderRadius: "8px",
    border: $unlocked
      ? `1px solid ${theme.custom.colors.green1}`
      : `1px dashed ${theme.custom.colors.darkGray1}`,
    backgroundColor: $unlocked ? GREEN_TINT : "transparent",
    [theme.breakpoints.down("sm")]: {
      gap: "16px",
      padding: "20px",
    },
  }),
)

// The heading and slots, grouped so the revealed connection sits below them
// with the panel's wider gap.
export const FinalPuzzle = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  width: "100%",
})

export const FinalHeader = styled.div({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  width: "100%",
})

export const FinalBadge = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  boxSizing: "border-box",
  width: "40px",
  height: "40px",
  borderRadius: "100px",
  backgroundColor: theme.custom.colors.red,
})

export const FinalContent = styled.div({
  display: "flex",
  flex: 1,
  flexDirection: "column",
  justifyContent: "center",
  minWidth: 0,
})

export const FinalTitle = styled.h2({
  ...theme.typography.h5,
  margin: 0,
  color: theme.custom.colors.black,
})

export const FinalNote = styled.p({
  ...theme.typography.body2Loose,
  margin: 0,
  color: theme.custom.colors.black,
})

export const FinalSlotsRow = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: "48px",
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    gap: "20px",
  },
})

export const FinalSlots = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: "48px",
  [theme.breakpoints.down("sm")]: {
    gap: "20px",
  },
})

// Each code word sits on a rule rather than in a box. The design's 99px is a
// minimum, not a cap: it keeps the three blanks even while empty, and the rule
// grows with a code word longer than the design's samples rather than clipping
// it.
export const FinalSlot = styled.div<{ $filled?: boolean }>(({ $filled }) => ({
  ...theme.typography.h5,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxSizing: "border-box",
  minWidth: "99px",
  padding: "4px 24px",
  borderBottom: `1px solid ${theme.custom.colors.black}`,
  color: theme.custom.colors.black,
  ...($filled ? { textTransform: "uppercase" as const } : {}),
  whiteSpace: "nowrap",
}))

export const FinalLock = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
})

// ---------- Today's MIT connection ----------
// Revealed inside the final-code panel once the code is cracked: a plain white
// card stacking the headline, the fact, and the course it comes from.
export const RevealCard = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  padding: "24px",
  borderRadius: "4px",
  border: `1px solid ${theme.custom.colors.silverGrayLight}`,
  backgroundColor: theme.custom.colors.white,
  width: "100%",
  boxSizing: "border-box",
})

export const RevealTitleRow = styled.div({
  display: "flex",
  alignItems: "center",
  gap: "16px",
  width: "100%",
})

export const RevealBadge = styled.span({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  fontSize: "40px",
  lineHeight: "normal",
})

export const RevealTitle = styled.h2({
  ...theme.typography.h5,
  flex: 1,
  minWidth: 0,
  margin: 0,
  color: theme.custom.colors.red,
})

export const RevealText = styled.p({
  ...theme.typography.body2Loose,
  margin: 0,
  color: theme.custom.colors.darkGray2,
})

export const RevealLinkGroup = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  width: "100%",
})

export const RevealLinkLabel = styled.p({
  ...theme.typography.subtitle1,
  margin: 0,
  color: theme.custom.colors.darkGray2,
})

export const RevealLinkRow = styled.div({
  display: "flex",
  alignItems: "flex-start",
  gap: "8px",
})

export const RevealLink = styled.a({
  ...theme.typography.body2Loose,
  color: theme.custom.colors.red,
  textDecoration: "underline",
  ":hover": {
    textDecoration: "none",
  },
})

export const RevealName = styled.span({
  ...theme.typography.body2,
  color: theme.custom.colors.darkGray2,
})

export const MapFrame = styled.div({
  width: "100%",
  height: "288px",
  borderRadius: "12px",
  border: `1px solid ${theme.custom.colors.lightGray2}`,
  overflow: "hidden",
  backgroundColor: theme.custom.colors.lightGray1,
  marginBottom: "16px",
})

export const FullFrame = styled.iframe({
  height: "100%",
  width: "100%",
  border: "none",
})

export const MapBlockedMsg = styled.div({
  ...theme.typography.body2,
  height: "100%",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 24px",
  textAlign: "center",
  color: theme.custom.colors.silverGrayDark,
})

// Both image-puzzle surfaces sit in the flex column of a puzzle row and are
// capped by a `maxWidth` the puzzle sets. Their width has to be explicit: they
// hold nothing but background images, so left to shrink-to-fit they would
// collapse to nothing (and `aspect-ratio` would take the height with them).
export const ImageSolvedFrame = styled.div({
  width: "100%",
  boxSizing: "border-box",
  borderRadius: "12px",
  overflow: "hidden",
  border: `10px solid ${theme.custom.colors.darkGreen}`,
})

export const ImageSolvedInner = styled.div({
  height: "100%",
  width: "100%",
})

export const PuzzleGrid = styled.div({
  width: "100%",
  boxSizing: "border-box",
  display: "grid",
  gap: "2px",
  borderRadius: "12px",
  backgroundColor: theme.custom.colors.lightGray2,
  padding: "4px",
})

export const PuzzleSlot = styled.div({
  position: "relative",
  overflow: "hidden",
  borderRadius: "6px",
  backgroundColor: theme.custom.colors.lightGray1,
})

export const PuzzleTile = styled.div<{ $selected?: boolean }>(
  ({ $selected }) => ({
    height: "100%",
    width: "100%",
    cursor: "grab",
    border: `1px solid ${theme.custom.colors.white}`,
    outline: $selected ? `3px solid ${theme.custom.colors.mitRed}` : "none",
    outlineOffset: "-3px",
    position: "relative",
    zIndex: $selected ? 1 : undefined,
    ":active": {
      cursor: "grabbing",
    },
    ":focus-visible": {
      outline: `3px solid ${theme.custom.colors.darkGray1}`,
      outlineOffset: "-3px",
      zIndex: 1,
    },
  }),
)

export const SecondaryButton = styled.button({
  ...theme.typography.button,
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "8px 16px",
  borderRadius: "4px",
  cursor: "pointer",
  backgroundColor: theme.custom.colors.white,
  color: theme.custom.colors.black,
  border: `1px solid ${theme.custom.colors.lightGray2}`,
  transition: "background-color 150ms ease",
  ":hover": {
    backgroundColor: theme.custom.colors.lightGray1,
  },
  ":disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
  },
})

// ---------- Main Game ----------
export const GameRoot = styled.div({
  minHeight: "100vh",
  backgroundColor: theme.custom.colors.lightGray1,
  color: theme.custom.colors.darkGray2,
})

export const ConfettiLayer = styled.div({
  pointerEvents: "none",
  position: "fixed",
  inset: 0,
  zIndex: 70,
  overflow: "hidden",
})

export const ConfettiPiece = styled.span({
  position: "absolute",
  top: 0,
  height: "12px",
  width: "8px",
  borderRadius: "2px",
})


export const LearnLink = styled.a({
  ...theme.typography.body2,
  display: "inline-flex",
  color: theme.custom.colors.mitRed,
  textDecoration: "none",
  ":hover": {
    textDecoration: "underline",
  },
})

// The stack of puzzle rows and the final-code panel inside the board card.
export const Stack = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
})

// ---------- How to play ----------
export const BoardSide = styled.div({
  width: "100%",
  maxWidth: "344px",
  flexShrink: 0,
})

export const SideCard = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  padding: "24px",
  borderRadius: "4px",
  backgroundColor: theme.custom.colors.white,
  boxShadow: CARD_SHADOW,
})

export const SideTitleRow = styled.div({
  display: "flex",
  alignItems: "center",
  gap: "8px",
})

export const SideTitle = styled.h2({
  ...theme.typography.subtitle1,
  margin: 0,
  color: theme.custom.colors.darkGray2,
})

export const SideBody = styled.p({
  ...theme.typography.body2Loose,
  margin: 0,
  color: theme.custom.colors.darkGray2,
})

// The per-puzzle-type lines are a bulleted list.
export const SideList = styled.ul({
  ...theme.typography.body2Loose,
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  listStyle: "disc",
  margin: 0,
  paddingLeft: "21px",
  color: theme.custom.colors.darkGray2,
})

export const SideTerm = styled.span({
  fontWeight: theme.typography.fontWeightBold,
})

// ---------- Board controls ----------
// The set navigation beneath the board card, on the card's own surface and
// divided from it by a rule. Starting over is separated from the set-to-set
// controls by pushing it to the far end.
export const BoardControls = styled.div({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "12px",
  padding: "24px 40px",
  borderTop: `1px solid ${theme.custom.colors.lightGray2}`,
  borderRadius: "0 0 4px 4px",
  backgroundColor: theme.custom.colors.white,
  boxShadow: CARD_SHADOW,
  "& > :last-of-type": {
    marginLeft: "auto",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "16px 24px",
  },
})

// A secondary panel inside the board card: its loading and empty states.
export const InfoPanel = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  padding: "16px",
  borderRadius: "8px",
  border: `1px solid ${theme.custom.colors.lightGray2}`,
  backgroundColor: theme.custom.colors.lightGray1,
})

export const SmallLabel = styled.div({
  ...theme.typography.subtitle3,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: theme.custom.colors.silverGray,
})

export const LoadingBody = styled.div({
  ...theme.typography.body2,
  marginTop: "8px",
  color: theme.custom.colors.darkGray1,
})

export const FactEmbed = styled.div({
  marginTop: "12px",
  overflow: "hidden",
  borderRadius: "12px",
  border: `1px solid ${theme.custom.colors.lightGray2}`,
  backgroundColor: theme.custom.colors.white,
})

export const FactVideo = styled.div({
  aspectRatio: "16 / 9",
  width: "100%",
})
