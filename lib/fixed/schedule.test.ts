import { describe, expect, it } from "vitest";
import { isDueIn } from "./schedule";

describe("isDueIn", () => {
  it("is due every month for monthly commitments", () => {
    expect(isDueIn("2026-07", "monthly", "2026-07")).toBe(true);
    expect(isDueIn("2026-07", "monthly", "2027-03")).toBe(true);
  });

  it("is due every other month for bimonthly commitments", () => {
    expect(isDueIn("2026-07-01", "bimonthly", "2026-09")).toBe(true);
    expect(isDueIn("2026-07-01", "bimonthly", "2026-10")).toBe(false);
    expect(isDueIn("2026-07-01", "bimonthly", "2027-01")).toBe(true);
  });

  it("handles quarterly and yearly commitments", () => {
    expect(isDueIn("2026-02", "quarterly", "2026-11")).toBe(true);
    expect(isDueIn("2026-02", "quarterly", "2026-12")).toBe(false);
    expect(isDueIn("2026-03", "yearly", "2027-03")).toBe(true);
    expect(isDueIn("2026-03", "yearly", "2027-04")).toBe(false);
  });

  it("is never due before it starts", () => {
    expect(isDueIn("2026-08", "monthly", "2026-07")).toBe(false);
  });
});
