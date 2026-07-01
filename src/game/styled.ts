import styled from "@emotion/styled"
import { theme } from "./theme"

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

export const CardRoot = styled.div({
  borderRadius: "16px",
  border: `1px solid ${theme.custom.colors.lightGray2}`,
  backgroundColor: `${theme.custom.colors.white}f2`,
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  padding: "24px",
})

export const StyledButton = styled.button<{ $solved?: boolean }>(
  ({ $solved }) => ({
    ...theme.typography.button,
    padding: "8px 16px",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "background-color 150ms ease, transform 150ms ease",
    backgroundColor: $solved
      ? theme.custom.colors.darkGreen
      : theme.custom.colors.darkGray2,
    color: theme.custom.colors.white,
    border: "none",
    ":hover": {
      backgroundColor: $solved
        ? theme.custom.colors.darkGreen
        : theme.custom.colors.black,
    },
    ":active": {
      transform: "scale(0.98)",
    },
    ":disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  }),
)

// ---------- Sentence preview ----------
export const PlaceholderSpan = styled.span<{ filled: boolean }>(
  ({ filled }) => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
    padding: "4px 8px",
    ...(filled
      ? {
          backgroundColor: theme.custom.colors.white,
          color: theme.custom.colors.darkGray1,
          ...theme.typography.subtitle2,
          border: `1px solid ${theme.custom.colors.darkGreen}`,
        }
      : {
          backgroundColor: theme.custom.colors.lightGray1,
          border: `1px solid ${theme.custom.colors.lightGray2}`,
          color: theme.custom.colors.silverGray,
          ...theme.typography.body3,
        }),
  }),
)

export const ProgressCardInner = styled.div({
  padding: "16px",
})

export const ProgressHeaderRow = styled.div({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "12px",
})

export const SectionLabel = styled.div({
  ...theme.typography.body3,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: theme.custom.colors.silverGray,
  marginBottom: "8px",
})

export const FooterAction = styled.div({
  ...theme.typography.body2,
})

export const TokensRow = styled.div({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "flex-end",
  gap: "8px",
})

export const ClickableToken = styled.span<{ $clickable: boolean }>(
  ({ $clickable }) => ({
    cursor: $clickable ? "pointer" : "default",
  }),
)

// ---------- Puzzle components ----------
export const PuzzleCard = styled.div({
  borderRadius: "16px",
  border: `1px solid ${theme.custom.colors.lightGray2}`,
  backgroundColor: `${theme.custom.colors.white}f2`,
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  padding: "24px",
})

export const TokenTitleWrap = styled.div({
  marginBottom: "16px",
})

export const TokenTitleRow = styled.div({
  ...theme.typography.body2,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: theme.custom.colors.silverGray,
})

export const HintButton = styled.button({
  ...theme.typography.body2,
  textTransform: "none",
  color: theme.custom.colors.mitRed,
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 0,
  ":hover": {
    textDecoration: "underline",
  },
})

export const QuestionHeading = styled.h2({
  ...theme.typography.h5,
  margin: "0 0 16px",
  color: theme.custom.colors.darkGray1,
})

export const InputRow = styled.div({
  display: "flex",
  gap: "8px",
})

export const TextInput = styled.input({
  ...theme.typography.body1,
  flex: 1,
  borderRadius: "12px",
  border: `1px solid ${theme.custom.colors.lightGray2}`,
  padding: "8px 16px",
  ":focus": {
    outline: `2px solid ${theme.custom.colors.silverGrayLight}`,
    outlineOffset: "-1px",
  },
})

export const Message = styled.p({
  ...theme.typography.body2,
  marginTop: "12px",
  color: theme.custom.colors.silverGrayDark,
})

export const EmojiPrompt = styled.h2({
  fontSize: "3rem",
  // Intentional semibold; not part of the theme's 400/500/700 weight tokens.
  // eslint-disable-next-line no-restricted-syntax
  fontWeight: 600,
  lineHeight: 1.25,
  margin: "0 0 24px",
  wordBreak: "break-word",
  color: theme.custom.colors.darkGray1,
})

// Equation clues reuse the rebus prompt styling but in a monospace face so the
// math symbols line up.
export const EquationPrompt = styled(EmojiPrompt)({
  fontFamily: "Lucida Sans Console, monospace",
})

export const MonoClue = styled.div({
  fontFamily: "monospace",
  fontSize: "1.875rem",
  letterSpacing: "0.1em",
  marginBottom: "16px",
  color: theme.custom.colors.darkGray1,
})

export const SmallPrompt = styled.h2({
  ...theme.typography.body2,
  margin: "0 0 16px",
  color: theme.custom.colors.silverGrayDark,
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

export const LinkRow = styled.div({
  ...theme.typography.body2,
  marginTop: "8px",
})

export const GameLink = styled.a({
  color: theme.custom.colors.mitRed,
  textDecoration: "none",
  ":hover": {
    textDecoration: "underline",
  },
})

export const ImageSolvedFrame = styled.div({
  margin: "0 auto",
  borderRadius: "12px",
  overflow: "hidden",
  border: `10px solid ${theme.custom.colors.darkGreen}`,
})

export const ImageSolvedInner = styled.div({
  height: "100%",
  width: "100%",
})

export const PuzzleGrid = styled.div({
  margin: "0 auto",
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

export const Strong = styled.span({
  // Intentional semibold; not part of the theme's 400/500/700 weight tokens.
  // eslint-disable-next-line no-restricted-syntax
  fontWeight: 600,
})

export const SecondaryButton = styled.button({
  ...theme.typography.button,
  padding: "8px 16px",
  borderRadius: "12px",
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

export const Shell = styled.div({
  margin: "0 auto",
  maxWidth: "768px",
  padding: "40px 16px",
})

export const GameHeader = styled.header({
  marginBottom: "24px",
  display: "grid",
  gridTemplateColumns: "auto minmax(0, 1fr)",
  alignItems: "start",
  columnGap: "16px",
  rowGap: "8px",
  [theme.breakpoints.up("md")]: {
    gridTemplateColumns: "auto auto minmax(0, 1fr)",
    gap: "24px",
  },
})

export const IconWrap = styled.div({
  display: "flex",
  alignItems: "flex-start",
})

export const GameIcon = styled.img({
  height: "80px",
  width: "80px",
  borderRadius: "8px",
  objectFit: "cover",
})

export const TitleCol = styled.div({
  paddingTop: "4px",
})

export const GameTitle = styled.h1({
  fontSize: "3.75rem",
  fontWeight: theme.typography.fontWeightBold,
  lineHeight: 1,
  letterSpacing: "-0.02em",
  margin: 0,
  color: theme.custom.colors.mitRed,
  [theme.breakpoints.up("sm")]: {
    fontSize: "5rem",
  },
})

export const MobileLinks = styled.div({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "4px 20px",
  marginTop: "4px",
  [theme.breakpoints.up("md")]: {
    display: "none",
  },
})

export const LearnLink = styled.a({
  ...theme.typography.subtitle3,
  display: "inline-flex",
  color: theme.custom.colors.mitRed,
  textDecoration: "none",
  ":hover": {
    textDecoration: "underline",
  },
})

export const HeaderRight = styled.div({
  gridColumnStart: 2,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  textAlign: "left",
  [theme.breakpoints.up("md")]: {
    gridColumnStart: "auto",
    paddingTop: "20px",
    alignItems: "flex-end",
    textAlign: "right",
  },
})

export const DesktopLinks = styled.div({
  display: "none",
  [theme.breakpoints.up("md")]: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "4px 20px",
  },
})

export const Timer = styled.div({
  ...theme.typography.h5,
  marginTop: "4px",
  whiteSpace: "nowrap",
  fontFamily: "monospace",
  fontVariantNumeric: "tabular-nums",
  color: theme.custom.colors.silverGrayDark,
})

export const ProgressArea = styled.div({
  marginBottom: "24px",
})

export const LinkButton = styled.button({
  ...theme.typography.subtitle3,
  background: "none",
  border: "none",
  padding: 0,
  cursor: "pointer",
  color: theme.custom.colors.mitRed,
  ":hover": {
    textDecoration: "underline",
  },
})

export const Stack = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "20px",
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

export const MobileNav = styled.div({
  display: "flex",
  justifyContent: "space-between",
  [theme.breakpoints.up("md")]: {
    display: "none",
  },
})

export const NavButton = styled.button({
  ...theme.typography.subtitle2,
  padding: "8px 16px",
  borderRadius: "12px",
  border: `1px solid ${theme.custom.colors.lightGray2}`,
  backgroundColor: theme.custom.colors.white,
  color: theme.custom.colors.darkGray1,
  cursor: "pointer",
  ":disabled": {
    opacity: 0.3,
    cursor: "not-allowed",
  },
})

export const DesktopNav = styled.div({
  display: "flex",
  alignItems: "stretch",
  gap: "16px",
})

export const NavArrow = styled.button({
  display: "none",
  [theme.breakpoints.up("md")]: {
    display: "flex",
    width: "56px",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "16px",
    border: `1px solid ${theme.custom.colors.lightGray2}`,
    backgroundColor: theme.custom.colors.white,
    fontSize: "1.875rem",
    // Intentional semibold; not part of the theme's 400/500/700 weight tokens.
    // eslint-disable-next-line no-restricted-syntax
    fontWeight: 600,
    color: theme.custom.colors.darkGray1,
    cursor: "pointer",
    transition: "background-color 150ms ease",
    ":hover": {
      backgroundColor: theme.custom.colors.lightGray1,
    },
    ":disabled": {
      opacity: 0.3,
      cursor: "not-allowed",
    },
  },
})

export const NavContent = styled.div<{ $solved?: boolean }>(({ $solved }) => ({
  flex: 1,
  ...($solved
    ? {
        borderRadius: "16px",
        border: `10px solid ${theme.custom.colors.darkGreen}`,
        padding: "4px",
      }
    : {}),
}))

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

export const Footer = styled.footer({
  ...theme.typography.body3,
  marginTop: "40px",
  color: theme.custom.colors.silverGrayDark,
})

export const DateButtons = styled.div({
  marginTop: "12px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
})

export const OverlayBackdrop = styled.div({
  position: "fixed",
  inset: 0,
  zIndex: 60,
  backgroundColor: "rgba(10, 10, 10, 0.45)",
  backdropFilter: "blur(4px)",
})

export const OverlayWrap = styled.div({
  position: "fixed",
  zIndex: 65,
})

export const OverlayPanel = styled.div({
  maxHeight: "100%",
  overflowY: "auto",
  borderRadius: "24px",
  border: `1px solid ${theme.custom.colors.lightGray2}`,
  backgroundColor: `${theme.custom.colors.white}f2`,
  padding: "16px",
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  [theme.breakpoints.up("sm")]: {
    padding: "24px",
  },
})

export const OverlayHead = styled.div({
  marginBottom: "16px",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "16px",
})

export const OverlayHeadInner = styled.div({
  display: "flex",
  minWidth: 0,
  flex: 1,
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "24px",
})

export const OverlayKicker = styled.div({
  ...theme.typography.body3,
  textTransform: "uppercase",
  letterSpacing: "0.28em",
  color: theme.custom.colors.silverGray,
})

export const OverlaySentence = styled.div({
  ...theme.typography.h5,
  color: theme.custom.colors.darkGray2,
  wordBreak: "break-word",
})

export const OverlayMeta = styled.div({
  ...theme.typography.body2,
  marginTop: "4px",
  color: theme.custom.colors.silverGray,
})

export const CloseButton = styled.button({
  ...theme.typography.subtitle3,
  borderRadius: "999px",
  border: `1px solid ${theme.custom.colors.lightGray2}`,
  padding: "6px 12px",
  color: theme.custom.colors.silverGrayDark,
  backgroundColor: theme.custom.colors.white,
  cursor: "pointer",
  transition: "background-color 150ms ease",
  ":hover": {
    backgroundColor: theme.custom.colors.lightGray1,
  },
})

export const FunFactAnchor = styled.div({
  pointerEvents: "none",
  position: "absolute",
  left: "24px",
  top: "24px",
  height: "64px",
  width: "64px",
  opacity: 0,
})

export const FunFactRow = styled.div({
  display: "flex",
  alignItems: "center",
  gap: "16px",
})

export const FunFactImg = styled.img({
  height: "64px",
  width: "64px",
  borderRadius: "12px",
  objectFit: "cover",
})

export const FunFactLink = styled.a({
  ...theme.typography.h5,
  display: "block",
  marginTop: "4px",
  color: theme.custom.colors.mitRed,
  textDecoration: "none",
  ":hover": {
    textDecoration: "underline",
  },
})

export const FunFactName = styled.div({
  ...theme.typography.h5,
  marginTop: "4px",
  color: theme.custom.colors.darkGray2,
})

export const FunFactText = styled.p({
  ...theme.typography.body2,
  marginTop: "12px",
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

export const FactPlaceholder = styled.div({
  height: "224px",
  borderRadius: "12px",
  background: `linear-gradient(to right, ${theme.custom.colors.lightGray2}, ${theme.custom.colors.lightGray1})`,
})
