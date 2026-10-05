import { CreditCard } from "lucide-react";
import type { Metadata } from "next";
import { CardDialog } from "@/components/cards/card-dialog";
import { CardItem } from "@/components/cards/card-item";
import { PageHeader } from "@/components/shell/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { listCards } from "@/lib/cards/queries";
import { currentMonth } from "@/lib/month";

export const metadata: Metadata = { title: "Tarjetas" };

export default async function CardsPage() {
  const month = currentMonth();
  const cards = await listCards(month);

  return (
    <>
      <PageHeader title="Tarjetas" description="Tus tarjetas de crédito y cuándo cierran.">
        <CardDialog />
      </PageHeader>
      {cards.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="Sin tarjetas por acá"
          description="Envidiable. Si tenés alguna, cargala para seguir sus cuotas mes a mes."
        />
      ) : (
        <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {cards.map((card) => (
            <CardItem key={card.id} card={card} month={month} />
          ))}
        </ul>
      )}
    </>
  );
}
