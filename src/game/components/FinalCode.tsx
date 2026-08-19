import React from "react"
import { TrophyIcon, LockIcon, UnlockedIcon } from "./icons"
import {
  FinalPanel,
  FinalPuzzle,
  FinalHeader,
  FinalBadge,
  FinalContent,
  FinalTitle,
  FinalNote,
  FinalSlotsRow,
  FinalSlots,
  FinalSlot,
  FinalLock,
} from "../styled"

export type FinalCodeSlot = {
  key: string
  /** The solved code word, or undefined while its puzzle is unsolved. */
  word?: string
  label: string
}

// The final-code panel: one slot per code word, and — once the code is
// complete — today's MIT connection below.
export function FinalCode({
  slots,
  note,
  unlocked,
  anchorRef,
  children,
}: {
  slots: FinalCodeSlot[]
  note: string
  unlocked?: boolean
  /** Marks where the celebrating Tim flies to. */
  anchorRef?: React.Ref<HTMLDivElement>
  /** The revealed MIT connection, once the code is cracked. */
  children?: React.ReactNode
}) {
  return (
    <FinalPanel $unlocked={unlocked} ref={anchorRef}>
      <FinalPuzzle>
        <FinalHeader>
          <FinalBadge>
            <TrophyIcon />
          </FinalBadge>
          <FinalContent>
            <FinalTitle>Final Code</FinalTitle>
            <FinalNote>{note}</FinalNote>
          </FinalContent>
        </FinalHeader>
        <FinalSlotsRow>
          <FinalSlots>
            {slots.map((slot) => (
              <FinalSlot key={slot.key} $filled={!!slot.word}>
                <span
                  aria-label={
                    slot.word ? undefined : `${slot.label} not solved yet`
                  }
                >
                  {slot.word || "- - - - -"}
                </span>
              </FinalSlot>
            ))}
          </FinalSlots>
          <FinalLock
            role="img"
            aria-label={unlocked ? "Final code unlocked" : "Final code locked"}
          >
            {unlocked ? (
              <UnlockedIcon color="black" />
            ) : (
              <LockIcon color="black" />
            )}
          </FinalLock>
        </FinalSlotsRow>
      </FinalPuzzle>
      {children}
    </FinalPanel>
  )
}
