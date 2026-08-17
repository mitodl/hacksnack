import React from "react"
import styled from "@emotion/styled"

// Icons exported from the MIT Design System Figma file. The path data and fill
// values are copied verbatim from those SVG exports, so they are intentionally
// literal hex rather than theme tokens.
//
// Each icon keeps the geometry it has in the design: an outer box at the
// designed size, and the artwork ("leaf") inset inside that box by the
// percentages Figma reports. Because the inset is proportional, an icon keeps
// its exact designed proportions at whichever box size the design asks for.

const IconBox = styled.span<{ $size: number }>(({ $size }) => ({
  position: "relative",
  display: "block",
  flexShrink: 0,
  width: `${$size}px`,
  height: `${$size}px`,
  overflow: "hidden",
}))

/** Positions the artwork inside the box exactly as Figma insets it. */
const Leaf = styled.svg<{ $inset: string }>(({ $inset }) => ({
  position: "absolute",
  display: "block",
  inset: $inset,
  width: "auto",
  height: "auto",
}))

type IconProps = { size?: number }

/** Star in the "N of M solved" pill. */
export function StarIcon({ size = 22 }: IconProps) {
  return (
    <IconBox $size={size} aria-hidden>
      <Leaf
        $inset="2.08% 2.44% 7.47% 2.45%"
        viewBox="0 0 20.9232 19.8992"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.4617 16.28L3.99599 19.8992L5.44004 12.6316L0 7.60082L7.35812 6.72839L10.4617 0L13.5651 6.72839L20.9232 7.60082L15.4832 12.6316L16.9273 19.8992L10.4617 16.28Z"
          fill="#FAB005"
        />
      </Leaf>
    </IconBox>
  )
}

/** Lightbulb beside each puzzle's "Hint" link. */
export function HintIcon({ size = 18 }: IconProps) {
  return (
    <IconBox $size={size} aria-hidden>
      <Leaf
        $inset="8.33% 16.67% 4.17% 16.67%"
        viewBox="0 0 12 15.75"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.47981 12H5.25V8.25H6.75V12H7.52018C7.61918 11.0988 8.07908 10.3549 8.8257 9.54195C8.90978 9.45045 9.4491 8.8923 9.51307 8.81258C10.1488 8.01983 10.5 7.03875 10.5 6C10.5 3.51472 8.48527 1.5 6 1.5C3.51472 1.5 1.5 3.51472 1.5 6C1.5 7.03822 1.8508 8.01877 2.48597 8.8113C2.55003 8.89125 3.09061 9.4509 3.17365 9.54135C3.92074 10.3548 4.38077 11.0988 4.47981 12ZM4.5 13.5V14.25H7.5V13.5H4.5ZM1.31546 9.7494C0.492338 8.72227 0 7.41862 0 6C0 2.68629 2.68629 0 6 0C9.31373 0 12 2.68629 12 6C12 7.41938 11.5071 8.72363 10.6832 9.75105C10.218 10.3311 9 11.25 9 12.375V14.25C9 15.0784 8.32845 15.75 7.5 15.75H4.5C3.67157 15.75 3 15.0784 3 14.25V12.375C3 11.25 1.78094 10.3302 1.31546 9.7494Z"
          fill="#A31F34"
        />
      </Leaf>
    </IconBox>
  )
}

/**
 * Closed padlock. White inside the Unlock button; black beside the final code.
 */
export function LockIcon({
  size = 24,
  color = "white",
}: IconProps & { color?: string }) {
  return (
    <IconBox $size={size} aria-hidden>
      <Leaf
        $inset="8.33% 12.5%"
        viewBox="0 0 18 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 8H17C17.5523 8 18 8.4477 18 9V19C18 19.5523 17.5523 20 17 20H1C0.44772 20 0 19.5523 0 19V9C0 8.4477 0.44772 8 1 8H2V7C2 3.13401 5.13401 0 9 0C12.866 0 16 3.13401 16 7V8ZM14 8V7C14 4.23858 11.7614 2 9 2C6.23858 2 4 4.23858 4 7V8H14ZM8 12V16H10V12H8Z"
          fill={color}
        />
      </Leaf>
    </IconBox>
  )
}

/** Open padlock: the solved counterpart of LockIcon. */
export function UnlockedIcon({
  size = 24,
  color = "#008000",
}: IconProps & { color?: string }) {
  return (
    <IconBox $size={size} aria-hidden>
      <Leaf
        $inset="8.33% 12.5%"
        viewBox="0 0 18 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 8H17C17.5523 8 18 8.4477 18 9V19C18 19.5523 17.5523 20 17 20H1C0.44772 20 0 19.5523 0 19V9C0 8.4477 0.44772 8 1 8H2V7C2 3.13401 5.13401 0 9 0C11.7405 0 14.1131 1.5748 15.2624 3.86882L13.4731 4.76344C12.6522 3.12486 10.9575 2 9 2C6.23858 2 4 4.23858 4 7V8ZM7 13V15H11V13H7Z"
          fill={color}
        />
      </Leaf>
    </IconBox>
  )
}

/** Trophy in the Final Code badge. */
export function TrophyIcon({ size = 20 }: IconProps) {
  return (
    <IconBox $size={size} aria-hidden>
      <Leaf
        $inset="12.51% 4.15% 12.49% 4.19%"
        viewBox="0 0 18.3333 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 11.6151V13.3333H14.1667V15H4.16667V13.3333H8.33335V11.6151C5.04474 11.205 2.5 8.39971 2.5 5V0H15.8333V5C15.8333 8.39971 13.2886 11.205 10 11.6151ZM4.16667 1.66667V5C4.16667 7.76146 6.40524 9.99996 9.16668 9.99996C11.9281 9.99996 14.1667 7.76146 14.1667 5V1.66667H4.16667ZM0 1.66667H1.66667V5H0V1.66667ZM16.6667 1.66667H18.3333V5H16.6667V1.66667Z"
          fill="white"
        />
      </Leaf>
    </IconBox>
  )
}

/**
 * The tick shown in a solved row's count badge. The badge itself supplies the
 * green disc behind it, so this is just the check.
 */
export function CheckIcon({ size = 18 }: IconProps) {
  return (
    <IconBox $size={size} aria-hidden>
      <Leaf
        $inset="24.91% 14.14% 25% 15.15%"
        viewBox="0 0 12.7279 9.01558"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.77297 6.89429L11.6673 0L12.7279 1.06066L4.77297 9.01558L0 4.24266L1.06067 3.18201L4.77297 6.89429Z"
          fill="white"
        />
      </Leaf>
    </IconBox>
  )
}

/** Gamepad beside the "How to play" heading. */
export function HowToPlayIcon({ size = 24 }: IconProps) {
  return (
    <IconBox $size={size} aria-hidden>
      <Leaf
        $inset="16.67% 4.17%"
        viewBox="0 0 22 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 0C19.3137 0 22 2.68629 22 6V10C22 13.3137 19.3137 16 16 16H6C2.68629 16 0 13.3137 0 10V6C0 2.68629 2.68629 0 6 0H16ZM16 2H6C3.8578 2 2.10892 3.68397 2.0049 5.80036L2 6V10C2 12.1422 3.68397 13.8911 5.80036 13.9951L6 14H16C18.1422 14 19.8911 12.316 19.9951 10.1996L20 10V6C20 3.8578 18.316 2.10892 16.1996 2.0049L16 2ZM9 5V7H11V9H8.999L9 11H7L6.999 9H5V7H7V5H9ZM17 9V11H15V9H17ZM15 5V7H13V5H15Z"
          fill="#212326"
        />
      </Leaf>
    </IconBox>
  )
}

/** "Opens in a new tab" glyph after the course link. */
export function ExternalLinkIcon({ size = 16 }: IconProps) {
  return (
    <IconBox $size={size} aria-hidden>
      <Leaf
        $inset="20.83% 20.83% 12.5% 12.5%"
        viewBox="0 0 10.6667 10.6667"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.66667 0.666667V2H1.33333V9.33333H8.66667V6H10V10C10 10.3682 9.70153 10.6667 9.33333 10.6667H0.666667C0.29848 10.6667 0 10.3682 0 10V1.33333C0 0.965147 0.29848 0.666667 0.666667 0.666667H4.66667ZM10.6667 0V5.33333H9.33333L9.33327 2.27533L6.13807 5.4714L5.19526 4.5286L8.38993 1.33333H5.33333V0H10.6667Z"
          fill="#A31F34"
        />
      </Leaf>
    </IconBox>
  )
}

// Chrome for the board's controls. Unlike the icons above these are not brand
// artwork, so they take the colour of the button they sit in — including
// whatever it fades to when disabled. Paths are Remix Icon's
// arrow-left-s / arrow-right-s / refresh, the set the design system draws from.
export function ChevronLeftIcon({ size = 20 }: IconProps) {
  return (
    <IconBox $size={size} aria-hidden>
      <Leaf
        $inset="0"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z"
          fill="currentColor"
        />
      </Leaf>
    </IconBox>
  )
}

export function ChevronRightIcon({ size = 20 }: IconProps) {
  return (
    <IconBox $size={size} aria-hidden>
      <Leaf
        $inset="0"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"
          fill="currentColor"
        />
      </Leaf>
    </IconBox>
  )
}

export function RestartIcon({ size = 20 }: IconProps) {
  return (
    <IconBox $size={size} aria-hidden>
      <Leaf
        $inset="0"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.46257 4.43262C7.21556 2.91688 9.5007 2 12 2C17.5228 2 22 6.47715 22 12C22 14.1361 21.3302 16.1158 20.1892 17.7406L17 12H20C20 7.58172 16.4183 4 12 4C9.84982 4 7.89777 4.84827 6.46023 6.22842L5.46257 4.43262ZM18.5374 19.5674C16.7844 21.0831 14.4993 22 12 22C6.47715 22 2 17.5228 2 12C2 9.86386 2.66979 7.88416 3.8108 6.25944L7 12H4C4 16.4183 7.58172 20 12 20C14.1502 20 16.1022 19.1517 17.5398 17.7716L18.5374 19.5674Z"
          fill="currentColor"
        />
      </Leaf>
    </IconBox>
  )
}
