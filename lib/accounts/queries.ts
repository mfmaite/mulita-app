import "server-only";
import { and, asc, eq, isNotNull, isNull, sum } from "drizzle-orm";
import { requireSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { accounts, movements } from "@/lib/db/schema";
import { balanceFrom, type BalanceTotals } from "@/lib/movements/balance";

export async function accountsWithBalance(userId: string) {
  const [rows, outgoing, incoming] = await Promise.all([
    db
      .select()
      .from(accounts)
      .where(and(eq(accounts.userId, userId), isNull(accounts.archivedAt)))
      .orderBy(asc(accounts.currency), asc(accounts.name)),
    db
      .select({ accountId: movements.accountId, key: movements.type, total: sum(movements.amount).mapWith(Number) })
      .from(movements)
      .where(eq(movements.userId, userId))
      .groupBy(movements.accountId, movements.type),
    db
      .select({ accountId: movements.destinationAccountId, total: sum(movements.destinationAmount).mapWith(Number) })
      .from(movements)
      .where(and(eq(movements.userId, userId), isNotNull(movements.destinationAccountId)))
      .groupBy(movements.destinationAccountId),
  ]);

  const totals = [...outgoing, ...incoming.map(({ accountId, total }) => ({ accountId, key: "transferIn" as const, total }))];

  return rows.map((account) => {
    const accountTotals: BalanceTotals = Object.fromEntries(
      totals.filter((total) => total.accountId === account.id).map(({ key, total }) => [key, total]),
    );
    return { ...account, balance: balanceFrom(account.initialBalance, accountTotals) };
  });
}

export async function listAccounts() {
  const { user } = await requireSession();
  return accountsWithBalance(user.id);
}

export type AccountWithBalance = Awaited<ReturnType<typeof listAccounts>>[number];
