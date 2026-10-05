import { describe, expect, it } from "vitest";
import { spentByCategory, toPesos, usageOf } from "./calculations";

describe("toPesos", () => {
  it("leaves pesos as they are", () => {
    expect(toPesos(80300, "UYU")).toBe(80300);
  });

  it("converts dollars with the month rate and rounds to the cent", () => {
    expect(toPesos(4099, "USD", 4125)).toBe(169084);
  });

  it("returns null when there is no rate for dollars", () => {
    expect(toPesos(4099, "USD")).toBeNull();
    expect(toPesos(4099, "USD", null)).toBeNull();
  });
});

describe("usageOf", () => {
  it("is fine below 90%", () => {
    expect(usageOf(2667, 4000)).toEqual({ percent: 66.675, level: "ok" });
  });

  it("warns from 90% up to the budget", () => {
    expect(usageOf(2930700, 3050000).level).toBe("warning");
    expect(usageOf(3050000, 3050000).level).toBe("warning");
  });

  it("is over when the budget is exceeded", () => {
    expect(usageOf(1221700, 600000).level).toBe("over");
  });

  it("has no percent without a budget", () => {
    expect(usageOf(50000, 0)).toEqual({ percent: null, level: "none" });
  });
});

describe("spentByCategory", () => {
  const rows = [
    { categoryId: "food", currency: "UYU" as const, total: 1647000 },
    { categoryId: "services", currency: "UYU" as const, total: 400000 },
    { categoryId: "services", currency: "USD" as const, total: 4099 },
    { categoryId: null, currency: "UYU" as const, total: 99999 },
  ];

  it("adds pesos and converted dollars per category", () => {
    const { totals, unconvertedUsd } = spentByCategory(rows, 4125);
    expect(totals.get("food")).toBe(1647000);
    expect(totals.get("services")).toBe(400000 + 169084);
    expect(unconvertedUsd).toBe(0);
  });

  it("keeps track of the dollars it could not convert", () => {
    const { totals, unconvertedUsd } = spentByCategory(rows);
    expect(totals.get("services")).toBe(400000);
    expect(unconvertedUsd).toBe(4099);
  });
});
