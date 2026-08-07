import styled from "@emotion/styled"
import { theme } from "./theme"

// Elevation from the board design: the card drop shadow ("SearchShadow") and
// the 04dp shadow carried by the Unlock buttons.
const CARD_SHADOW = "0 8px 10px rgba(120, 147, 172, 0.1)"
const BUTTON_SHADOW =
  "0 2px 4px rgba(37, 38, 43, 0.1), 0 3px 8px rgba(37, 38, 43, 0.12)"

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

// The Unlock button: MIT red, 4px radius, a lock glyph and its label, at the
// design's fixed 40px height / 119px minimum width.
export const StyledButton = styled.button<{ $solved?: boolean }>(
  ({ $solved }) => ({
    ...theme.typography.button,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    flexShrink: 0,
    boxSizing: "border-box",
    height: "40px",
    minWidth: "119px",
    padding: "12px 16px 12px 12px",
    borderRadius: "4px",
    boxShadow: BUTTON_SHADOW,
    cursor: "pointer",
    transition: "background-color 150ms ease, transform 150ms ease",
    // Solved, it reads "Unlocked" and is disabled — grey, not red.
    backgroundColor: $solved
      ? theme.custom.colors.silverGray
      : theme.custom.colors.mitRed,
    color: theme.custom.colors.white,
    border: "none",
    ":hover": {
      backgroundColor: $solved
        ? theme.custom.colors.silverGray
        : theme.custom.colors.black,
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
  maxWidth: "722px",
})

export const BoardCard = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "32px",
  padding: "40px",
  borderRadius: "4px",
  backgroundColor: theme.custom.colors.white,
  boxShadow: CARD_SHADOW,
  [theme.breakpoints.down("sm")]: {
    gap: "24px",
    padding: "24px",
  },
})

export const BoardHeaderRow = styled.div({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
})

export const BoardHeadings = styled.div({
  display: "flex",
  flex: 1,
  flexDirection: "column",
  gap: "12px",
  minWidth: "240px",
})

export const BoardHeadline = styled.h1({
  ...theme.typography.h4,
  margin: 0,
  color: theme.custom.colors.darkGray2,
})

export const BoardSubhead = styled.p({
  ...theme.typography.h5,
  margin: 0,
  color: theme.custom.colors.purple,
})

export const SolvedPill = styled.div({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  flexShrink: 0,
  padding: "12px 16px",
  borderRadius: "8px",
  border: `1px solid ${theme.custom.colors.silverGrayLight}`,
  backgroundColor: theme.custom.colors.white,
})

export const SolvedPillText = styled.span({
  ...theme.typography.body2Bold,
  whiteSpace: "nowrap",
  color: theme.custom.colors.darkGray2,
})

// ---------- Puzzle components ----------
// One puzzle row: the numbered badge alongside the clue and its answer field.
// Solved, it gains a 2px green outline and its number becomes a check.
export const PuzzleCard = styled.div<{ $solved?: boolean }>(({ $solved }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: "16px",
  padding: "16px",
  borderRadius: "8px",
  border: $solved
    ? `2px solid ${theme.custom.colors.green}`
    : `1px solid ${theme.custom.colors.lightGray2}`,
  backgroundColor: theme.custom.colors.lightGray1,
}))

export const PuzzleRowNumber = styled.div<{ $solved?: boolean }>(
  ({ $solved }) => ({
    ...theme.typography.h5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxSizing: "border-box",
    width: "32px",
    height: "32px",
    borderRadius: "32px",
    color: theme.custom.colors.white,
    // The check is drawn 40px wide and deliberately overhangs this 32px slot,
    // so a solved row carries no filled circle behind it.
    ...($solved
      ? {}
      : { backgroundColor: theme.custom.colors.silverGrayDark }),
  }),
)

export const PuzzleRowContent = styled.div({
  display: "flex",
  flex: 1,
  flexDirection: "column",
  // The design puts 8px between a row's header and its clue, and 12px before
  // the answer field; InputRow makes up the extra 4px.
  gap: "8px",
  minWidth: 0,
})

export const TokenTitleRow = styled.div({
  display: "flex",
  alignItems: "center",
  gap: "12px",
})

export const TokenLabel = styled.span({
  ...theme.typography.subtitle1,
  color: theme.custom.colors.darkGray2,
})

export const TokenSeparator = styled.span({
  ...theme.typography.body2,
  color: theme.custom.colors.silverGrayDark,
})

export const TokenCounter = styled.span({
  ...theme.typography.body1,
  flex: 1,
  minWidth: 0,
  color: theme.custom.colors.silverGrayDark,
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
  ...theme.typography.subhead1,
  margin: 0,
  color: theme.custom.colors.darkGray2,
})

// Rebus clues are a row of emoji and operator tokens at two different sizes.
export const RebusRow = styled.div({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "12px",
})

export const RebusEmoji = styled.span({
  fontFamily: theme.typography.fontFamily,
  fontWeight: theme.typography.fontWeightMedium,
  fontSize: "40px",
  lineHeight: "60px",
  color: theme.custom.colors.darkGray2,
})

export const RebusOperator = styled.span({
  ...theme.typography.h2,
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

// The scrambled letters, spread out with the design's one-em tracking. Narrow
// screens tighten it so a typical word still fits the row.
export const ScrambleClue = styled.div({
  ...theme.typography.h2,
  letterSpacing: "34px",
  overflowX: "auto",
  whiteSpace: "nowrap",
  color: theme.custom.colors.darkGray2,
  [theme.breakpoints.down("sm")]: {
    letterSpacing: "12px",
  },
})

export const InputRow = styled.div({
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
  marginTop: "4px",
})

// Solved, the field keeps its white surface but states the answer in bold green
// caps.
export const TextInput = styled.input<{ $solved?: boolean }>(({ $solved }) => ({
  ...theme.typography.body2,
  flex: 1,
  minWidth: 0,
  boxSizing: "border-box",
  height: "40px",
  padding: "8px 12px",
  borderRadius: "4px",
  border: `1px solid ${theme.custom.colors.silverGrayLight}`,
  backgroundColor: theme.custom.colors.white,
  color: theme.custom.colors.darkGray2,
  "::placeholder": {
    color: theme.custom.colors.silverGrayDark,
  },
  ":focus": {
    outline: `2px solid ${theme.custom.colors.mitRed}`,
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
// Once unlocked the panel grows a little bottom padding to sit under the
// revealed MIT connection.
export const FinalPanel = styled.div<{ $unlocked?: boolean }>(
  ({ $unlocked }) => ({
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    padding: $unlocked ? "16px 16px 24px" : "16px",
    borderRadius: "8px",
    border: `1px solid ${theme.custom.colors.purpleLight}`,
    backgroundColor: theme.custom.colors.purpleTint,
  }),
)

export const FinalBadge = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  boxSizing: "border-box",
  width: "32px",
  height: "32px",
  borderRadius: "32px",
  backgroundColor: theme.custom.colors.purple,
})

export const FinalContent = styled.div<{ $unlocked?: boolean }>(
  ({ $unlocked }) => ({
    display: "flex",
    flex: 1,
    flexDirection: "column",
    gap: $unlocked ? "16px" : "8px",
    minWidth: 0,
  }),
)

// The heading, note and slot row, grouped so the revealed connection sits below
// them with the wider gap.
export const FinalSummary = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
})

export const FinalTitle = styled.h2({
  ...theme.typography.h5,
  margin: 0,
  color: theme.custom.colors.darkGray2,
})

export const FinalNote = styled.p({
  ...theme.typography.body2,
  margin: 0,
  color: theme.custom.colors.darkGray2,
})

export const FinalSlotsRow = styled.div({
  display: "flex",
  alignItems: "center",
  gap: "8px",
})

export const FinalSlots = styled.div({
  display: "flex",
  flex: 1,
  alignItems: "center",
  gap: "16px",
  minWidth: 0,
})

export const FinalSlot = styled.div<{ $filled?: boolean }>(({ $filled }) => ({
  display: "flex",
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  boxSizing: "border-box",
  minWidth: 0,
  height: "48px",
  padding: "0 8px",
  borderRadius: "4px",
  border: `2px solid ${theme.custom.colors.purpleLight}`,
  backgroundColor: theme.custom.colors.purpleTintLight,
  color: theme.custom.colors.purpleDark,
  // Solved code words are set in caps at the heading scale so they fit the
  // slot; the unsolved "- - -" placeholder keeps the design's display size.
  ...($filled
    ? { ...theme.typography.h5, textTransform: "uppercase" as const }
    : theme.typography.h2),
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
}))

// A solved slot links out to the OCW courses that mention its code word.
export const FinalSlotButton = styled.button({
  background: "none",
  border: "none",
  padding: 0,
  font: "inherit",
  color: "inherit",
  // Form controls don't inherit text-transform from the slot by default, which
  // would leave a clickable code word in mixed case beside upper-case ones.
  textTransform: "inherit",
  cursor: "pointer",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  ":hover": {
    textDecoration: "underline",
  },
})

export const FinalLock = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  boxSizing: "border-box",
  width: "72px",
  height: "60px",
  padding: "2px 7px",
})

// ---------- Today's MIT connection ----------
// Revealed inside the final-code panel once the code is cracked.
export const RevealCard = styled.div({
  display: "flex",
  alignItems: "flex-start",
  gap: "8px",
  padding: "16px",
  borderRadius: "4px",
  border: `2px solid ${theme.custom.colors.purpleLight}`,
  backgroundColor: theme.custom.colors.white,
})

export const RevealBadge = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  boxSizing: "border-box",
  width: "80px",
  height: "80px",
  padding: "8px",
  borderRadius: "40px",
  border: `1px solid ${theme.custom.colors.silverGrayLight}`,
  backgroundColor: theme.custom.colors.white,
  fontSize: "40px",
  lineHeight: "26px",
})

export const RevealContent = styled.div({
  display: "flex",
  flex: 1,
  flexDirection: "column",
  gap: "8px",
  minWidth: 0,
})

export const RevealTitle = styled.h2({
  ...theme.typography.h5,
  margin: 0,
  color: theme.custom.colors.purple,
})

export const RevealBody = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
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
})

export const RevealLinkLabel = styled.p({
  ...theme.typography.body2Bold,
  margin: 0,
  color: theme.custom.colors.darkGray2,
})

export const RevealLinkRow = styled.div({
  display: "flex",
  alignItems: "center",
  gap: "4px",
})

export const RevealLink = styled.a({
  ...theme.typography.body2,
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

export const GameLink = styled.a({
  color: theme.custom.colors.mitRed,
  textDecoration: "none",
  ":hover": {
    textDecoration: "underline",
  },
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

export const TimImg = styled.img({
  pointerEvents: "none",
  position: "fixed",
  left: 0,
  top: 0,
  zIndex: 80,
  height: "64px",
  width: "64px",
  borderRadius: "12px",
  objectFit: "cover",
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
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
  gap: "32px",
  [theme.breakpoints.down("sm")]: {
    gap: "24px",
  },
})

// ---------- How to play ----------
export const BoardSide = styled.div({
  width: "100%",
  maxWidth: "304px",
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

export const SideTerm = styled.span({
  fontWeight: theme.typography.fontWeightBold,
})

// ---------- Board controls ----------
// The puzzle-date row beneath the board card.
export const BoardControls = styled.div({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "12px",
  padding: "24px 40px 0",
  [theme.breakpoints.down("sm")]: {
    padding: "24px 24px 0",
  },
})

export const BoardControlsMeta = styled.div({
  ...theme.typography.body2,
  flex: 1,
  minWidth: "140px",
  color: theme.custom.colors.silverGrayDark,
})

// A secondary panel inside the board card: loading and empty states, and the
// OCW course matches for a solved code word.
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

export const OcwBody = styled.div({
  ...theme.typography.body2,
  color: theme.custom.colors.darkGray1,
})

export const OcwHeading = styled.div({
  fontWeight: theme.typography.fontWeightMedium,
  marginBottom: "8px",
})

export const OcwNote = styled.div({
  ...theme.typography.body3,
  color: theme.custom.colors.silverGray,
})

export const OcwList = styled.ul({
  listStyle: "disc",
  listStylePosition: "inside",
  margin: 0,
  padding: 0,
  display: "flex",
  flexDirection: "column",
  gap: "4px",
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
