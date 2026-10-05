import { getDaysInMonth, parse } from "date-fns";

type ClosingOverride = { month: string; closingDay: number };

export function closingDayFor(defaultDay: number, overrides: ClosingOverride[], month: string) {
  const override = overrides.find((candidate) => candidate.month.startsWith(month));
  const day = override?.closingDay ?? defaultDay;
  return Math.min(day, getDaysInMonth(parse(month, "yyyy-MM", new Date())));
}
