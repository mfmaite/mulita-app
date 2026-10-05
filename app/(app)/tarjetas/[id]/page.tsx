import type { Metadata } from "next";
import { StatementLines } from "@/components/cards/statement-lines";
import { StatementProjection } from "@/components/cards/statement-projection";
import { StatementSummary } from "@/components/cards/statement-summary";
import { MonthSelector } from "@/components/shell/month-selector";
import { PageHeader } from "@/components/shell/page-header";
import { getCardStatement } from "@/lib/cards/queries";
import { formatMonth, monthParam, parseMonth } from "@/lib/month";

export const metadata: Metadata = { title: "Resumen de tarjeta" };

export default async function CardStatementPage({ params, searchParams }: PageProps<"/tarjetas/[id]">) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const month = parseMonth(query[monthParam]);
  const { card, lines, totals, pending, projection } = await getCardStatement(id, month);

  return (
    <>
      <PageHeader title={card.name} description={`Resumen de ${formatMonth(month).toLowerCase()} · cierra el ${card.monthClosingDay}`}>
        <MonthSelector month={month} path={`/tarjetas/${card.id}`} />
      </PageHeader>
      <StatementSummary totals={totals} pending={pending} />
      <section className="space-y-2">
        <h2 className="text-lg">Cuotas del mes</h2>
        <StatementLines lines={lines} />
      </section>
      <section className="space-y-2">
        <h2 className="text-lg">Próximos meses</h2>
        <StatementProjection projection={projection} />
      </section>
    </>
  );
}
