import { CreditCard } from "lucide-react";
import type { CardWithClosing } from "@/lib/cards/queries";
import { CardDialog } from "./card-dialog";
import { ClosingOverrideDialog } from "./closing-override-dialog";

type CardItemProps = {
  card: CardWithClosing;
  month: string;
};

export function CardItem({ card, month }: CardItemProps) {
  const closesDifferently = card.monthClosingDay !== card.closingDay;

  return (
    <li className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3">
      <span className="rounded-full bg-cream-100 p-2.5 text-green-700">
        <CreditCard className="size-5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="leading-snug font-semibold">{card.name}</p>
        <p className="text-sm text-muted">
          Cierra el {card.closingDay}
          {closesDifferently && (
            <span className="font-medium text-warning-strong"> · este mes, el {card.monthClosingDay}</span>
          )}
        </p>
      </div>
      <div className="flex shrink-0">
        <ClosingOverrideDialog card={card} month={month} />
        <CardDialog card={card} />
      </div>
    </li>
  );
}
