import { describe, expect, it } from "vitest";
import { pickTip, splitUnexpectedIncome } from "./tips";

const calm = { overBudget: [], unexpectedIncome: 0, hasBudget: true };

describe("splitUnexpectedIncome", () => {
  it("splits 50/30/20 in whole pesos and keeps every cent", () => {
    expect(splitUnexpectedIncome(7932600)).toEqual({ savings: 3966300, planned: 2379800, treat: 1586500 });
    const odd = splitUnexpectedIncome(1001);
    expect(odd.savings + odd.planned + odd.treat).toBe(1001);
  });
});

describe("pickTip", () => {
  it("warns first about categories over budget", () => {
    const tip = pickTip({ ...calm, overBudget: ["Gasto libre", "Transporte"], unexpectedIncome: 100 }, 1);
    expect(tip.tone).toBe("warning");
    expect(tip.text).toContain("Gasto libre y Transporte");
  });

  it("suggests splitting unexpected income", () => {
    expect(pickTip({ ...calm, unexpectedIncome: 7932600 }, 1).text).toContain("al ahorro");
  });

  it("invites to set a budget when there is none", () => {
    expect(pickTip({ ...calm, hasBudget: false }, 1).text).toContain("presupuesto");
  });

  it("rotates the everyday tips by day", () => {
    expect(pickTip(calm, 0).text).not.toBe(pickTip(calm, 1).text);
    expect(pickTip(calm, 0).text).toBe(pickTip(calm, 8).text);
  });
});
