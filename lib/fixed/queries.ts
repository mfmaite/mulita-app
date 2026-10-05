import "server-only";
import { asc, eq, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { requireSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { accounts, categories, creditCards, fixedCommitments, type Currency } from "@/lib/db/schema";
import { isDueIn } from "./schedule";

const destinationAccounts = alias(accounts, "destination_accounts");

export async function listFixed(userId: string) {
  return db
    .select({
      fixed: fixedCommitments,
      categoryName: categories.name,
      accountName: accounts.name,
      cardName: creditCards.name,
      destinationName: destinationAccounts.name,
      currency: sql<Currency>`coalesce(${fixedCommitments.currency}, ${accounts.currency}, 'UYU')`,
    })
    .from(fixedCommitments)
    .leftJoin(categories, eq(categories.id, fixedCommitments.categoryId))
    .leftJoin(accounts, eq(accounts.id, fixedCommitments.accountId))
    .leftJoin(creditCards, eq(creditCards.id, fixedCommitments.cardId))
    .leftJoin(destinationAccounts, eq(destinationAccounts.id, fixedCommitments.destinationAccountId))
    .where(eq(fixedCommitments.userId, userId))
    .orderBy(asc(fixedCommitments.dueDay), asc(fixedCommitments.name));
}

export type FixedRow = Awaited<ReturnType<typeof listFixed>>[number];

export async function getFixedMonth(month: string) {
  const { user } = await requireSession();
  const rows = await listFixed(user.id);

  return {
    due: rows.filter(({ fixed }) => fixed.active && isDueIn(fixed.startMonth, fixed.frequency, month)),
    notDue: rows.filter(({ fixed }) => fixed.active && !isDueIn(fixed.startMonth, fixed.frequency, month)),
    paused: rows.filter(({ fixed }) => !fixed.active),
  };
}
