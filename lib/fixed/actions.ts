"use server";

import { and, eq, isNull } from "drizzle-orm";
import { requireSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { accounts, categories, creditCards, fixedCommitments } from "@/lib/db/schema";
import type { FormState } from "@/lib/forms";
import { FieldError, revalidateApp, saveForm } from "@/lib/save-form";
import { fixedFields, fixedSchema, type FixedData, type FixedField } from "./schemas";

type FixedState = FormState<FixedField>;

async function activeAccount(id: string, userId: string) {
  const [account] = await db
    .select({ type: accounts.type })
    .from(accounts)
    .where(and(eq(accounts.id, id), eq(accounts.userId, userId), isNull(accounts.archivedAt)));
  return account;
}

async function activeCard(id: string, userId: string) {
  const [card] = await db
    .select({ id: creditCards.id })
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
