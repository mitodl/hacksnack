import React from "react"
import { ExternalLinkIcon } from "./icons"
import {
  RevealCard,
  RevealTitleRow,
  RevealBadge,
  RevealTitle,
  RevealText,
  RevealLinkGroup,
  RevealLinkLabel,
  RevealLinkRow,
  RevealLink,
} from "../styled"

// Today's MIT connection, revealed inside the final-code panel once the code is
// cracked.
export function MitConnection({
  text,
  courseName,
  courseLink,
  children,
}: {
  text?: string
  courseName?: string
  courseLink?: string
  /** Optional media for the connection (video or PDF embed). */
  children?: React.ReactNode
}) {
  return (
    <RevealCard>
      <RevealTitleRow>
        <RevealBadge aria-hidden>🎉</RevealBadge>
        <RevealTitle>Today&rsquo;s MIT connection unlocked</RevealTitle>
      </RevealTitleRow>
      {text && <RevealText>{text}</RevealText>}
      {courseName && (
        <RevealLinkGroup>
          <RevealLinkLabel>Explore related learning:</RevealLinkLabel>
          <RevealLinkRow>
            {courseLink ? (
              <>
                <RevealLink href={courseLink} target="_blank" rel="noreferrer">
                  {courseName}
                </RevealLink>
                <ExternalLinkIcon size={24} />
              </>
            ) : (
              <RevealText>{courseName}</RevealText>
            )}
          </RevealLinkRow>
        </RevealLinkGroup>
      )}
      {children}
    </RevealCard>
  )
}
