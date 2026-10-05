import { describe, expect, it } from "vitest";
import { monthPlan } from "./plan";

const base = { expectedIncome: 12_900_000, income: 0, unexpectedIncome: 0, savingsTarget: 1_500_000, saved: 0, budgeted: 10_000_000 };

describe("monthPlan", () => {
  it("uses the expected income until the real one is loaded", () => {
    const plan = monthPlan(base);
    expect(plan).toMatchObject({ income: 12_900_000, usesRealIncome: false, toAssign: 1_400_000 });
  });

  it("switches to the real income when it goes over the expected one", () => {
    const plan = monthPlan({ ...base, income: 13_500_000 });
    expect(plan).toMatchObject({ income: 13_500_000, usesRealIncome: true, toAssign: 2_000_000 });
  });

  it("keeps the expected income when less came in so far", () => {
    expect(monthPlan({ ...base, income: 5_000_000 }).income).toBe(12_900_000);
  });

  it("adds unexpected income on top without comparing it with the expected one", () => {
    const plan = monthPlan({ ...base, income: 2_000_000, unexpectedIncome: 2_000_000 });
    expect(plan).toMatchObject({ baseIncome: 12_900_000, income: 14_900_000, usesRealIncome: false, toAssign: 3_400_000 });
  });

  it("goes negative when the budget plus savings are more than the income", () => {
    expect(monthPlan({ ...base, budgeted: 12_000_000 }).toAssign).toBe(-600_000);
  });

  it("measures savings against the target", () => {
    expect(monthPlan({ ...base, saved: 750_000 }).savingsPercent).toBe(50);
    expect(monthPlan({ ...base, savingsTarget: 0 }).savingsPercent).toBeNull();
  });
});
