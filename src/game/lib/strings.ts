// Small string / array helpers used across the game.

export const titleCase = (s: string) =>
  s
    .replace(/(^|\s|_|-)([a-z])/g, (_, p1, p2) => `${p1}${p2.toUpperCase()}`)
    .replace(/[_-]/g, "")

export const passwordDisplay = (s: string) => s.replace(/\s+/g, "_")

export const sample = <T,>(arr: T[]) =>
  arr[Math.floor(Math.random() * arr.length)]

// Fisher-Yates shuffle for local randomization
export function shuffleList<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}
