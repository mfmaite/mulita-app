"use server";

import { db } from "@/lib/db";
import { exchangeRates } from "@/lib/db/schema";
import type { FormState } from "@/lib/forms";
import { monthRange, parseMonth } from "@/lib/month";
import { FieldError, saveForm } from "@/lib/save-form";
import { changeMessage } from "./messages";
import { expenseCategoryIds, saveBudgetFrom } from "./save";
import { budgetSchema, exchangeRateSchema, type BudgetField, type ExchangeRateField } from "./schemas";

export async function setBudget(categoryId: string, month: string, _: FormState<BudgetField>, formData: FormData) {
  const validMonth = parseMonth(month);

  return saveForm({
    formData,
    fields: ["amount", "onlyThisMonth"] as const,
    schema: budgetSchema,
    save: async ({ amount, onlyThisMonth }, userId) => {
      const categoryIds = await expenseCategoryIds(userId, [categoryId]);
      if (!categoryIds.has(categoryId)) throw new FieldError("amount", "No encontramos esa categoría.");

      await saveBudgetFrom(userId, { categoryId, month: validMonth, amount, onlyThisMonth });
      return changeMessage(validMonth, onlyThisMonth);
    },
    success: changeMessage(validMonth, false),
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
