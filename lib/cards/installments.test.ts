import { describe, expect, it } from "vitest";
import { installmentAmounts, installmentSchedule, suggestFirstBillingMonth } from "./installments";

describe("installmentAmounts", () => {
  it("splits evenly when it can", () => {
    expect(installmentAmounts(1250000, 10)).toEqual(Array(10).fill(125000));
  });

  it("gives the leftover cents to the first installments so the total matches", () => {
    const amounts = installmentAmounts(485400, 3);
    expect(amounts).toEqual([161800, 161800, 161800]);
    const uneven = installmentAmounts(100000, 3);
    expect(uneven).toEqual([33334, 33333, 33333]);
    expect(uneven.reduce((total, amount) => total + amount, 0)).toBe(100000);
  });

  it("handles a single payment", () => {
    expect(installmentAmounts(41000, 1)).toEqual([41000]);
  });
});

describe("installmentSchedule", () => {
  it("assigns one month per installment, crossing the year", () => {
    expect(installmentSchedule({ total: 300, count: 3, firstMonth: "2026-11" })).toEqual([
      { number: 1, month: "2026-11", amount: 100 },
      { number: 2, month: "2026-12", amount: 100 },
      { number: 3, month: "2027-01", amount: 100 },
    ]);
  });
});

describe("suggestFirstBillingMonth", () => {
  it("bills next month when the purchase is on or before the closing day", () => {
    expect(suggestFirstBillingMonth("2026-07-27", 27)).toBe("2026-08");
    expect(suggestFirstBillingMonth("2026-07-03", 27)).toBe("2026-08");
  });

  it("bills the month after next when the purchase is after the closing day", () => {
    expect(suggestFirstBillingMonth("2026-07-29", 27)).toBe("2026-09");
  });

  it("crosses the year", () => {
    expect(suggestFirstBillingMonth("2026-12-30", 27)).toBe("2027-02");
  });
});
