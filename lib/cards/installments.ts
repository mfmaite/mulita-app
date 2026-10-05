import { getDate, parseISO } from "date-fns";
import { shiftMonth } from "@/lib/month";

export function installmentAmounts(total: number, count: number) {
  const base = Math.floor(total / count);
  const remainder = total - base * count;
  return Array.from({ length: count }, (_, index) => base + (index < remainder ? 1 : 0));
}

type Purchase = { total: number; count: number; firstMonth: string };

export function installmentSchedule({ total, count, firstMonth }: Purchase) {
  return installmentAmounts(total, count).map((amount, index) => ({
    number: index + 1,
    month: shiftMonth(firstMonth, index),
    amount,
  }));
}

export function suggestFirstBillingMonth(purchaseDate: string, closingDay: number) {
  const purchaseMonth = purchaseDate.slice(0, 7);
  return shiftMonth(purchaseMonth, getDate(parseISO(purchaseDate)) <= closingDay ? 1 : 2);
}
