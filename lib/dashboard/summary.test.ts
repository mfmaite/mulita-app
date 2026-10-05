import { describe, expect, it } from "vitest";
import { monthSummary, type MovementTotalRow } from "./summary";

function row(overrides: Partial<MovementTotalRow>): MovementTotalRow {
  return {
    type: "expense",
    currency: "UYU",
    sourceType: "checking",
    destinationType: null,
    destinationCurrency: null,
    amount: 0,
    destinationAmount: 0,
    ...overrides,
  };
}

describe("monthSummary", () => {
  const rows = [
    row({ type: "income", amount: 13154900 }),
    row({ type: "expense", amount: 8563900 }),
    row({ type: "transfer", destinationType: "savings", destinationCurrency: "UYU", amount: 708600, destinationAmount: 708600 }),
    row({ type: "card_payment", amount: 3967900 }),
  ];

  it("matches the September dashboard from the spreadsheet", () => {
    const summary = monthSummary(rows, { UYU: 3941500 });
    expect(summary).toMatchObject({ income: 13154900, spent: 12505400, saved: 708600, cardPayments: 3967900 });
    expect(summary.savingsRate).toBeCloseTo(5.39, 2);
  });

  it("does not count card purchases themselves, only their installments", () => {
    const cardPurchase = row({ sourceType: null, currency: "UYU", amount: 485400 });
    expect(monthSummary([cardPurchase], {}).spent).toBe(0);
  });

  it("subtracts what leaves the savings accounts", () => {
    const withdrawal = row({ type: "transfer", sourceType: "savings", destinationType: "checking", amount: 200000 });
    expect(monthSummary([...rows, withdrawal], {}).saved).toBe(508600);
  });

  it("ignores transfers between accounts of the same kind", () => {
    const move = row({ type: "transfer", sourceType: "checking", destinationType: "cash", amount: 50000, destinationAmount: 50000 });
    expect(monthSummary([move], {}).saved).toBe(0);
  });

  it("converts dollars with the rate and reports what it could not convert", () => {
    expect(monthSummary([row({ currency: "USD", amount: 4099 })], { USD: 1000 }, 4125).spent).toBe(169084 + 41250);
    expect(monthSummary([row({ currency: "USD", amount: 4099 })], {}).unconvertedUsd).toBe(4099);
  });

  it("has no savings rate without income", () => {
    expect(monthSummary([], {}).savingsRate).toBeNull();
  });
});
