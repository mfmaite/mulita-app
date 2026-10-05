import { describe, expect, it } from "vitest";
import { goalProgress, unassignedShare } from "./calculations";

const pool = 6378600;
const monthlyPlan = 1000000;

describe("goalProgress", () => {
  it("matches the emergency fund from the spreadsheet", () => {
    expect(goalProgress({ target: 8000000, share: 65 }, pool, monthlyPlan, "2026-10")).toMatchObject({
      saved: 4146090,
      missing: 3853910,
      monthlyContribution: 650000,
      monthsLeft: 6,
      estimatedMonth: "2027-04",
    });
  });

  it("matches the trips from the spreadsheet", () => {
    expect(goalProgress({ target: 4000000, share: 20 }, pool, monthlyPlan, "2026-10").estimatedMonth).toBe("2027-12");
    expect(goalProgress({ target: 6000000, share: 15 }, pool, monthlyPlan, "2026-10").estimatedMonth).toBe("2029-08");
  });

  it("is done when the saved amount reaches the target", () => {
    expect(goalProgress({ target: 100000, share: 50 }, 500000, 0, "2026-10")).toMatchObject({
      missing: 0,
      monthsLeft: 0,
      estimatedMonth: "2026-10",
      percent: 100,
    });
  });

  it("cannot estimate a date without a monthly plan", () => {
    expect(goalProgress({ target: 100000, share: 50 }, 0, 0, "2026-10")).toMatchObject({
      monthsLeft: null,
      estimatedMonth: null,
    });
  });
});

describe("unassignedShare", () => {
  it("returns what is left to reach 100%", () => {
    expect(unassignedShare([{ share: 65 }, { share: 20 }])).toBe(15);
    expect(unassignedShare([])).toBe(100);
  });
});
