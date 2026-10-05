import { shiftMonth } from "@/lib/month";

export type Entry<Value> = { month: string; value: Value };

export function valueAt<Value>(entries: Entry<Value>[], month: string, fallback: Value) {
  return entries.filter((entry) => entry.month <= month).toSorted((a, b) => b.month.localeCompare(a.month))[0]?.value ?? fallback;
}

type Change<Value> = { month: string; value: Value; onlyThisMonth: boolean; fallback: Value };

export function changeWrites<Value>(entries: Entry<Value>[], { month, value, onlyThisMonth, fallback }: Change<Value>) {
  const writes: Entry<Value>[] = [{ month, value }];
  const next = shiftMonth(month, 1);
  if (!onlyThisMonth || entries.some((entry) => entry.month === next)) return writes;
  return [...writes, { month: next, value: valueAt(entries, next, fallback) }];
}
