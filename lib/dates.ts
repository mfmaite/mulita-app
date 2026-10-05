import { TZDate } from "@date-fns/tz";
import { format, getDayOfYear, parseISO } from "date-fns";
import { capitalize } from "@/lib/text";

export const timeZone = "America/Montevideo";

const dayFormatter = new Intl.DateTimeFormat("es-UY", { weekday: "long", day: "numeric", month: "long" });

export function today() {
  return format(TZDate.tz(timeZone), "yyyy-MM-dd");
}

export function dayOfYear() {
  return getDayOfYear(TZDate.tz(timeZone));
}

export function formatDay(date: string) {
  return capitalize(dayFormatter.format(parseISO(date)));
}
