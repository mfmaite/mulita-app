import "server-only";
import { and, desc, eq, lte } from "drizzle-orm";
import { db } from "@/lib/db";
import { monthlyPlans } from "@/lib/db/schema";
import { changeWrites, valueAt } from "@/lib/budgets/effective";
import { monthRange } from "@/lib/month";

const emptyPlan = { expectedIncome: 0, savingsTarget: 0 };

export async function getMonthlyPlan(userId: string, month: string) {
  const [plan] = await db
    .select({ expectedIncome: monthlyPlans.expectedIncome, savingsTarget: monthlyPlans.savingsTarget })
    .from(monthlyPlans)
    .where(and(eq(monthlyPlans.userId, userId), lte(monthlyPlans.effectiveFrom, monthRange(month).start)))
    .orderBy(desc(monthlyPlans.effectiveFrom))
    .limit(1);
  return plan ?? emptyPlan;
}

export type Plan = Awaited<ReturnType<typeof getMonthlyPlan>>;

export async function savePlanFrom(userId: string, month: string, changes: Partial<Plan>, onlyThisMonth = false) {
  const rows = await db
    .select({
      effectiveFrom: monthlyPlans.effectiveFrom,
      expectedIncome: monthlyPlans.expectedIncome,
      savingsTarget: monthlyPlans.savingsTarget,
    })
    .from(monthlyPlans)
    .where(eq(monthlyPlans.userId, userId));
  const entries = rows.map(({ effectiveFrom, ...value }) => ({ month: effectiveFrom.slice(0, 7), value }));
  const value = { ...valueAt(entries, month, emptyPlan), ...changes };

  await Promise.all(
    changeWrites(entries, { month, value, onlyThisMonth, fallback: emptyPlan }).map((write) =>
      db
        .insert(monthlyPlans)
        .values({ userId, effectiveFrom: monthRange(write.month).start, ...write.value })
        .onConflictDoUpdate({ target: [monthlyPlans.userId, monthlyPlans.effectiveFrom], set: write.value }),
    ),
  );
}
