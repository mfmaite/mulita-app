import type { MovementType } from "@/lib/db/schema";

export type BalanceTotals = Partial<Record<MovementType | "transferIn", number>>;

const direction: Record<keyof BalanceTotals, 1 | -1> = {
  income: 1,
  expense: -1,
  transfer: -1,
  adjustment: 1,
  transferIn: 1,
};

export function signedAmount(type: MovementType, amount: number) {
  return direction[type] * amount;
}

export function balanceFrom(initialBalance: number, totals: BalanceTotals) {
  return Object.entries(totals).reduce(
    (balance, [key, total]) => balance + direction[key as keyof BalanceTotals] * (total ?? 0),
    initialBalance,
  );
}
