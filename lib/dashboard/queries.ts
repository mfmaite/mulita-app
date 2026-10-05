import "server-only";
import { accountsWithBalance } from "@/lib/accounts/queries";
import { requireSession } from "@/lib/auth/session";
import { getBudgetMonth } from "@/lib/budgets/queries";
import { listCardPurchases } from "@/lib/cards/queries";
import { monthTotals, totalsByCurrency } from "@/lib/cards/statement";
import { dayOfYear } from "@/lib/dates";
import { getFixedMonth } from "@/lib/fixed/queries";
import { shiftMonth } from "@/lib/month";
import { monthMovementTotals, rateFor } from "@/lib/movements/month-totals";
import { pickTip } from "@/lib/tips";
import { monthSummary } from "./summary";

export async function getDashboard(month: string) {
  const { user } = await requireSession();

  const [accountRows, totalsRows, purchases, rate, budget, fixedMonth] = await Promise.all([
    accountsWithBalance(user.id),
    monthMovementTotals(user.id, month),
    listCardPurchases(user.id),
    rateFor(user.id, month),
    getBudgetMonth(month),
    getFixedMonth(month),
  ]);

  const installmentsThisMonth = monthTotals(purchases, month);

  const tip = pickTip(
    {
      overBudget: budget.rows.filter((row) => row.level === "over").map((row) => row.name),
      unexpectedIncome: budget.plan.unexpectedIncome,
      hasBudget: budget.summary.budgeted > 0,
    },
    dayOfYear(),
  );

  return {
    hasAccounts: accountRows.length > 0,
    tip,
    cash: totalsByCurrency(
      accountRows
        .filter((account) => account.type !== "savings")
        .map(({ currency, balance }) => ({ currency, amount: balance })),
    ),
    summary: monthSummary(totalsRows, installmentsThisMonth, rate),
    installments: { thisMonth: installmentsThisMonth, nextMonth: monthTotals(purchases, shiftMonth(month, 1)) },
    fixed: {
      totals: fixedMonth.totals,
      pending: fixedMonth.due.filter(({ payment }) => !payment).slice(0, 3),
    },
    budget: {
      summary: budget.summary,
      plan: budget.plan,
      highlights: budget.rows
        .filter((row) => row.budget > 0)
        .toSorted((a, b) => (b.percent ?? 0) - (a.percent ?? 0))
        .slice(0, 3),
    },
  };
}

export type Dashboard = Awaited<ReturnType<typeof getDashboard>>;
