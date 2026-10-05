import { describe, expect, it } from "vitest";
import { changeWrites, valueAt } from "./effective";

const entries = [
  { month: "2026-07", value: 15_000 },
  { month: "2026-09", value: 18_000 },
];

describe("valueAt", () => {
  it("uses the latest entry that started on or before the month", () => {
    expect(valueAt(entries, "2026-08", 0)).toBe(15_000);
    expect(valueAt(entries, "2026-12", 0)).toBe(18_000);
  });

  it("falls back when nothing started yet", () => {
    expect(valueAt(entries, "2026-06", 0)).toBe(0);
  });
});

describe("changeWrites", () => {
  it("only writes the month for changes that go forward", () => {
    expect(changeWrites(entries, { month: "2026-10", value: 25_000, onlyThisMonth: false, fallback: 0 })).toEqual([
      { month: "2026-10", value: 25_000 },
    ]);
  });

  it("restores the previous value the month after a single month change", () => {
    expect(changeWrites(entries, { month: "2026-10", value: 25_000, onlyThisMonth: true, fallback: 0 })).toEqual([
      { month: "2026-10", value: 25_000 },
      { month: "2026-11", value: 18_000 },
    ]);
  });

  it("keeps the next month when it already has its own value", () => {
    expect(changeWrites(entries, { month: "2026-08", value: 20_000, onlyThisMonth: true, fallback: 0 })).toEqual([
      { month: "2026-08", value: 20_000 },
    ]);
  });

  it("goes back to the fallback when there was nothing before", () => {
    expect(changeWrites([], { month: "2026-10", value: 5_000, onlyThisMonth: true, fallback: 0 })).toEqual([
      { month: "2026-10", value: 5_000 },
      { month: "2026-11", value: 0 },
    ]);
  });
});
