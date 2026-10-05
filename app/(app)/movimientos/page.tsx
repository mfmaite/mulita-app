import { ArrowLeftRight } from "lucide-react";
import type { Metadata } from "next";
import { MovementList } from "@/components/movements/movement-list";
import { MonthSelector } from "@/components/shell/month-selector";
import { PageHeader } from "@/components/shell/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { formatMonth, monthParam, parseMonth } from "@/lib/month";
import { getMovementFormData, listMonthMovements } from "@/lib/movements/queries";

export const metadata: Metadata = { title: "Movimientos" };

export default async function MovementsPage({ searchParams }: PageProps<"/movimientos">) {
  const month = parseMonth((await searchParams)[monthParam]);
  const [movements, data] = await Promise.all([listMonthMovements(month), getMovementFormData()]);

  return (
    <>
      <PageHeader title="Movimientos" description="Todo lo que entró y salió en el mes.">
        <MonthSelector month={month} path="/movimientos" />
      </PageHeader>
      {movements.length === 0 ? (
        <EmptyState
          icon={ArrowLeftRight}
          title={`Ni un peso anotado en ${formatMonth(month).toLowerCase()}`}
          description="Creá tu primer gasto o ingreso del mes con el botón Crear movimiento."
        />
      ) : (
        <MovementList movements={movements} data={data} />
      )}
    </>
  );
}
