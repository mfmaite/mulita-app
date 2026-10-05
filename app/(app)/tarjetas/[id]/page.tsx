import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { StatementLines } from "@/components/cards/statement-lines";
import { StatementProjection } from "@/components/cards/statement-projection";
import { StatementSummary } from "@/components/cards/statement-summary";
import { MonthSelector } from "@/components/shell/month-selector";
import { PageHeader } from "@/components/shell/page-header";
import { getCardStatement } from "@/lib/cards/queries";
import { formatMonth, monthParam, parseMonth } from "@/lib/month";
import { getMovementFormData } from "@/lib/movements/queries";

export const metadata: Metadata = { title: "Resumen de tarjeta" };

export default async function CardStatementPage({ params, searchParams }: PageProps<"/tarjetas/[id]">) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const month = parseMonth(query[monthParam]);
  const [{ card, lines, totals, pending, paid, projection }, { accounts }] = await Promise.all([
    getCardStatement(id, month),
    getMovementFormData(),
  ]);

  return (
    <>
      <Link
        href="/tarjetas"
        className="flex w-fit items-center gap-1 text-sm font-semibold text-primary underline-offset-4 hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Todas mis tarjetas
      </Link>
      <PageHeader title={card.name} description={`Resumen de ${formatMonth(month).toLowerCase()} · cierra el ${card.monthClosingDay}`}>
        <MonthSelector month={month} path={`/tarjetas/${card.id}`} />
      </PageHeader>
      <StatementSummary cardId={card.id} accounts={accounts} totals={totals} pending={pending} paid={paid} />
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
