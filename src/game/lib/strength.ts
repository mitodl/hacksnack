// Lightweight password strength + crack-time estimation heuristic.

export function estimateStrength(pw: string) {
  const len = pw.length
  let alpha = 0
  if (/[a-z]/.test(pw)) alpha += 26
  if (/[A-Z]/.test(pw)) alpha += 26
  if (/[0-9]/.test(pw)) alpha += 10
  if (/[^A-Za-z0-9]/.test(pw)) alpha += 32
  if (alpha === 0) alpha = 10 // fallback
  const entropy = Math.round(len * Math.log2(alpha))
  let label: "Weak" | "Okay" | "Strong" | "Beast" = "Weak"
  if (entropy > 90) label = "Beast"
  else if (entropy > 70) label = "Strong"
  else if (entropy > 50) label = "Okay"
  const pct = Math.min(100, Math.round((entropy / 60) * 100))

  // Crack-time estimation: assume the attacker manages ~1e15 (one quadrillion)
  // guesses/second — a fast offline attack against a weak/unsalted hash.
  const GUESSES_PER_SECOND = 1e15
  const guesses = Math.pow(2, entropy)
  const crackSeconds = guesses / GUESSES_PER_SECOND

  function humanTime(sec: number) {
    if (!isFinite(sec) || sec <= 0) return "<1s"
    const minute = 60
    const hour = 60 * minute
    const day = 24 * hour
    const year = 365 * day
    if (sec < 1) return `${Math.round(sec * 1000)} ms`
    if (sec < minute) return `${Math.round(sec)} s`
    if (sec < hour) return `${Math.round(sec / minute)} min`
    if (sec < day) return `${Math.round(sec / hour)} hr`
    if (sec < year) return `${Math.round(sec / day)} days`
    const yrs = sec / year
    if (yrs < 100) return `${yrs.toFixed(1)} years`
    if (yrs < 1000) return `${Math.round(yrs)} years`
    return ">1000 years"
  }

  let crackLabel: string
  if (crackSeconds < 1) crackLabel = "Instant"
  else if (crackSeconds < 60) crackLabel = "Seconds"
  else if (crackSeconds < 3600) crackLabel = "Minutes"
  else if (crackSeconds < 86400) crackLabel = "Hours"
  else if (crackSeconds < 30 * 86400) crackLabel = "Days"
  else if (crackSeconds < 365 * 86400) crackLabel = "Months"
  else if (crackSeconds < 100 * 365 * 86400) crackLabel = "Years"
  else if (crackSeconds < 1000 * 365 * 86400) crackLabel = "Centuries"
  else crackLabel = "Practically Unbreakable"

  return {
    entropy,
    label,
    pct,
    crackSeconds,
    crackTime: humanTime(crackSeconds),
    crackLabel,
  }
}
