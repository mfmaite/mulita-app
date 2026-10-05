"use server";

import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { budgets, categories, exchangeRates } from "@/lib/db/schema";
import type { FormState } from "@/lib/forms";
import { formatMonth, monthRange, parseMonth } from "@/lib/month";
import { FieldError, saveForm } from "@/lib/save-form";
import { budgetSchema, exchangeRateSchema, type BudgetField, type ExchangeRateField } from "./schemas";

export async function setBudget(categoryId: string, month: string, _: FormState<BudgetField>, formData: FormData) {
  const validMonth = parseMonth(month);

  return saveForm({
    formData,
    fields: ["amount"] as const,
    schema: budgetSchema,
    save: async ({ amount }, userId) => {
      const [category] = await db
        .select({ id: categories.id })
        .from(categories)
        .where(
          and(
            eq(categories.id, categoryId),
            eq(categories.userId, userId),
            eq(categories.kind, "expense"),
            isNull(categories.archivedAt),
          ),
        );
      if (!category) throw new FieldError("amount", "No encontramos esa categoría.");

      await db
        .insert(budgets)
        .values({ userId, categoryId, amount, effectiveFrom: monthRange(validMonth).start })
        .onConflictDoUpdate({ target: [budgets.categoryId, budgets.effectiveFrom], set: { amount } });
    },
    success: `Tá, vale desde ${formatMonth(validMonth).toLowerCase()} en adelante.`,
  });
}

export async function setExchangeRate(month: string, _: FormState<ExchangeRateField>, formData: FormData) {
  const validMonth = parseMonth(month);

  return saveForm({
    formData,
    fields: ["usdToUyu"] as const,
    schema: exchangeRateSchema,
    save: ({ usdToUyu }, userId) =>
      db
        .insert(exchangeRates)
        .values({ userId, usdToUyu, month: monthRange(validMonth).start })
        .onConflictDoUpdate({ target: [exchangeRates.userId, exchangeRates.month], set: { usdToUyu } }),
    success: "Tá, cotización guardada.",
  });
}
