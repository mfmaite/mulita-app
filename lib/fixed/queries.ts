import "server-only";
import { and, asc, eq, isNotNull, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { requireSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { today } from "@/lib/dates";
import { accounts, categories, creditCards, fixedCommitments, movements, type Currency } from "@/lib/db/schema";
import { monthRange } from "@/lib/month";
import { isDueIn } from "./schedule";
import { fixedMonthTotals, fixedStatus } from "./status";

const destinationAccounts = alias(accounts, "destination_accounts");

export async function listFixed(userId: string) {
  return db
    .select({
      fixed: fixedCommitments,
      categoryName: categories.name,
      accountName: accounts.name,
      cardName: creditCards.name,
      destinationName: destinationAccounts.name,
      destinationCurrency: destinationAccounts.currency,
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

async function listMonthPayments(userId: string, month: string) {
  return db
    .select({
      id: movements.id,
      fixedCommitmentId: movements.fixedCommitmentId,
      amount: movements.amount,
      date: movements.date,
    })
    .from(movements)
    .where(
      and(
        eq(movements.userId, userId),
        isNotNull(movements.fixedCommitmentId),
        eq(movements.fixedMonth, monthRange(month).start),
      ),
    );
}

export async function getFixedMonth(month: string) {
  const { user } = await requireSession();
  const [rows, payments] = await Promise.all([listFixed(user.id), listMonthPayments(user.id, month)]);

  const due = rows
    .filter(({ fixed }) => fixed.active && isDueIn(fixed.startMonth, fixed.frequency, month))
    .map((row) => {
      const payment = payments.find(({ fixedCommitmentId }) => fixedCommitmentId === row.fixed.id);
      const status = fixedStatus({ dueDay: row.fixed.dueDay, paid: Boolean(payment), month, today: today() });
      return { ...row, payment, status };
    });

  return {
    due,
    notDue: rows.filter(({ fixed }) => fixed.active && !isDueIn(fixed.startMonth, fixed.frequency, month)),
    paused: rows.filter(({ fixed }) => !fixed.active),
    totals: fixedMonthTotals(
      due.map(({ fixed, currency, payment }) => ({ currency, estimate: fixed.amount, paidAmount: payment?.amount ?? null })),
    ),
  };
}

export type FixedMonth = Awaited<ReturnType<typeof getFixedMonth>>;
export type DueFixed = FixedMonth["due"][number];
