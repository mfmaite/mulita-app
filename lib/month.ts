import { TZDate } from "@date-fns/tz";
import { addMonths, format, getYear, isValid, parse } from "date-fns";
import { timeZone } from "@/lib/dates";
import { capitalize } from "@/lib/text";

const monthFormat = "yyyy-MM";
const monthName = new Intl.DateTimeFormat("es-UY", { month: "long" });

export const monthParam = "mes";

function toDate(month: string) {
  return parse(month, monthFormat, new Date());
}

function isMonth(value: string) {
  const date = toDate(value);
  return isValid(date) && format(date, monthFormat) === value;
}

export function currentMonth() {
  return format(TZDate.tz(timeZone), monthFormat);
}

export function parseMonth(value: string | string[] | undefined) {
  return typeof value === "string" && isMonth(value) ? value : currentMonth();
}

export function shiftMonth(month: string, amount: number) {
  return format(addMonths(toDate(month), amount), monthFormat);
}

export function monthRange(month: string) {
  return { start: `${month}-01`, end: `${shiftMonth(month, 1)}-01` };
}

export function formatMonth(month: string) {
  const date = toDate(month);
  return `${capitalize(monthName.format(date))} ${getYear(date)}`;
}
