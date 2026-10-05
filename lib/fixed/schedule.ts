import { differenceInCalendarMonths, parse } from "date-fns";
import type { Frequency } from "@/lib/db/schema";

export const frequencyMonths: Record<Frequency, number> = {
  monthly: 1,
  bimonthly: 2,
  quarterly: 3,
  yearly: 12,
};

const toDate = (month: string) => parse(month.slice(0, 7), "yyyy-MM", new Date());

export function isDueIn(startMonth: string, frequency: Frequency, month: string) {
  const elapsed = differenceInCalendarMonths(toDate(month), toDate(startMonth));
  return elapsed >= 0 && elapsed % frequencyMonths[frequency] === 0;
}
