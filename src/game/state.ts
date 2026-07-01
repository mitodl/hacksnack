import type { GroupKey } from "./types"

// Per-puzzle progress is tracked in parallel maps keyed by GroupKey.
// They are consolidated into a single reducer so related updates (resets,
// hint toggles) stay in sync and live in one place.
export type GroupMaps = {
  words: Partial<Record<GroupKey, string>>
  inputs: Partial<Record<GroupKey, string>>
  hintShown: Partial<Record<GroupKey, boolean>>
  hintCounted: Partial<Record<GroupKey, boolean>>
}

export const initialGroupMaps: GroupMaps = {
  words: {},
  inputs: {},
  hintShown: {},
  hintCounted: {},
}

type GroupMapsAction =
  | { type: "setWord"; group: GroupKey; value: string }
  | { type: "setInput"; group: GroupKey; value: string }
  | { type: "toggleHint"; group: GroupKey; hint: string | undefined }
  | { type: "resetHints" }
  | { type: "resetAll" }
  | { type: "load"; state: GroupMaps }

export function groupMapsReducer(
  state: GroupMaps,
  action: GroupMapsAction,
): GroupMaps {
  switch (action.type) {
    case "setWord":
      return {
        ...state,
        words: { ...state.words, [action.group]: action.value },
      }
    case "setInput":
      return {
        ...state,
        inputs: { ...state.inputs, [action.group]: action.value },
      }
    case "toggleHint": {
      const willShowHint = !state.hintShown[action.group]
      if (!willShowHint) {
        return {
          ...state,
          hintShown: { ...state.hintShown, [action.group]: false },
        }
      }
      const hint = action.hint
      const clearInput = !!hint && action.group !== "image"
      return {
        ...state,
        hintShown: { ...state.hintShown, [action.group]: true },
        hintCounted: state.hintCounted[action.group]
          ? state.hintCounted
          : { ...state.hintCounted, [action.group]: true },
        inputs: clearInput
          ? { ...state.inputs, [action.group]: "" }
          : state.inputs,
      }
    }
    case "resetHints":
      return { ...state, hintShown: {}, hintCounted: {} }
    case "resetAll":
      // Note: hintCounted is intentionally preserved (daily hint tally).
      return { ...state, words: {}, inputs: {}, hintShown: {} }
    case "load":
      return action.state
    default:
      return state
  }
}
