import { formatShortDay } from "@/lib/dates";
import type { DueFixed, FixedRow } from "@/lib/fixed/queries";

export type FixedStatusRow = FixedRow & Partial<Pick<DueFixed, "status" | "payment">>;

export function FixedStatusLabel({ row: { fixed, status, payment } }: { row: FixedStatusRow }) {
  if (payment) return <span className="font-semibold text-success-strong">Pagado el {formatShortDay(payment.date)}</span>;
  if (status === "overdue") return <span className="font-semibold text-danger-strong">Venció el {fixed.dueDay}</span>;
  return <>Vence el {fixed.dueDay}</>;
}
