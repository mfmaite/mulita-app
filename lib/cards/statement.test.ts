import { describe, expect, it } from "vitest";
import { installmentsInMonth, monthTotals, pendingAfter, projection, type CardPurchase } from "./statement";

function purchase(overrides: Partial<CardPurchase>): CardPurchase {
  return {
    id: "id",
    cardId: "card",
    title: "Compra",
    categoryId: "category",
    categoryName: "Categoría",
    currency: "UYU",
    amount: 0,
    installments: 1,
    firstBillingMonth: "2026-08",
    date: "2026-07-15",
    ...overrides,
  };
}

const monitor = purchase({ id: "monitor", title: "Monitor", amount: 513084, installments: 12, firstBillingMonth: "2026-01" });
const clothes = purchase({ id: "clothes", title: "Ropa", amount: 485400, installments: 3, firstBillingMonth: "2026-09" });
const icloud = purchase({ id: "icloud", title: "iCloud", currency: "USD", amount: 4099, firstBillingMonth: "2026-09" });

describe("installmentsInMonth", () => {
  it("includes installments of purchases made in earlier months", () => {
    const lines = installmentsInMonth([monitor, clothes, icloud], "2026-09");
    expect(lines.map(({ purchase, number, remaining }) => [purchase.title, number, remaining])).toEqual([
      ["Monitor", 9, 3],
      ["Ropa", 1, 2],
      ["iCloud", 1, 0],
    ]);
  });

  it("leaves out purchases that have not started or already finished", () => {
    expect(installmentsInMonth([monitor, clothes], "2026-08").map(({ purchase }) => purchase.id)).toEqual(["monitor"]);
    expect(installmentsInMonth([monitor], "2027-01")).toEqual([]);
  });
});

describe("monthTotals", () => {
  it("adds up each currency separately", () => {
    expect(monthTotals([clothes, icloud], "2026-09")).toEqual({ UYU: 161800, USD: 4099 });
  });
});

describe("pendingAfter", () => {
  it("only counts installments after the month", () => {
    expect(pendingAfter([clothes, icloud], "2026-09")).toEqual({ UYU: 323600 });
    expect(pendingAfter([clothes], "2026-11")).toEqual({});
  });
});

describe("projection", () => {
  it("projects the following months", () => {
    expect(projection([clothes], "2026-09", 3)).toEqual([
      { month: "2026-10", totals: { UYU: 161800 } },
      { month: "2026-11", totals: { UYU: 161800 } },
      { month: "2026-12", totals: {} },
    ]);
  });
});
