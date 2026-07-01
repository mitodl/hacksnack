import { titleCase, passwordDisplay, sample, shuffleList } from "./strings"

describe("titleCase", () => {
  it("capitalizes the first letter of each word", () => {
    expect(titleCase("hello world")).toBe("Hello World")
  })

  it("capitalizes a single word", () => {
    expect(titleCase("memory")).toBe("Memory")
  })

  it("uppercases letters after underscores/hyphens and strips them", () => {
    expect(titleCase("foo_bar")).toBe("FooBar")
    expect(titleCase("ethics-health")).toBe("EthicsHealth")
  })

  it("returns an empty string unchanged", () => {
    expect(titleCase("")).toBe("")
  })

  it("leaves already-capitalized words intact", () => {
    expect(titleCase("Hello World")).toBe("Hello World")
  })
})

describe("passwordDisplay", () => {
  it("replaces runs of whitespace with single underscores", () => {
    expect(passwordDisplay("hello world")).toBe("hello_world")
    expect(passwordDisplay("a b  c")).toBe("a_b_c")
  })

  it("collapses leading and trailing whitespace to underscores", () => {
    expect(passwordDisplay(" a ")).toBe("_a_")
  })

  it("leaves a string without whitespace unchanged", () => {
    expect(passwordDisplay("swordfish")).toBe("swordfish")
  })
})

describe("sample", () => {
  it("returns an element from the array", () => {
    const arr = ["a", "b", "c"]
    expect(arr).toContain(sample(arr))
  })

  it("returns the first element when Math.random is 0", () => {
    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0)
    expect(sample(["x", "y", "z"])).toBe("x")
    randomSpy.mockRestore()
  })
})

describe("shuffleList", () => {
  it("returns a new array with the same elements", () => {
    const input = [1, 2, 3, 4, 5]
    const result = shuffleList(input)
    expect(result).toHaveLength(input.length)
    expect([...result].sort()).toEqual([...input].sort())
  })

  it("does not mutate the original array", () => {
    const input = [1, 2, 3]
    const copy = [...input]
    shuffleList(input)
    expect(input).toEqual(copy)
  })
})
