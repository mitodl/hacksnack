import { estimateStrength } from "./strength"

describe("estimateStrength", () => {
  it("returns the expected shape", () => {
    const result = estimateStrength("password")
    expect(result).toEqual(
      expect.objectContaining({
        entropy: expect.any(Number),
        label: expect.any(String),
        pct: expect.any(Number),
        crackSeconds: expect.any(Number),
        crackTime: expect.any(String),
        crackLabel: expect.any(String),
      }),
    )
  })

  it("treats an empty password as zero entropy / Weak", () => {
    const result = estimateStrength("")
    expect(result.entropy).toBe(0)
    expect(result.label).toBe("Weak")
    expect(result.pct).toBe(0)
  })

  it("rates a short lowercase password as Weak", () => {
    const result = estimateStrength("abcdefgh")
    expect(result.entropy).toBe(38)
    expect(result.label).toBe("Weak")
  })

  it("rates a long mixed-character password as Strong", () => {
    const result = estimateStrength("Abc123!@#xyz")
    expect(result.entropy).toBe(79)
    expect(result.label).toBe("Strong")
  })

  it("caps the percentage at 100", () => {
    const result = estimateStrength("Abc123!@#xyzABC123!@#xyz")
    expect(result.pct).toBe(100)
  })
})
