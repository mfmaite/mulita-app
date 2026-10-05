import { getDate, getDaysInMonth, parse, parseISO } from "date-fns";
import { totalsByCurrency } from "@/lib/cards/statement";
import type { Currency } from "@/lib/db/schema";

export type FixedStatus = "pending" | "overdue" | "paid";

type StatusInput = { dueDay: number; paid: boolean; month: string; today: string };

export function fixedStatus({ dueDay, paid, month, today }: StatusInput): FixedStatus {
  if (paid) return "paid";

  const todayMonth = today.slice(0, 7);
  if (month > todayMonth) return "pending";
  if (month < todayMonth) return "overdue";

  const lastDay = getDaysInMonth(parse(month, "yyyy-MM", new Date()));
  return getDate(parseISO(today)) > Math.min(dueDay, lastDay) ? "overdue" : "pending";
}

type DueItem = { currency: Currency; estimate: number; paidAmount: number | null };

export function fixedMonthTotals(items: DueItem[]) {
  return {
    left: totalsByCurrency(
      items.filter(({ paidAmount }) => paidAmount === null).map(({ currency, estimate }) => ({ currency, amount: estimate })),
    ),
    total: totalsByCurrency(items.map(({ currency, estimate, paidAmount }) => ({ currency, amount: paidAmount ?? estimate }))),
    paidCount: items.filter(({ paidAmount }) => paidAmount !== null).length,
    count: items.length,
  };
}
