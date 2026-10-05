import "server-only";
import { eq } from "drizzle-orm";
import { cache } from "react";
import { requireSession } from "@/lib/auth/session";
import { getBudgetMonth } from "@/lib/budgets/queries";
import { db } from "@/lib/db";
import { userSettings } from "@/lib/db/schema";
import { getFixedMonth } from "@/lib/fixed/queries";
import { currentMonth } from "@/lib/month";
import { getMonthlyPlan } from "@/lib/plans/queries";

export const isOnboarded = cache(async (userId: string) => {
  const [settings] = await db
    .select({ onboardedAt: userSettings.onboardedAt })
    .from(userSettings)
    .where(eq(userSettings.userId, userId));
  return Boolean(settings?.onboardedAt);
});

export async function getOnboardingData() {
  const { user } = await requireSession();
  const month = currentMonth();
  const [plan, budget, fixed, onboarded] = await Promise.all([
    getMonthlyPlan(user.id, month),
    getBudgetMonth(month),
    getFixedMonth(month),
    isOnboarded(user.id),
  ]);

  const fixedByCategory = new Map<string, number>();
  for (const { fixed: commitment, currency } of fixed.due) {
    if (commitment.kind !== "expense" || !commitment.categoryId || currency !== "UYU") continue;
    fixedByCategory.set(commitment.categoryId, (fixedByCategory.get(commitment.categoryId) ?? 0) + commitment.amount);
  }

  return {
    month,
    plan,
    onboarded,
    categories: budget.rows.map(({ id, name, budget: amount }) => ({ id, name, budget: amount, fixed: fixedByCategory.get(id) ?? 0 })),
  };
}

export type OnboardingData = Awaited<ReturnType<typeof getOnboardingData>>;
