import React from "react"
import { CardRoot, StyledButton } from "../styled"

export function Card({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return <CardRoot className={className}>{children}</CardRoot>
}

export function Button({
  children,
  onClick,
  disabled,
  solved,
  className = "",
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  solved?: boolean
  className?: string
}) {
  return (
    <StyledButton
      $solved={solved}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </StyledButton>
  )
}
