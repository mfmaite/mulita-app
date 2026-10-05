import { PiggyBank } from "lucide-react";
import type { Metadata } from "next";
import { MonthSelector } from "@/components/shell/month-selector";
import { PageHeader } from "@/components/shell/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { monthParam, parseMonth } from "@/lib/month";

export const metadata: Metadata = { title: "Presupuesto" };

export default async function BudgetPage({ searchParams }: PageProps<"/presupuesto">) {
  const month = parseMonth((await searchParams)[monthParam]);

  return (
    <>
      <PageHeader title="Presupuesto" description="Lo que planeaste contra lo que gastaste.">
        <MonthSelector month={month} path="/presupuesto" />
      </PageHeader>
      <EmptyState
        icon={PiggyBank}
        title="La alcancía está vacía"
        description="Muy pronto vas a poder ponerle un presupuesto a cada categoría."
      />
    </>
  );
}
