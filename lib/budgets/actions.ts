"use server";

import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { budgets, categories, exchangeRates } from "@/lib/db/schema";
import type { FormState } from "@/lib/forms";
import { monthRange, parseMonth } from "@/lib/month";
import { FieldError, saveForm } from "@/lib/save-form";
import { changeWrites } from "./effective";
import { changeMessage } from "./messages";
import { budgetSchema, exchangeRateSchema, type BudgetField, type ExchangeRateField } from "./schemas";

export async function setBudget(categoryId: string, month: string, _: FormState<BudgetField>, formData: FormData) {
  const validMonth = parseMonth(month);

  return saveForm({
    formData,
    fields: ["amount", "onlyThisMonth"] as const,
    schema: budgetSchema,
    save: async ({ amount, onlyThisMonth }, userId) => {
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

      const rows = await db
        .select({ effectiveFrom: budgets.effectiveFrom, amount: budgets.amount })
        .from(budgets)
        .where(eq(budgets.categoryId, categoryId));
      const entries = rows.map((row) => ({ month: row.effectiveFrom.slice(0, 7), value: row.amount }));

      await Promise.all(
        changeWrites(entries, { month: validMonth, value: amount, onlyThisMonth, fallback: 0 }).map((write) =>
          db
            .insert(budgets)
            .values({ userId, categoryId, amount: write.value, effectiveFrom: monthRange(write.month).start })
            .onConflictDoUpdate({ target: [budgets.categoryId, budgets.effectiveFrom], set: { amount: write.value } }),
        ),
      );
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
