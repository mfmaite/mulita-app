import { describe, expect, it } from "vitest";
import { balanceFrom, signedAmount } from "./balance";

describe("signedAmount", () => {
  it("adds income and subtracts expenses", () => {
    expect(signedAmount("income", 12997600)).toBe(12997600);
    expect(signedAmount("expense", 80300)).toBe(-80300);
  });

  it("keeps the sign of adjustments as they come", () => {
    expect(signedAmount("adjustment", -71200)).toBe(-71200);
    expect(signedAmount("adjustment", 9000)).toBe(9000);
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

  it("subtracts outgoing transfers and adds incoming ones", () => {
    expect(balanceFrom(1000000, { transfer: 708600 })).toBe(291400);
    expect(balanceFrom(0, { transferIn: 708600 })).toBe(708600);
  });

  it("subtracts card payments from the account", () => {
    expect(balanceFrom(1000000, { card_payment: 3967900 })).toBe(-2967900);
  });

  it("applies negative adjustments", () => {
    expect(balanceFrom(100000, { adjustment: -71200 })).toBe(28800);
  });
});
