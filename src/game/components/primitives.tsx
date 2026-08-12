import React from "react"
import { StyledButton } from "../styled"

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
