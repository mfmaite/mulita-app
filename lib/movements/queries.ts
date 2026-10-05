import "server-only";
import { and, desc, eq, gte, lt } from "drizzle-orm";
import { cache } from "react";
import { listAccounts } from "@/lib/accounts/queries";
import { requireSession } from "@/lib/auth/session";
import { listCategories } from "@/lib/categories/queries";
import { db } from "@/lib/db";
import { accounts, categories, movements } from "@/lib/db/schema";
import { monthRange } from "@/lib/month";

export async function listMonthMovements(month: string) {
  const { user } = await requireSession();
  const { start, end } = monthRange(month);

  return db
    .select({
      id: movements.id,
      type: movements.type,
      date: movements.date,
      amount: movements.amount,
      detail: movements.detail,
      accountId: movements.accountId,
      categoryId: movements.categoryId,
      accountName: accounts.name,
      currency: accounts.currency,
      categoryName: categories.name,
    })
    .from(movements)
    .innerJoin(accounts, eq(accounts.id, movements.accountId))
    .leftJoin(categories, eq(categories.id, movements.categoryId))
    .where(and(eq(movements.userId, user.id), gte(movements.date, start), lt(movements.date, end)))
    .orderBy(desc(movements.date), desc(movements.createdAt));
}

export type MonthMovement = Awaited<ReturnType<typeof listMonthMovements>>[number];

export const getMovementFormData = cache(async () => {
  const { user } = await requireSession();

  const [accountRows, categoryRows, [lastMovement]] = await Promise.all([
    listAccounts(),
    listCategories(),
    db
      .select({ accountId: movements.accountId })
      .from(movements)
      .where(eq(movements.userId, user.id))
      .orderBy(desc(movements.createdAt))
      .limit(1),
  ]);

  const lastAccountId = accountRows.some((account) => account.id === lastMovement?.accountId)
    ? lastMovement?.accountId
    : accountRows[0]?.id;

  return {
    accounts: accountRows.map(({ id, name, currency }) => ({ id, name, currency })),
    categories: categoryRows.map(({ id, name, kind }) => ({ id, name, kind })),
    lastAccountId,
  };
});

export type MovementFormData = Awaited<ReturnType<typeof getMovementFormData>>;
