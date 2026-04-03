import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getAthlete, saveAthlete, clearAthlete, createAthlete, calculateLevel } from "@/lib/storage";

describe("storage.ts", () => {
  let storage: Record<string, string> = {};

  beforeEach(() => {
    storage = {};
    vi.spyOn(Storage.prototype, "getItem").mockImplementation((key) => storage[key] ?? null);
    vi.spyOn(Storage.prototype, "setItem").mockImplementation((key, val) => { storage[key] = val; });
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation((key) => { delete storage[key]; });
  });

  afterEach(() => vi.restoreAllMocks());

  it("returns null when no athlete saved", () => {
    expect(getAthlete()).toBeNull();
  });

  it("saves and retrieves athlete", () => {
    const a = createAthlete("João", "j@e.com", "Meia", 20);
    saveAthlete(a);
    const loaded = getAthlete();
    expect(loaded).not.toBeNull();
    expect(loaded!.name).toBe("João");
    expect(loaded!.position).toBe("Meia");
  });

  it("clears athlete", () => {
    saveAthlete(createAthlete("X", "x@x.com", "Goleiro", 18));
    clearAthlete();
    expect(getAthlete()).toBeNull();
  });

  it("handles corrupted JSON gracefully", () => {
    storage["profutebolsm_athlete"] = "{broken";
    expect(getAthlete()).toBeNull();
  });

  it("handles localStorage throwing", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("blocked"); });
    expect(getAthlete()).toBeNull();
  });

  describe("calculateLevel", () => {
    it("returns Iniciante for < 20", () => expect(calculateLevel(0)).toBe("Iniciante"));
    it("returns Titular for 20-49", () => expect(calculateLevel(20)).toBe("Titular"));
    it("returns Estrela for >= 50", () => expect(calculateLevel(50)).toBe("Estrela"));
    it("handles negative", () => expect(calculateLevel(-1)).toBe("Iniciante"));
  });

  describe("createAthlete", () => {
    it("sets defaults correctly", () => {
      const a = createAthlete("A", "a@a.com", "Ponta", 25);
      expect(a.level).toBe("Iniciante");
      expect(a.totalTrainings).toBe(0);
      expect(a.evolutionData).toHaveLength(30);
      expect(a.plan).toEqual([]);
    });
  });
});