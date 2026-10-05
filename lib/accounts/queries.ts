import "server-only";
import { and, asc, eq, isNull, sum } from "drizzle-orm";
import { requireSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { accounts, movements } from "@/lib/db/schema";
import { balanceFrom } from "@/lib/movements/balance";

export async function listAccounts() {
  const { user } = await requireSession();

  const [rows, totals] = await Promise.all([
    db
      .select()
      .from(accounts)
      .where(and(eq(accounts.userId, user.id), isNull(accounts.archivedAt)))
      .orderBy(asc(accounts.currency), asc(accounts.name)),
    db
      .select({ accountId: movements.accountId, type: movements.type, total: sum(movements.amount).mapWith(Number) })
      .from(movements)
      .where(eq(movements.userId, user.id))
      .groupBy(movements.accountId, movements.type),
  ]);

  return rows.map((account) => {
    const accountTotals = totals.filter((total) => total.accountId === account.id);
    return {
      ...account,
      balance: balanceFrom(account.initialBalance, Object.fromEntries(accountTotals.map(({ type, total }) => [type, total]))),
    };
  });
}

export type AccountWithBalance = Awaited<ReturnType<typeof listAccounts>>[number];
