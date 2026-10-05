import "server-only";
import { asc, desc, eq } from "drizzle-orm";
import { accountsWithBalance } from "@/lib/accounts/queries";
import { requireSession } from "@/lib/auth/session";
import { toPesos } from "@/lib/budgets/calculations";
import { db } from "@/lib/db";
import { exchangeRates, savingsGoals, userSettings } from "@/lib/db/schema";
import { currentMonth } from "@/lib/month";
import { goalProgress, unassignedShare } from "./calculations";

export async function getSavingsPlan(userId: string) {
  const [settings] = await db
    .select({ monthlySavingsPlan: userSettings.monthlySavingsPlan })
    .from(userSettings)
    .where(eq(userSettings.userId, userId));
  return settings?.monthlySavingsPlan ?? 0;
}

export async function getSavingsPool(userId: string) {
  const [accountRows, [rate]] = await Promise.all([
    accountsWithBalance(userId),
    db
      .select({ usdToUyu: exchangeRates.usdToUyu })
      .from(exchangeRates)
      .where(eq(exchangeRates.userId, userId))
      .orderBy(desc(exchangeRates.month))
      .limit(1),
  ]);

  return accountRows
    .filter((account) => account.type === "savings")
    .reduce(
      (pool, account) => {
        const pesos = toPesos(account.balance, account.currency, rate?.usdToUyu);
        return pesos === null
          ? { ...pool, unconvertedUsd: pool.unconvertedUsd + account.balance }
          : { ...pool, total: pool.total + pesos };
      },
      { total: 0, unconvertedUsd: 0 },
    );
}

export async function getGoalsOverview() {
  const { user } = await requireSession();
  const month = currentMonth();

  const [goals, monthlyPlan, pool] = await Promise.all([
    db.select().from(savingsGoals).where(eq(savingsGoals.userId, user.id)).orderBy(desc(savingsGoals.share), asc(savingsGoals.name)),
    getSavingsPlan(user.id),
    getSavingsPool(user.id),
  ]);

  return {
    goals: goals.map((goal) => ({ ...goal, ...goalProgress(goal, pool.total, monthlyPlan, month) })),
    monthlyPlan,
    pool,
    unassigned: unassignedShare(goals),
  };
}

export type GoalsOverview = Awaited<ReturnType<typeof getGoalsOverview>>;
export type GoalWithProgress = GoalsOverview["goals"][number];
