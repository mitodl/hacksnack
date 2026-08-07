import React from "react"
import { TrophyIcon, BigLockIcon, BigUnlockedIcon } from "./icons"
import {
  FinalPanel,
  FinalBadge,
  FinalContent,
  FinalSummary,
  FinalTitle,
  FinalNote,
  FinalSlotsRow,
  FinalSlots,
  FinalSlot,
  FinalSlotButton,
  FinalLock,
} from "../styled"

export type FinalCodeSlot = {
  key: string
  /** The solved code word, or undefined while its puzzle is unsolved. */
  word?: string
  /** Set when the solved word can be explored (it lists OCW courses). */
  onClick?: () => void
  label: string
}

// The final-code panel: one slot per code word, a padlock that springs open once
// the code is complete, and — then — today's MIT connection below.
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
      <FinalBadge>
        <TrophyIcon />
      </FinalBadge>
      <FinalContent $unlocked={unlocked}>
        <FinalSummary>
          <FinalTitle>Final Code</FinalTitle>
          <FinalNote>{note}</FinalNote>
          <FinalSlotsRow>
            <FinalSlots>
              {slots.map((slot) => (
                <FinalSlot key={slot.key} $filled={!!slot.word}>
                  {slot.word && slot.onClick ? (
                    <FinalSlotButton
                      type="button"
                      onClick={slot.onClick}
                      title={`OCW courses mentioning ${slot.word}`}
                    >
                      {slot.word}
                    </FinalSlotButton>
                  ) : (
                    <span
                      aria-label={
                        slot.word ? undefined : `${slot.label} not solved yet`
                      }
                    >
                      {slot.word || "- - -"}
                    </span>
                  )}
                </FinalSlot>
              ))}
            </FinalSlots>
            <FinalLock
              role="img"
              aria-label={unlocked ? "Final code unlocked" : "Final code locked"}
            >
              {unlocked ? <BigUnlockedIcon /> : <BigLockIcon />}
            </FinalLock>
          </FinalSlotsRow>
        </FinalSummary>
        {children}
      </FinalContent>
    </FinalPanel>
  )
}
