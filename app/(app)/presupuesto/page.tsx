import { PiggyBank } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { BudgetRow } from "@/components/budgets/budget-row";
import { BudgetOverview } from "@/components/budgets/budget-overview";
import { ExchangeRateCard } from "@/components/budgets/exchange-rate-card";
import { UnexpectedIncomeCard } from "@/components/budgets/unexpected-income-card";
import { MonthSelector } from "@/components/shell/month-selector";
import { PageHeader } from "@/components/shell/page-header";
import { buttonClassName } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { hasPlan } from "@/lib/budgets/plan";
import { getBudgetMonth } from "@/lib/budgets/queries";
import { monthParam, parseMonth } from "@/lib/month";

export const metadata: Metadata = { title: "Presupuesto" };

export default async function BudgetPage({ searchParams }: PageProps<"/presupuesto">) {
  const month = parseMonth((await searchParams)[monthParam]);
  const { rows, summary, plan, rate, unconvertedUsd } = await getBudgetMonth(month);
  const groups = [
    { title: "Con presupuesto", rows: rows.filter((row) => row.budget > 0) },
    { title: "Sin presupuesto", rows: rows.filter((row) => row.budget === 0) },
  ].filter((group) => group.rows.length > 0);

  return (
    <>
      <PageHeader title="Presupuesto" description="Lo que planeaste contra lo que gastaste.">
        <div className="flex flex-wrap items-center gap-3">
          <MonthSelector month={month} path="/presupuesto" />
          {hasPlan(plan) && (
            <Link href="/bienvenida" className={buttonClassName("secondary", "px-4 py-2 text-sm")}>
              Armar presupuesto
            </Link>
          )}
        </div>
      </PageHeader>
      {rows.length === 0 ? (
        <EmptyState
          icon={PiggyBank}
          title="La alcancía está vacía"
          description="Creá categorías de gastos para poder ponerles un presupuesto."
        />
      ) : (
        <>
          <BudgetOverview summary={summary} plan={plan} month={month} />
          {plan.unexpectedIncome > 0 && <UnexpectedIncomeCard amount={plan.unexpectedIncome} />}
          <ExchangeRateCard month={month} rate={rate} unconvertedUsd={unconvertedUsd} />
          {groups.map((group) => (
            <section key={group.title} className="space-y-2">
              <h2 className="text-lg">{group.title}</h2>
              <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {group.rows.map((row) => (
                  <BudgetRow key={row.id} row={row} month={month} />
                ))}
              </ul>
            </section>
          ))}
        </>
      )}
    </>
  );
}
