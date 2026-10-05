import { ChevronRight, CreditCard } from "lucide-react";
import Link from "next/link";
import type { CardWithClosing } from "@/lib/cards/queries";
import { CardDialog } from "./card-dialog";
import { ClosingOverrideDialog } from "./closing-override-dialog";
import { CurrencyTotals } from "./currency-totals";

type CardItemProps = {
  card: CardWithClosing;
  month: string;
};

export function CardItem({ card, month }: CardItemProps) {
  const closesDifferently = card.monthClosingDay !== card.closingDay;

  return (
    <li className="flex items-center gap-2 rounded-2xl border border-border bg-surface py-3 pr-2 pl-4">
      <Link href={`/tarjetas/${card.id}`} className="group flex min-w-0 flex-1 items-center gap-3">
        <span className="rounded-full bg-cream-100 p-2.5 text-green-700">
          <CreditCard className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 leading-snug font-semibold group-hover:underline">
            {card.name}
            <ChevronRight className="size-4 text-muted" aria-hidden />
          </p>
          <p className="text-sm text-muted">
            Este mes: <CurrencyTotals totals={card.monthTotals} empty="nada" className="font-semibold text-foreground" />
          </p>
          <p className="text-sm text-muted">
            Cierra el {card.closingDay}
            {closesDifferently && (
              <span className="font-medium text-warning-strong"> · este mes, el {card.monthClosingDay}</span>
            )}
          </p>
        </div>
      </Link>
      <div className="flex shrink-0">
        <ClosingOverrideDialog card={card} month={month} />
        <CardDialog card={card} />
      </div>
    </li>
  );
}
