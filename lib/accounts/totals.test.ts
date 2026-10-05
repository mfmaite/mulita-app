import { describe, expect, it } from "vitest";
import { totalsByCurrency } from "./totals";

describe("totalsByCurrency", () => {
  it("adds up each currency separately", () => {
    expect(
      totalsByCurrency([
        { currency: "UYU", amount: 165700 },
        { currency: "USD", amount: 50000 },
        { currency: "UYU", amount: -80000 },
      ]),
    ).toEqual({ UYU: 85700, USD: 50000 });
  });

  it("only includes currencies that have accounts", () => {
    expect(totalsByCurrency([{ currency: "UYU", amount: 0 }])).toEqual({ UYU: 0 });
    expect(totalsByCurrency([])).toEqual({});
  });
});
