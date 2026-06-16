import React from "react"
import { Card } from "./primitives"
import {
  PlaceholderSpan,
  ProgressCardInner,
  ProgressHeaderRow,
  SectionLabel,
  FooterAction,
  TokensRow,
  ClickableToken,
} from "../styled"

function PlaceholderBox({ text, filled }: { text: string; filled: boolean }) {
  return <PlaceholderSpan filled={filled}>{text}</PlaceholderSpan>
}

export function ProgressSentence({
  items,
  footerAction,
}: {
  items: Array<{
    key: string
    label: string
    value?: string
    onClick?: () => void
    clickable?: boolean
  }>
  footerAction?: React.ReactNode
}) {
  return (
    <Card>
      <ProgressCardInner>
        <ProgressHeaderRow>
          <div>
            <SectionLabel>Hacking Progress:</SectionLabel>
            {footerAction && <FooterAction>{footerAction}</FooterAction>}
          </div>
          <TokensRow>
            {items.map((item) => (
              <ClickableToken
                key={item.key}
                $clickable={!!item.clickable}
                onClick={item.clickable ? item.onClick : undefined}
                role={item.clickable ? "button" : undefined}
                tabIndex={item.clickable ? 0 : undefined}
                aria-label={
                  item.clickable ? `Go to ${item.label} puzzle` : undefined
                }
                onKeyDown={
                  item.clickable
                    ? (e: React.KeyboardEvent) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          item.onClick?.()
                        }
                      }
                    : undefined
                }
              >
                <PlaceholderBox
                  text={item.value || item.label}
                  filled={!!item.value}
                />
              </ClickableToken>
            ))}
          </TokensRow>
        </ProgressHeaderRow>
      </ProgressCardInner>
    </Card>
  )
}
