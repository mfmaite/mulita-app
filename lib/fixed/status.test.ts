import { describe, expect, it } from "vitest";
import { fixedMonthTotals, fixedStatus } from "./status";

describe("fixedStatus", () => {
  const base = { dueDay: 10, paid: false, month: "2026-10" };

  it("is paid when it has a payment, even if the due day passed", () => {
    expect(fixedStatus({ ...base, paid: true, today: "2026-10-25" })).toBe("paid");
  });

  it("is pending until the due day and overdue after it", () => {
    expect(fixedStatus({ ...base, today: "2026-10-10" })).toBe("pending");
    expect(fixedStatus({ ...base, today: "2026-10-11" })).toBe("overdue");
  });

  it("is overdue for past months and pending for future ones", () => {
    expect(fixedStatus({ ...base, month: "2026-09", today: "2026-10-01" })).toBe("overdue");
    expect(fixedStatus({ ...base, month: "2026-11", today: "2026-10-31" })).toBe("pending");
  });

  it("caps the due day at the end of short months", () => {
    expect(fixedStatus({ ...base, dueDay: 31, month: "2026-02", today: "2026-02-28" })).toBe("pending");
  });
});

describe("fixedMonthTotals", () => {
  it("adds what is left by currency and counts the real amount of paid ones", () => {
    const totals = fixedMonthTotals([
      { currency: "UYU", estimate: 2_500_000, paidAmount: 2_507_700 },
      { currency: "UYU", estimate: 210_000, paidAmount: null },
      { currency: "USD", estimate: 1_000, paidAmount: null },
    ]);

    expect(totals).toEqual({
      left: { UYU: 210_000, USD: 1_000 },
      total: { UYU: 2_717_700, USD: 1_000 },
      paidCount: 1,
      count: 3,
    });
  });
});
