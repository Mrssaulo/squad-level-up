import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { canSendMessage, recordMessage, getRemainingMessages } from "@/lib/ai";

describe("ai.ts — daily message limiter", () => {
  let storage: Record<string, string> = {};

  beforeEach(() => {
    storage = {};
    vi.spyOn(Storage.prototype, "getItem").mockImplementation((key) => storage[key] ?? null);
    vi.spyOn(Storage.prototype, "setItem").mockImplementation((key, val) => { storage[key] = val; });
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation((key) => { delete storage[key]; });
  });

  afterEach(() => vi.restoreAllMocks());

  it("allows first message of the day", () => {
    expect(canSendMessage()).toBe(true);
  });

  it("blocks after recording the daily limit", () => {
    recordMessage();
    expect(canSendMessage()).toBe(false);
  });

  it("returns 0 remaining after limit reached", () => {
    recordMessage();
    expect(getRemainingMessages()).toBe(0);
  });

  it("resets on a new day", () => {
    storage["ai_chat_daily"] = JSON.stringify({ date: "Thu Jan 01 2000", count: 99 });
    expect(canSendMessage()).toBe(true);
    expect(getRemainingMessages()).toBe(1);
  });

  it("handles corrupted storage gracefully", () => {
    storage["ai_chat_daily"] = "not-json!!!";
    expect(canSendMessage()).toBe(true);
    expect(getRemainingMessages()).toBe(1);
  });

  it("handles localStorage throwing", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("blocked"); });
    expect(canSendMessage()).toBe(true);
    expect(getRemainingMessages()).toBe(1);
  });
});