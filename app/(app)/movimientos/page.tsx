import { ArrowLeftRight } from "lucide-react";
import type { Metadata } from "next";
import { MonthSelector } from "@/components/shell/month-selector";
import { PageHeader } from "@/components/shell/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { monthParam, parseMonth } from "@/lib/month";

export const metadata: Metadata = { title: "Movimientos" };

export default async function MovementsPage({ searchParams }: PageProps<"/movimientos">) {
  const month = parseMonth((await searchParams)[monthParam]);

  return (
    <>
      <PageHeader title="Movimientos" description="Todo lo que entró y salió en el mes.">
        <MonthSelector month={month} path="/movimientos" />
      </PageHeader>
      <EmptyState
        icon={ArrowLeftRight}
        title="Ni un peso anotado todavía"
        description="Muy pronto vas a poder anotar ingresos, gastos y transferencias acá."
      />
    </>
  );
}
