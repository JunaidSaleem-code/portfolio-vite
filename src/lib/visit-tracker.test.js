import { describe, expect, it } from "vitest";
import {
  classifyDevice,
  cleanPath,
  cleanReferrer,
  isBot,
  pickCountry,
} from "./visit-tracker";

describe("classifyDevice", () => {
  it("returns 'unknown' for empty UA", () => {
    expect(classifyDevice("")).toBe("unknown");
    expect(classifyDevice()).toBe("unknown");
  });

  it("classifies bots first", () => {
    expect(classifyDevice("Googlebot/2.1")).toBe("bot");
    expect(classifyDevice("curl/7.79.1")).toBe("bot");
    expect(classifyDevice("Mozilla/5.0 (compatible; bingbot)")).toBe("bot");
  });

  it("classifies tablets (iPad)", () => {
    expect(
      classifyDevice("Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15")
    ).toBe("tablet");
  });

  it("classifies mobiles (iPhone, Android Mobile)", () => {
    expect(
      classifyDevice("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15")
    ).toBe("mobile");
    expect(
      classifyDevice(
        "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 Chrome Mobile Safari"
      )
    ).toBe("mobile");
  });

  it("falls back to desktop", () => {
    expect(
      classifyDevice("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15")
    ).toBe("desktop");
  });
});

describe("isBot", () => {
  it("matches common crawler tokens", () => {
    expect(isBot("googlebot")).toBe(true);
    expect(isBot("HeadlessChrome")).toBe(true);
    expect(isBot("axios/1.6.0")).toBe(true);
  });

  it("does not flag normal browsers", () => {
    expect(isBot("Mozilla/5.0 (Macintosh) Safari/605.1.15")).toBe(false);
  });
});

describe("cleanPath", () => {
  it("strips query strings", () => {
    expect(cleanPath("/projects/ai-tool-hub?utm=foo")).toBe("/projects/ai-tool-hub");
  });

  it("caps to 256 chars", () => {
    const long = "/" + "a".repeat(500);
    expect(cleanPath(long).length).toBeLessThanOrEqual(256);
  });

  it("handles malformed input gracefully", () => {
    expect(cleanPath("\x00\x01")).toBeTypeOf("string");
  });
});

describe("cleanReferrer", () => {
  it("returns hostname + pathname for valid URL", () => {
    expect(cleanReferrer("https://news.ycombinator.com/item?id=1")).toBe(
      "news.ycombinator.com/item"
    );
  });

  it("returns empty string for empty referrer", () => {
    expect(cleanReferrer("")).toBe("");
    expect(cleanReferrer()).toBe("");
  });

  it("falls back to truncated raw string for invalid URLs", () => {
    expect(cleanReferrer("not a url")).toBe("not a url");
  });
});

describe("pickCountry", () => {
  function fakeHeaders(map) {
    return { get: (k) => map[k.toLowerCase()] ?? null };
  }

  it("prefers Vercel header", () => {
    expect(pickCountry(fakeHeaders({ "x-vercel-ip-country": "PK" }))).toBe("PK");
  });

  it("falls back to Cloudflare header", () => {
    expect(pickCountry(fakeHeaders({ "cf-ipcountry": "US" }))).toBe("US");
  });

  it("ignores Cloudflare 'XX' sentinel", () => {
    expect(pickCountry(fakeHeaders({ "cf-ipcountry": "XX" }))).toBe("unknown");
  });

  it("returns 'unknown' when nothing is set", () => {
    expect(pickCountry(fakeHeaders({}))).toBe("unknown");
  });
});
