import { CalendarCheck } from "lucide-react";
import type { Metadata } from "next";
import { FixedDialog } from "@/components/fixed/fixed-dialog";
import { FixedRow } from "@/components/fixed/fixed-row";
import type { FixedStatusRow } from "@/components/fixed/fixed-status-label";
import { FixedSection } from "@/components/fixed/fixed-section";
import { FixedSummary } from "@/components/fixed/fixed-summary";
import { PayFixedDialog } from "@/components/fixed/pay-fixed-dialog";
import { MonthSelector } from "@/components/shell/month-selector";
import { PageHeader } from "@/components/shell/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { getFixedMonth } from "@/lib/fixed/queries";
import { formatMonth, monthParam, parseMonth } from "@/lib/month";
import { getMovementFormData } from "@/lib/movements/queries";

export const metadata: Metadata = { title: "Fijos" };

export default async function FixedPage({ searchParams }: PageProps<"/fijos">) {
  const month = parseMonth((await searchParams)[monthParam]);
  const [{ due, notDue, paused, totals }, data] = await Promise.all([getFixedMonth(month), getMovementFormData()]);
  const isEmpty = due.length + notDue.length + paused.length === 0;
  const monthLabel = formatMonth(month).toLowerCase();

  const pending = due.filter(({ payment }) => !payment);

  const otherSections: { title: string; description?: string; rows: FixedStatusRow[] }[] = [
    { title: "Este mes no tocan", description: "Se pagan cada algunos meses.", rows: notDue },
    { title: "En pausa", rows: paused },
    { title: "Ya pagados", rows: due.filter(({ payment }) => payment) },
  ].filter((section) => section.rows.length > 0);

  return (
    <>
      <PageHeader title="Fijos" description="Lo que se paga sí o sí, todos los meses o cada tanto.">
        <div className="flex flex-wrap items-center gap-3">
          <MonthSelector month={month} path="/fijos" />
          <FixedDialog data={data} />
        </div>
      </PageHeader>
      {isEmpty ? (
        <EmptyState
          icon={CalendarCheck}
          title="Nada agendado todavía"
          description="Cargá el alquiler, la UTE, el FONASA y el resto de lo que pagás sí o sí, y Mulita te avisa qué falta cada mes."
        />
      ) : (
        <>
          {due.length > 0 && <FixedSummary totals={totals} monthLabel={monthLabel} />}
          {pending.length > 0 && (
            <FixedSection title={`Por pagar en ${monthLabel}`}>
              {pending.map((row) => (
                <FixedRow
                  key={row.fixed.id}
                  row={row}
                  pay={<PayFixedDialog row={row} month={month} />}
                  actions={<FixedDialog data={data} fixed={row.fixed} />}
                />
              ))}
            </FixedSection>
          )}
          {otherSections.map(({ title, description, rows }) => (
            <FixedSection key={title} title={title} description={description}>
              {rows.map((row) => (
                <FixedRow key={row.fixed.id} row={row} actions={<FixedDialog data={data} fixed={row.fixed} />} />
              ))}
            </FixedSection>
          ))}
        </>
      )}
    </>
  );
}
