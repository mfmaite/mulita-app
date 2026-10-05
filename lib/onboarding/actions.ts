"use server";

import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { expenseCategoryIds, saveBudgetFrom } from "@/lib/budgets/save";
import { db } from "@/lib/db";
import { userSettings } from "@/lib/db/schema";
import type { FormState } from "@/lib/forms";
import { currentMonth } from "@/lib/month";
import { savePlanFrom } from "@/lib/plans/queries";
import { revalidateApp, saveForm } from "@/lib/save-form";
import { onboardingFields, onboardingSchema, type OnboardingField } from "./schemas";

async function markOnboarded(userId: string) {
  const onboardedAt = new Date();
  await db.insert(userSettings).values({ userId, onboardedAt }).onConflictDoUpdate({ target: userSettings.userId, set: { onboardedAt } });
}

export async function completeOnboarding(_: FormState<OnboardingField>, formData: FormData) {
  return saveForm({
    formData,
    fields: onboardingFields,
    schema: onboardingSchema,
    save: async ({ expectedIncome, savingsTarget, budgets }, userId) => {
      const month = currentMonth();
      const owned = await expenseCategoryIds(userId, Object.keys(budgets));

      await savePlanFrom(userId, month, { expectedIncome, savingsTarget });
      await Promise.all(
        Object.entries(budgets)
          .filter(([categoryId]) => owned.has(categoryId))
          .map(([categoryId, amount]) => saveBudgetFrom(userId, { categoryId, month, amount })),
      );
      await markOnboarded(userId);
    },
    success: "Tá, presupuesto armado. Cuentas claras, y tá.",
  });
}

export async function skipOnboarding() {
  const { user } = await requireSession();
  await markOnboarded(user.id);
  revalidateApp();
  redirect("/");
}
