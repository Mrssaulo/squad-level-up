import { describe, it, expect } from "vitest";
import {
  trainings,
  positionFilters,
  spaceLabels,
  materialLabels,
  locationLabels,
  getPositionRecommendation,
  getDetailedAssessment,
} from "@/lib/trainings";

describe("trainings.ts — data integrity", () => {
  it("has at least 10 trainings", () => {
    expect(trainings.length).toBeGreaterThanOrEqual(10);
  });

  it("all trainings have required fields", () => {
    for (const t of trainings) {
      expect(t.id).toBeTruthy();
      expect(t.title).toBeTruthy();
      expect(t.exercises.length).toBeGreaterThan(0);
      expect(t.solo).toBe(true);
      expect(t.positions.length).toBeGreaterThan(0);
      expect(t.locations.length).toBeGreaterThan(0);
      expect(t.material.length).toBeGreaterThan(0);
    }
  });

  it("all trainings have unique IDs", () => {
    const ids = trainings.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all spaceRequired values are valid keys", () => {
    for (const t of trainings) {
      expect(spaceLabels[t.spaceRequired]).toBeTruthy();
    }
  });

  it("all material values are valid keys", () => {
    for (const t of trainings) {
      for (const m of t.material) {
        expect(materialLabels[m]).toBeTruthy();
      }
    }
  });

  it("all location values are valid keys", () => {
    for (const t of trainings) {
      for (const l of t.locations) {
        expect(locationLabels[l]).toBeTruthy();
      }
    }
  });

  it("position filters include all positions used in trainings", () => {
    const allPositions = new Set(trainings.flatMap((t) => t.positions));
    for (const pos of allPositions) {
      expect(positionFilters).toContain(pos);
    }
  });
});

describe("getPositionRecommendation", () => {
  it("returns recommendation for known position and category", () => {
    const rec = getPositionRecommendation("Goleiro", "Elite");
    expect(rec.length).toBeGreaterThan(0);
  });

  it("returns fallback for unknown position", () => {
    const rec = getPositionRecommendation("Unknown", "Elite");
    expect(rec).toBe("Continue treinando com consistência!");
  });

  it("returns fallback for unknown category", () => {
    const rec = getPositionRecommendation("Meia", "NonExistent");
    expect(rec).toBe("Continue treinando com consistência!");
  });
});

describe("getDetailedAssessment", () => {
  it("returns valid structure for good athlete", () => {
    const result = getDetailedAssessment("Meia", "Elite", 22, 10, 3000);
    expect(result.conditioningLevel).toBe("Excelente");
    expect(result.strengths.length).toBeGreaterThan(0);
    expect(result.recommendation.length).toBeGreaterThan(0);
  });

  it("flags improvements for poor metrics", () => {
    const result = getDetailedAssessment("Zagueiro", "Desenvolver", 28, 22, 1500);
    expect(result.conditioningLevel).toBe("Baixo");
    expect(result.improvements.length).toBeGreaterThan(0);
  });

  it("handles unknown position gracefully", () => {
    const result = getDetailedAssessment("Unknown", "Bom", 22, 12, 2500);
    expect(result.conditioningLevel).toBe("Bom");
    expect(result.recommendation).toBe("Continue treinando com consistência!");
  });

  it("handles edge case conditioning boundaries", () => {
    expect(getDetailedAssessment("Meia", "Bom", 22, 12, 2800).conditioningLevel).toBe("Excelente");
    expect(getDetailedAssessment("Meia", "Bom", 22, 12, 2799).conditioningLevel).toBe("Bom");
    expect(getDetailedAssessment("Meia", "Bom", 22, 12, 2400).conditioningLevel).toBe("Bom");
    expect(getDetailedAssessment("Meia", "Bom", 22, 12, 2399).conditioningLevel).toBe("Regular");
    expect(getDetailedAssessment("Meia", "Bom", 22, 12, 2000).conditioningLevel).toBe("Regular");
    expect(getDetailedAssessment("Meia", "Bom", 22, 12, 1999).conditioningLevel).toBe("Baixo");
  });
});