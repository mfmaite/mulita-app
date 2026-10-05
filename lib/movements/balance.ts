import type { MovementType } from "@/lib/db/schema";

export type MovementTotals = Partial<Record<MovementType, number>>;

const direction: Record<MovementType, 1 | -1> = { income: 1, expense: -1 };

export function signedAmount(type: MovementType, amount: number) {
  return direction[type] * amount;
}

export function balanceFrom(initialBalance: number, totals: MovementTotals) {
  return Object.entries(totals).reduce(
    (balance, [type, total]) => balance + signedAmount(type as MovementType, total ?? 0),
    initialBalance,
  );
}
