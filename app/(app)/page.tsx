import { Wallet } from "lucide-react";
import Link from "next/link";
import { BudgetCard } from "@/components/dashboard/budget-card";
import { CashCard } from "@/components/dashboard/cash-card";
import { InstallmentsCard } from "@/components/dashboard/installments-card";
import { MonthCard } from "@/components/dashboard/month-card";
import { MonthSelector } from "@/components/shell/month-selector";
import { PageHeader } from "@/components/shell/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { requireSession } from "@/lib/auth/session";
import { getDashboard } from "@/lib/dashboard/queries";
import { monthParam, parseMonth } from "@/lib/month";

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const [{ user }, params] = await Promise.all([requireSession(), searchParams]);
  const month = parseMonth(params[monthParam]);
  const dashboard = await getDashboard(month);

  return (
    <>
      <PageHeader title={`¡Hola, ${user.name.split(" ")[0]}!`} description="Así vienen tus cuentas este mes.">
        <MonthSelector month={month} path="/" />
      </PageHeader>
      {dashboard.hasAccounts ? (
        <div className="grid gap-3 lg:grid-cols-2">
          <CashCard cash={dashboard.cash} />
          <MonthCard summary={dashboard.summary} month={month} />
          <BudgetCard budget={dashboard.budget} month={month} />
          <InstallmentsCard installments={dashboard.installments} />
        </div>
      ) : (
        <EmptyState
          icon={Wallet}
          title="Arranquemos por el principio"
          description="Cargá tu primera cuenta (la caja de ahorro, la de dólares o la plata del colchón) y Mulita empieza a ordenar todo."
        >
          <Link href="/cuentas" className="font-semibold text-primary underline-offset-4 hover:underline">
            Crear mi primera cuenta
          </Link>
        </EmptyState>
      )}
    </>
  );
}
