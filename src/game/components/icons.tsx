import React from "react"
import styled from "@emotion/styled"

// Icons exported from the Figma board design (UX-Wireframes, node 20094:590510).
// The path data and `fill` values are copied verbatim from those SVG exports, so
// they are intentionally literal hex rather than theme tokens.
//
// Each icon keeps the geometry it has in the design: an outer box at the
// designed size, and the artwork ("leaf") at its own explicit size, offset
// inside that box by the inset Figma gives it. Sizes are therefore fixed rather
// than relative — an icon never stretches to its container.

const IconBox = styled.span<{ $size: number }>(({ $size }) => ({
  position: "relative",
  display: "block",
  flexShrink: 0,
  width: `${$size}px`,
  height: `${$size}px`,
  overflow: "hidden",
}))

const leafStyle = (top: string, left: string) =>
  ({ position: "absolute", display: "block", top, left }) as const

/** Star in the "N of M solved" pill. Outer 24, leaf 22.83 x 21.71. */
export function StarIcon() {
  return (
    <IconBox $size={24} aria-hidden>
      <svg
        width="22.8253"
        height="21.7082"
        viewBox="0 0 22.8253 21.7082"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={leafStyle("2.08%", "2.45%")}
      >
        <path
          d="M11.4127 17.76L4.35926 21.7082L5.93459 13.7799L0 8.2918L8.02704 7.34006L11.4127 0L14.7983 7.34006L22.8253 8.2918L16.8908 13.7799L18.4661 21.7082L11.4127 17.76Z"
          fill="#FAB005"
        />
      </svg>
    </IconBox>
  )
}

/** Lightbulb beside each puzzle's "Hint" link. Outer 18, leaf 12 x 15.75. */
export function HintIcon() {
  return (
    <IconBox $size={18} aria-hidden>
      <svg
        width="12"
        height="15.75"
        viewBox="0 0 12 15.75"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={leafStyle("8.33%", "16.67%")}
      >
        <path
          d="M4.47981 12H5.25V8.25H6.75V12H7.52018C7.61918 11.0988 8.07908 10.3549 8.8257 9.54195C8.90978 9.45045 9.4491 8.8923 9.51307 8.81258C10.1488 8.01983 10.5 7.03875 10.5 6C10.5 3.51472 8.48527 1.5 6 1.5C3.51472 1.5 1.5 3.51472 1.5 6C1.5 7.03822 1.8508 8.01877 2.48597 8.8113C2.55003 8.89125 3.09061 9.4509 3.17365 9.54135C3.92074 10.3548 4.38077 11.0988 4.47981 12ZM4.5 13.5V14.25H7.5V13.5H4.5ZM1.31546 9.7494C0.492338 8.72227 0 7.41862 0 6C0 2.68629 2.68629 0 6 0C9.31373 0 12 2.68629 12 6C12 7.41938 11.5071 8.72363 10.6832 9.75105C10.218 10.3311 9 11.25 9 12.375V14.25C9 15.0784 8.32845 15.75 7.5 15.75H4.5C3.67157 15.75 3 15.0784 3 14.25V12.375C3 11.25 1.78094 10.3302 1.31546 9.7494Z"
          fill="#A31F34"
        />
      </svg>
    </IconBox>
  )
}

/** Padlock inside the Unlock button. Outer 20, leaf 15 x 16.67. */
export function LockIcon() {
  return (
    <IconBox $size={20} aria-hidden>
      <svg
        width="15"
        height="16.6667"
        viewBox="0 0 15 16.6667"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={leafStyle("8.33%", "12.5%")}
      >
        <path
          d="M13.3333 6.66667H14.1667C14.6269 6.66667 15 7.03975 15 7.5V15.8333C15 16.2936 14.6269 16.6667 14.1667 16.6667H0.833333C0.3731 16.6667 0 16.2936 0 15.8333V7.5C0 7.03975 0.3731 6.66667 0.833333 6.66667H1.66667V5.83333C1.66667 2.61168 4.27834 0 7.5 0C10.7217 0 13.3333 2.61168 13.3333 5.83333V6.66667ZM11.6667 6.66667V5.83333C11.6667 3.53215 9.80117 1.66667 7.5 1.66667C5.19882 1.66667 3.33333 3.53215 3.33333 5.83333V6.66667H11.6667ZM6.66667 10V13.3333H8.33333V10H6.66667Z"
          fill="white"
        />
      </svg>
    </IconBox>
  )
}

/**
 * The green check that replaces a solved row's number. Its 40px box is wider
 * than the 32px slot it sits in — by design it overhangs 4px on every side.
 */
export function CheckCircleIcon() {
  return (
    <IconBox $size={40} aria-hidden>
      <svg
        width="33.3333"
        height="33.3333"
        viewBox="0 0 33.3333 33.3333"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={leafStyle("8.33%", "8.33%")}
      >
        <path
          d="M16.6667 33.3333C7.46192 33.3333 0 25.8713 0 16.6667C0 7.46192 7.46192 0 16.6667 0C25.8713 0 33.3333 7.46192 33.3333 16.6667C33.3333 25.8713 25.8713 33.3333 16.6667 33.3333ZM15.0043 23.3333L26.7895 11.5482L24.4325 9.1912L15.0043 18.6193L10.2903 13.9052L7.93332 16.2623L15.0043 23.3333Z"
          fill="#008000"
        />
      </svg>
    </IconBox>
  )
}

/** Open padlock inside the Unlocked button. Outer 20, leaf 15 x 16.67. */
export function UnlockedIcon() {
  return (
    <IconBox $size={20} aria-hidden>
      <svg
        width="15"
        height="16.6667"
        viewBox="0 0 15 16.6667"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={leafStyle("8.33%", "12.5%")}
      >
        <path
          d="M3.33333 6.66667H14.1667C14.6269 6.66667 15 7.03975 15 7.5V15.8333C15 16.2936 14.6269 16.6667 14.1667 16.6667H0.833333C0.3731 16.6667 0 16.2936 0 15.8333V7.5C0 7.03975 0.3731 6.66667 0.833333 6.66667H1.66667V5.83333C1.66667 2.61168 4.27834 0 7.5 0C9.78375 0 11.7609 1.31233 12.7187 3.22402L11.2276 3.96953C10.5435 2.60405 9.13125 1.66667 7.5 1.66667C5.19882 1.66667 3.33333 3.53215 3.33333 5.83333V6.66667ZM5.83333 10.8333V12.5H9.16667V10.8333H5.83333Z"
          fill="white"
        />
      </svg>
    </IconBox>
  )
}

/** Trophy in the Final Code badge. Outer 20, leaf fills it. */
export function TrophyIcon() {
  return (
    <IconBox $size={20} aria-hidden>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={leafStyle("0", "0")}
      >
        <path
          d="M10.8374 14.1174V15.8356H15.0041V17.5023H5.00407V15.8356H9.17075V14.1174C5.88214 13.7073 3.3374 10.902 3.3374 7.50229V2.50229H16.6707V7.50229C16.6707 10.902 14.126 13.7073 10.8374 14.1174ZM5.00407 4.16896V7.50229C5.00407 10.2638 7.24264 12.5023 10.0041 12.5023C12.7655 12.5023 15.0041 10.2638 15.0041 7.50229V4.16896H5.00407ZM0.8374 4.16896H2.50407V7.50229H0.8374V4.16896ZM17.5041 4.16896H19.1707V7.50229H17.5041V4.16896Z"
          fill="white"
        />
      </svg>
    </IconBox>
  )
}

/** Large padlock at the end of the final-code row. Outer 40, leaf fills it. */
export function BigLockIcon() {
  return (
    <IconBox $size={40} aria-hidden>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={leafStyle("0", "0")}
      >
        <path
          d="M31.6667 16.6667H33.3333C34.2538 16.6667 35 17.4128 35 18.3333V35C35 35.9205 34.2538 36.6667 33.3333 36.6667H6.66667C5.7462 36.6667 5 35.9205 5 35V18.3333C5 17.4128 5.7462 16.6667 6.66667 16.6667H8.33333V15C8.33333 8.55668 13.5567 3.33333 20 3.33333C26.4433 3.33333 31.6667 8.55668 31.6667 15V16.6667ZM8.33333 20V33.3333H31.6667V20H8.33333ZM18.3333 23.3333H21.6667V30H18.3333V23.3333ZM28.3333 16.6667V15C28.3333 10.3976 24.6023 6.66667 20 6.66667C15.3976 6.66667 11.6667 10.3976 11.6667 15V16.6667H28.3333Z"
          fill="#9933FF"
        />
      </svg>
    </IconBox>
  )
}

/** The final-code padlock, sprung open once every clue is solved. Outer 40. */
export function BigUnlockedIcon() {
  return (
    <IconBox $size={40} aria-hidden>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={leafStyle("0", "0")}
      >
        <path
          d="M11.6667 16.6667H33.3333C34.2538 16.6667 35 17.4128 35 18.3333V35C35 35.9205 34.2538 36.6667 33.3333 36.6667H6.66667C5.7462 36.6667 5 35.9205 5 35V18.3333C5 17.4128 5.7462 16.6667 6.66667 16.6667H8.33333V15C8.33333 8.55668 13.5567 3.33333 20 3.33333C24.5675 3.33333 28.5218 5.958 30.4373 9.78137L27.4552 11.2724C26.087 8.54143 23.2625 6.66667 20 6.66667C15.3976 6.66667 11.6667 10.3976 11.6667 15V16.6667ZM8.33333 20V33.3333H31.6667V20H8.33333ZM16.6667 25H23.3333V28.3333H16.6667V25Z"
          fill="#9933FF"
        />
      </svg>
    </IconBox>
  )
}

/** "Opens in a new tab" glyph after the course link. Outer 16, leaf 10.67. */
export function ExternalLinkIcon() {
  return (
    <IconBox $size={16} aria-hidden>
      <svg
        width="10.6667"
        height="10.6667"
        viewBox="0 0 10.6667 10.6667"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={leafStyle("20.83%", "12.5%")}
      >
        <path
          d="M4.66667 0.666667V2H1.33333V9.33333H8.66667V6H10V10C10 10.3682 9.70153 10.6667 9.33333 10.6667H0.666667C0.29848 10.6667 0 10.3682 0 10V1.33333C0 0.965147 0.29848 0.666667 0.666667 0.666667H4.66667ZM10.6667 0V5.33333H9.33333L9.33327 2.27533L6.13807 5.4714L5.19526 4.5286L8.38993 1.33333H5.33333V0H10.6667Z"
          fill="#A31F34"
        />
      </svg>
    </IconBox>
  )
}

/** Gamepad beside the "How to play" heading. Outer 24, leaf fills it. */
export function HowToPlayIcon() {
  return (
    <IconBox $size={24} aria-hidden>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={leafStyle("0", "0")}
      >
        <path
          d="M17 4C20.3137 4 23 6.68629 23 10V14C23 17.3137 20.3137 20 17 20H7C3.68629 20 1 17.3137 1 14V10C1 6.68629 3.68629 4 7 4H17ZM17 6H7C4.8578 6 3.10892 7.68397 3.0049 9.80036L3 10V14C3 16.1422 4.68397 17.8911 6.80036 17.9951L7 18H17C19.1422 18 20.8911 16.316 20.9951 14.1996L21 14V10C21 7.8578 19.316 6.10892 17.1996 6.0049L17 6ZM10 9V11H12V13H9.999L10 15H8L7.999 13H6V11H8V9H10ZM18 13V15H16V13H18ZM16 9V11H14V9H16Z"
          fill="black"
        />
      </svg>
    </IconBox>
  )
}
