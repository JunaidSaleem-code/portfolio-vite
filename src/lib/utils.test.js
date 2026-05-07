import { describe, expect, it } from "vitest";
import { cn, slugify } from "./utils";

describe("slugify", () => {
  it("lowercases and replaces spaces with dashes", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("strips characters that aren't a-z 0-9 dash or space", () => {
    expect(slugify("Hello, World! @ 2026")).toBe("hello-world-2026");
  });

  it("collapses runs of spaces and dashes", () => {
    expect(slugify("AI   tool   ---   hub")).toBe("ai-tool-hub");
  });

  it("trims leading and trailing dashes", () => {
    expect(slugify("---hello---")).toBe("hello");
  });

  it("returns empty string for nullish input", () => {
    expect(slugify(undefined)).toBe("");
    expect(slugify(null)).toBe("");
    expect(slugify("")).toBe("");
  });

  it("coerces non-strings", () => {
    expect(slugify(123)).toBe("123");
  });
});

describe("cn", () => {
  it("joins truthy class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("skips falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });

  it("merges conflicting tailwind utilities — last one wins", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});
