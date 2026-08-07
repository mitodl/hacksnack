import React from "react"
import { ExternalLinkIcon } from "./icons"
import {
  RevealCard,
  RevealBadge,
  RevealContent,
  RevealTitle,
  RevealBody,
  RevealText,
  RevealLinkGroup,
  RevealLinkLabel,
  RevealLinkRow,
  RevealLink,
  RevealName,
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
      <RevealBadge aria-hidden>🎉</RevealBadge>
      <RevealContent>
        <RevealTitle>Today&rsquo;s MIT connection unlocked</RevealTitle>
        <RevealBody>
          {text && <RevealText>{text}</RevealText>}
          {courseName && (
            <RevealLinkGroup>
              <RevealLinkLabel>Explore related learning:</RevealLinkLabel>
              <RevealLinkRow>
                {courseLink ? (
                  <>
                    <RevealLink
                      href={courseLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {courseName}
                    </RevealLink>
                    <ExternalLinkIcon />
                  </>
                ) : (
                  <RevealName>{courseName}</RevealName>
                )}
              </RevealLinkRow>
            </RevealLinkGroup>
          )}
          {children}
        </RevealBody>
      </RevealContent>
    </RevealCard>
  )
}
