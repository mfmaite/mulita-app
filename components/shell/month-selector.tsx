import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { currentMonth, formatMonth, monthParam, shiftMonth } from "@/lib/month";

type MonthSelectorProps = {
  month: string;
  path: string;
};

const arrowClass = "rounded-full p-1.5 text-green-800 hover:bg-cream-100 sm:p-2";

export function MonthSelector({ month, path }: MonthSelectorProps) {
  const hrefFor = (target: string) => `${path}?${monthParam}=${target}`;
  const isCurrent = month === currentMonth();

  return (
    <div className="flex items-center gap-2 self-start sm:self-auto">
      {!isCurrent && (
        <Link href={path} className="rounded-full px-2.5 py-1 text-sm font-semibold text-primary hover:bg-cream-100 sm:px-3 sm:py-1.5">
          Hoy
        </Link>
      )}
      <div className="flex items-center rounded-full border border-border bg-surface p-0.5 sm:p-1">
        <Link href={hrefFor(shiftMonth(month, -1))} aria-label="Mes anterior" className={arrowClass}>
          <ChevronLeft className="size-4 sm:size-5" aria-hidden />
        </Link>
        <span className="min-w-28 text-center font-display font-bold sm:min-w-36 sm:text-lg">{formatMonth(month)}</span>
        <Link href={hrefFor(shiftMonth(month, 1))} aria-label="Mes siguiente" className={arrowClass}>
          <ChevronRight className="size-4 sm:size-5" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
