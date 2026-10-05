import "server-only";
import { and, desc, eq, lte } from "drizzle-orm";
import { db } from "@/lib/db";
import { monthlyPlans } from "@/lib/db/schema";
import { monthRange } from "@/lib/month";

export async function getMonthlyPlan(userId: string, month: string) {
  const [plan] = await db
    .select({ expectedIncome: monthlyPlans.expectedIncome, savingsTarget: monthlyPlans.savingsTarget })
    .from(monthlyPlans)
    .where(and(eq(monthlyPlans.userId, userId), lte(monthlyPlans.effectiveFrom, monthRange(month).start)))
    .orderBy(desc(monthlyPlans.effectiveFrom))
    .limit(1);
  return plan ?? { expectedIncome: 0, savingsTarget: 0 };
}

export type Plan = Awaited<ReturnType<typeof getMonthlyPlan>>;

export async function savePlanFrom(userId: string, month: string, changes: Partial<Plan>) {
  const plan = { ...(await getMonthlyPlan(userId, month)), ...changes };
  await db
    .insert(monthlyPlans)
    .values({ userId, effectiveFrom: monthRange(month).start, ...plan })
    .onConflictDoUpdate({ target: [monthlyPlans.userId, monthlyPlans.effectiveFrom], set: plan });
}
