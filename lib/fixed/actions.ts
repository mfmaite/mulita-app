"use server";

import { and, eq, isNull } from "drizzle-orm";
import { requireSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { closingDayFor } from "@/lib/cards/closing";
import { suggestFirstBillingMonth } from "@/lib/cards/installments";
import {
  accounts,
  cardClosingOverrides,
  categories,
  creditCards,
  fixedCommitments,
  movements,
  type FixedCommitment,
} from "@/lib/db/schema";
import type { FormState } from "@/lib/forms";
import { monthRange } from "@/lib/month";
import { monthField } from "@/lib/movements/schemas";
import { FieldError, revalidateApp, saveForm } from "@/lib/save-form";
import { isDueIn } from "./schedule";
import {
  fixedFields,
  fixedSchema,
  payFixedFields,
  payFixedSchema,
  type FixedData,
  type FixedField,
  type PayFixedData,
  type PayFixedField,
} from "./schemas";

type FixedState = FormState<FixedField>;

async function activeAccount(id: string, userId: string) {
  const [account] = await db
    .select({ type: accounts.type, currency: accounts.currency })
    .from(accounts)
    .where(and(eq(accounts.id, id), eq(accounts.userId, userId), isNull(accounts.archivedAt)));
  return account;
}

async function activeCard(id: string, userId: string) {
  const [card] = await db
    .select({ id: creditCards.id, closingDay: creditCards.closingDay })
    .from(creditCards)
    .where(and(eq(creditCards.id, id), eq(creditCards.userId, userId), isNull(creditCards.archivedAt)));
  return card;
}

async function assertExpenseCategory(id: string, userId: string) {
  const [category] = await db
    .select({ kind: categories.kind })
    .from(categories)
    .where(and(eq(categories.id, id), eq(categories.userId, userId), isNull(categories.archivedAt)));
  if (category?.kind !== "expense") throw new FieldError("categoryId", "Elegí una categoría de gastos.");
}

const noReferences = { categoryId: null, accountId: null, cardId: null, currency: null, destinationAccountId: null };

async function toRow(data: FixedData, userId: string) {
  const base = {
    ...noReferences,
    kind: data.kind,
    name: data.name,
    amount: data.amount,
    variableAmount: data.variableAmount,
    dueDay: data.dueDay,
    frequency: data.frequency,
    startMonth: `${data.startMonth}-01`,
    note: data.note,
  };

  if (data.kind === "expense") {
    await assertExpenseCategory(data.categoryId, userId);
    if (data.source.kind === "card") {
      if (!(await activeCard(data.source.id, userId))) throw new FieldError("source", "Elegí con qué lo pagás.");
      return { ...base, categoryId: data.categoryId, cardId: data.source.id, currency: data.currency };
    }
    if (!(await activeAccount(data.source.id, userId))) throw new FieldError("source", "Elegí con qué lo pagás.");
    return { ...base, categoryId: data.categoryId, accountId: data.source.id };
  }

  if (!(await activeAccount(data.accountId, userId))) throw new FieldError("accountId", "Elegí una cuenta.");

  if (data.kind === "card_payment") {
    if (!(await activeCard(data.cardId, userId))) throw new FieldError("cardId", "Elegí la tarjeta.");
    return { ...base, accountId: data.accountId, cardId: data.cardId };
  }

  const destination = await activeAccount(data.destinationAccountId, userId);
  if (destination?.type !== "savings") throw new FieldError("destinationAccountId", "Elegí una cuenta de ahorro.");
  return { ...base, accountId: data.accountId, destinationAccountId: data.destinationAccountId };
}

function ownFixed(id: string, userId: string) {
  return and(eq(fixedCommitments.id, id), eq(fixedCommitments.userId, userId));
}

export async function createFixed(_: FixedState, formData: FormData) {
  return saveForm({
    formData,
    fields: fixedFields,
    schema: fixedSchema,
    save: async (data, userId) => db.insert(fixedCommitments).values({ ...(await toRow(data, userId)), userId }),
    success: "Tá, fijo agendado.",
  });
}

export async function updateFixed(id: string, _: FixedState, formData: FormData) {
  return saveForm({
    formData,
    fields: fixedFields,
    schema: fixedSchema,
    save: async (data, userId) => db.update(fixedCommitments).set(await toRow(data, userId)).where(ownFixed(id, userId)),
    success: "Tá, quedó actualizado.",
  });
}

export async function setFixedActive(id: string, active: boolean) {
  const { user } = await requireSession();
  await db.update(fixedCommitments).set({ active }).where(ownFixed(id, user.id));
  revalidateApp();
  return active ? "Tá, lo reactivamos." : "Tá, quedó en pausa.";
}

export async function deleteFixed(id: string) {
  const { user } = await requireSession();
  await db.delete(fixedCommitments).where(ownFixed(id, user.id));
  revalidateApp();
  return "Listo, lo borramos.";
}

const archivedReference = () =>
  new FieldError("amount", "Una cuenta o tarjeta de este fijo está archivada. Editá el fijo y probá de nuevo.");

async function cardPurchaseRow(fixed: FixedCommitment, cardId: string, date: string, userId: string) {
  const card = await activeCard(cardId, userId);
  if (!card) throw archivedReference();

  const overrides = await db
    .select({ month: cardClosingOverrides.month, closingDay: cardClosingOverrides.closingDay })
    .from(cardClosingOverrides)
    .where(eq(cardClosingOverrides.cardId, cardId));
  const closingDay = closingDayFor(card.closingDay, overrides, date.slice(0, 7));

  return {
    type: "expense" as const,
    cardId,
    currency: fixed.currency,
    categoryId: fixed.categoryId,
    installments: 1,
    firstBillingMonth: `${suggestFirstBillingMonth(date, closingDay)}-01`,
  };
}

async function paymentRow(fixed: FixedCommitment, data: PayFixedData, userId: string) {
  if (fixed.kind === "expense" && fixed.cardId) return cardPurchaseRow(fixed, fixed.cardId, data.date, userId);

  const account = fixed.accountId ? await activeAccount(fixed.accountId, userId) : undefined;
  if (!fixed.accountId || !account) throw archivedReference();

  if (fixed.kind === "expense") return { type: "expense" as const, accountId: fixed.accountId, categoryId: fixed.categoryId };

  if (fixed.kind === "card_payment") {
    if (!fixed.cardId || !(await activeCard(fixed.cardId, userId))) throw archivedReference();
    return { type: "card_payment" as const, accountId: fixed.accountId, cardId: fixed.cardId };
  }

  const destination = fixed.destinationAccountId ? await activeAccount(fixed.destinationAccountId, userId) : undefined;
  if (!destination) throw archivedReference();

  const sameCurrency = destination.currency === account.currency;
  if (!sameCurrency && !data.destinationAmount) {
    throw new FieldError("destinationAmount", "¿Cuánto llegó a la cuenta de ahorro?");
  }

  return {
    type: "transfer" as const,
    accountId: fixed.accountId,
    destinationAccountId: fixed.destinationAccountId,
    destinationAmount: sameCurrency ? data.amount : data.destinationAmount,
  };
}

export async function payFixed(id: string, month: string, _: FormState<PayFixedField>, formData: FormData) {
  return saveForm({
    formData,
    fields: payFixedFields,
    schema: payFixedSchema,
    save: async (data, userId) => {
      const [fixed] = await db
        .select()
        .from(fixedCommitments)
        .where(and(ownFixed(id, userId), eq(fixedCommitments.active, true)));
      const isDue = fixed && monthField.safeParse(month).success && isDueIn(fixed.startMonth, fixed.frequency, month);
      if (!isDue) throw new FieldError("amount", "Este fijo no se paga este mes.");

      await db.insert(movements).values({
        ...(await paymentRow(fixed, data, userId)),
        userId,
        amount: data.amount,
        date: data.date,
        detail: fixed.name,
        fixedCommitmentId: fixed.id,
        fixedMonth: monthRange(month).start,
      });
    },
    success: "Tá, pagado. Uno menos.",
    duplicate: { field: "amount", message: "Este fijo ya está pago este mes." },
  });
}
