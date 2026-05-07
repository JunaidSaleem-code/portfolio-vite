import { afterEach, describe, expect, it, vi } from "vitest";
import { rateLimit, resetRateLimit } from "./rate-limit";

afterEach(() => {
  vi.useRealTimers();
});

describe("rateLimit", () => {
  it("allows up to the limit then blocks further requests", () => {
    const key = `test:basic:${Math.random()}`;
    for (let i = 0; i < 3; i++) {
      expect(rateLimit({ key, limit: 3, windowMs: 60_000 }).allowed).toBe(true);
    }
    expect(rateLimit({ key, limit: 3, windowMs: 60_000 }).allowed).toBe(false);
  });

  it("decrements remaining as requests come in", () => {
    const key = `test:remaining:${Math.random()}`;
    const a = rateLimit({ key, limit: 5, windowMs: 60_000 });
    const b = rateLimit({ key, limit: 5, windowMs: 60_000 });
    expect(a.remaining).toBeGreaterThanOrEqual(b.remaining);
    expect(b.remaining).toBe(3);
  });

  it("resetRateLimit clears the bucket", () => {
    const key = `test:reset:${Math.random()}`;
    for (let i = 0; i < 3; i++) rateLimit({ key, limit: 3, windowMs: 60_000 });
    expect(rateLimit({ key, limit: 3, windowMs: 60_000 }).allowed).toBe(false);
    resetRateLimit(key);
    expect(rateLimit({ key, limit: 3, windowMs: 60_000 }).allowed).toBe(true);
  });

  it("resets after the window elapses", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1, 12, 0, 0));
    const key = "test:window";
    for (let i = 0; i < 2; i++) rateLimit({ key, limit: 2, windowMs: 1_000 });
    expect(rateLimit({ key, limit: 2, windowMs: 1_000 }).allowed).toBe(false);
    vi.advanceTimersByTime(2_000);
    expect(rateLimit({ key, limit: 2, windowMs: 1_000 }).allowed).toBe(true);
  });
});
