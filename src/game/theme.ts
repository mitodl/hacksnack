// Minimal, self-contained design tokens vendored from the MIT Learn design
// system (@mitodl/smoot-design). The game only reads a handful of colors and
// typography variants directly off this object, so we copy just those values
// here to avoid depending on the full design system.

const pxToRem = (px: number) => `${px / 16}rem`

const fontFamily = "neue-haas-grotesk-text, sans-serif"

const fontWeights = {
  roman: 400,
  medium: 500,
  bold: 700,
} as const

const variant = (
  fontWeight: number,
  size: number,
  line: number,
  extra: Record<string, string> = {},
) => ({
  fontFamily,
  fontWeight,
  fontStyle: "normal" as const,
  fontSize: pxToRem(size),
  lineHeight: pxToRem(line),
  ...extra,
})

const colors = {
  mitRed: "#750014",
  black: "#000000",
  white: "#FFFFFF",
  darkGray2: "#212326",
  darkGray1: "#40464C",
  silverGrayDark: "#626A73",
  silverGray: "#8B959E",
  silverGrayLight: "#B8C2CC",
  lightGray2: "#DDE1E6",
  lightGray1: "#F3F4F8",
  darkGreen: "#004D1A",
} as const

export const typography = {
  fontFamily,
  fontWeightLight: fontWeights.roman,
  fontWeightRegular: fontWeights.roman,
  fontWeightMedium: fontWeights.medium,
  fontWeightBold: fontWeights.bold,
  h4: variant(fontWeights.bold, 24, 30),
  h5: variant(fontWeights.bold, 18, 26),
  subtitle2: variant(fontWeights.medium, 14, 18),
  subtitle3: variant(fontWeights.medium, 12, 16),
  body1: variant(fontWeights.roman, 16, 20),
  body2: variant(fontWeights.roman, 14, 18),
  body3: variant(fontWeights.roman, 12, 16),
  button: variant(fontWeights.medium, 14, 18, { textTransform: "none" }),
} as const

// MUI-compatible breakpoint helpers (only `up` is used by the game, but `down`
// and `between` are provided for parity). Values match MUI's defaults.
const breakpointValues = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
} as const

type BreakpointKey = keyof typeof breakpointValues

const resolve = (key: BreakpointKey | number): number =>
  typeof key === "number" ? key : breakpointValues[key]

const breakpoints = {
  values: breakpointValues,
  up: (key: BreakpointKey | number) =>
    `@media (min-width:${resolve(key)}px)`,
  down: (key: BreakpointKey | number) =>
    `@media (max-width:${resolve(key) - 0.05}px)`,
  between: (start: BreakpointKey | number, end: BreakpointKey | number) =>
    `@media (min-width:${resolve(start)}px) and (max-width:${resolve(end) - 0.05}px)`,
} as const

export const theme = {
  custom: { colors },
  typography,
  breakpoints,
} as const
