import "server-only";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { budgets, categories } from "@/lib/db/schema";
import { monthRange } from "@/lib/month";
import { changeWrites, valueAt } from "./effective";

export async function expenseCategoryIds(userId: string, ids: string[]) {
  if (ids.length === 0) return new Set<string>();
  const rows = await db
    .select({ id: categories.id })
    .from(categories)
    .where(
      and(inArray(categories.id, ids), eq(categories.userId, userId), eq(categories.kind, "expense"), isNull(categories.archivedAt)),
    );
  return new Set(rows.map(({ id }) => id));
}

type BudgetChange = { categoryId: string; month: string; amount: number; onlyThisMonth?: boolean };

export async function saveBudgetFrom(userId: string, { categoryId, month, amount, onlyThisMonth = false }: BudgetChange) {
  const rows = await db
    .select({ effectiveFrom: budgets.effectiveFrom, amount: budgets.amount })
    .from(budgets)
    .where(eq(budgets.categoryId, categoryId));
  const entries = rows.map((row) => ({ month: row.effectiveFrom.slice(0, 7), value: row.amount }));
  if (!onlyThisMonth && valueAt(entries, month, 0) === amount) return;

  await Promise.all(
    changeWrites(entries, { month, value: amount, onlyThisMonth, fallback: 0 }).map((write) =>
      db
        .insert(budgets)
        .values({ userId, categoryId, amount: write.value, effectiveFrom: monthRange(write.month).start })
        .onConflictDoUpdate({ target: [budgets.categoryId, budgets.effectiveFrom], set: { amount: write.value } }),
    ),
  );
}
