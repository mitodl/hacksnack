import React from "react"
import styled from "@emotion/styled"
import { typography } from "./theme"

type TypographyVariant =
  | "h4"
  | "h5"
  | "subtitle2"
  | "subtitle3"
  | "body1"
  | "body2"
  | "body3"
  | "button"

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant
  component?: React.ElementType
}

const defaultMapping: Record<TypographyVariant, React.ElementType> = {
  h4: "h4",
  h5: "h5",
  subtitle2: "h6",
  subtitle3: "h6",
  body1: "p",
  body2: "p",
  body3: "p",
  button: "span",
}

// Applies the variant styles via an Emotion class (not inline styles) so that
// `styled(Typography)(...)` overrides — inserted later — win on equal
// specificity, matching MUI's Typography behaviour the game was written for.
const Root = styled.span<{ $variant: TypographyVariant }>(({ $variant }) => ({
  margin: 0,
  ...typography[$variant],
}))

/**
 * Minimal drop-in replacement for MUI's Typography supporting the `variant`
 * and `component` props used by the game.
 */
export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  function Typography(
    { variant = "body1", component, children, ...rest },
    ref,
  ) {
    const asComponent = component ?? defaultMapping[variant] ?? "span"
    return (
      <Root as={asComponent} $variant={variant} ref={ref} {...rest}>
        {children}
      </Root>
    )
  },
)
