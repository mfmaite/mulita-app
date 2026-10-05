import { describe, expect, it } from "vitest";
import { balanceFrom, signedAmount } from "./balance";

describe("signedAmount", () => {
  it("adds income and subtracts expenses", () => {
    expect(signedAmount("income", 12997600)).toBe(12997600);
    expect(signedAmount("expense", 80300)).toBe(-80300);
  });
});

describe("balanceFrom", () => {
  it("starts from the initial balance and applies the month totals", () => {
    expect(balanceFrom(165700, { income: 13154900, expense: 8563900 })).toBe(4756700);
  });

  it("returns the initial balance when there are no movements", () => {
    expect(balanceFrom(165700, {})).toBe(165700);
  });

  it("can go below zero", () => {
    expect(balanceFrom(0, { expense: 71200 })).toBe(-71200);
  });
});
