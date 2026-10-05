import { describe, expect, it } from "vitest";
import { closingDayFor } from "./closing";

describe("closingDayFor", () => {
  const overrides = [{ month: "2026-08-01", closingDay: 28 }];

  it("uses the card closing day by default", () => {
    expect(closingDayFor(27, overrides, "2026-07")).toBe(27);
  });

  it("uses the override for that month", () => {
    expect(closingDayFor(27, overrides, "2026-08")).toBe(28);
  });

  it("closes on the last day when the month is shorter", () => {
    expect(closingDayFor(31, [], "2026-09")).toBe(30);
    expect(closingDayFor(30, [], "2027-02")).toBe(28);
  });
});
