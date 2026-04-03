import { describe, it, expect } from "vitest";

// Inline the pure functions from ActiveTraining for isolated testing
function parseRestToSeconds(rest: string): number {
  const match = rest.match(/(\d+)/);
  if (!match) return 60;
  const num = parseInt(match[1]);
  if (rest.toLowerCase().includes("min")) return num * 60;
  return num;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

describe("parseRestToSeconds", () => {
  it("parses seconds", () => expect(parseRestToSeconds("45s")).toBe(45));
  it("parses bare number", () => expect(parseRestToSeconds("30")).toBe(30));
  it("parses minutes", () => expect(parseRestToSeconds("2 min")).toBe(120));
  it("returns 60 for dash", () => expect(parseRestToSeconds("—")).toBe(60));
  it("returns 60 for empty string", () => expect(parseRestToSeconds("")).toBe(60));
  it("returns 60 for no digits", () => expect(parseRestToSeconds("sem descanso")).toBe(60));
});

describe("formatTime", () => {
  it("formats zero", () => expect(formatTime(0)).toBe("00:00"));
  it("formats 90 seconds", () => expect(formatTime(90)).toBe("01:30"));
  it("formats exactly 1 minute", () => expect(formatTime(60)).toBe("01:00"));
  it("formats large values", () => expect(formatTime(3661)).toBe("61:01"));
});