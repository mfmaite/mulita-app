"use server";

import { and, eq } from "drizzle-orm";
import { requireSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { activeOrCurrent } from "@/lib/db/conditions";
import { accounts, cardClosingOverrides, creditCards, movements } from "@/lib/db/schema";
import type { FormState } from "@/lib/forms";
import { formatMonth, monthRange } from "@/lib/month";
import { isCardInUse } from "@/lib/movements/usage";
import { FieldError, revalidateApp, saveForm } from "@/lib/save-form";
import {
  cardPaymentSchema,
  cardSchema,
  closingOverrideSchema,
  type CardField,
  type CardPaymentField,
  type ClosingOverrideField,
} from "./schemas";

type CardState = FormState<CardField>;

const formOptions = {
  fields: ["name", "closingDay"] as const,
  schema: cardSchema,
  duplicate: { field: "name", message: "Ya tenés una tarjeta con ese nombre." },
} as const;

function ownCard(id: string, userId: string) {
  return and(eq(creditCards.id, id), eq(creditCards.userId, userId));
}

export async function createCard(_: CardState, formData: FormData) {
  return saveForm({
    ...formOptions,
    formData,
    save: (data, userId) => db.insert(creditCards).values({ ...data, userId }),
    success: "Tá, quedó registrada.",
  });
}

export async function updateCard(id: string, _: CardState, formData: FormData) {
  return saveForm({
    ...formOptions,
    formData,
    save: (data, userId) => db.update(creditCards).set(data).where(ownCard(id, userId)),
    success: "Tá, quedó actualizada.",
  });
}

export async function deleteCard(id: string) {
  const { user } = await requireSession();

  if (await isCardInUse(id)) {
    await db.update(creditCards).set({ archivedAt: new Date() }).where(ownCard(id, user.id));
    revalidateApp();
    return "La archivamos: tiene compras, así que la sacamos de la lista sin perder nada.";
  }

  await db.delete(creditCards).where(ownCard(id, user.id));
  revalidateApp();
  return "Listo, la borramos.";
}

export async function setClosingOverride(cardId: string, _: FormState<ClosingOverrideField>, formData: FormData) {
  return saveForm({
    formData,
    fields: ["month", "closingDay"] as const,
    schema: closingOverrideSchema,
    save: async ({ month, closingDay }, userId) => {
      const [card] = await db.select({ closingDay: creditCards.closingDay }).from(creditCards).where(ownCard(cardId, userId));
      if (!card) throw new FieldError("closingDay", "No encontramos esa tarjeta.");

      const monthStart = monthRange(month).start;
      const label = formatMonth(month).toLowerCase();

      if (closingDay === card.closingDay) {
        await db
          .delete(cardClosingOverrides)
          .where(and(eq(cardClosingOverrides.cardId, cardId), eq(cardClosingOverrides.month, monthStart)));
        return `Tá, en ${label} cierra el día de siempre.`;
      }

      await db
        .insert(cardClosingOverrides)
        .values({ cardId, month: monthStart, closingDay })
        .onConflictDoUpdate({ target: [cardClosingOverrides.cardId, cardClosingOverrides.month], set: { closingDay } });
      return `Tá, en ${label} cierra el ${closingDay}.`;
    },
    success: "Tá, quedó guardado.",
  });
}

export async function saveCardPayment(
  cardId: string,
  movementId: string | null,
  _: FormState<CardPaymentField>,
  formData: FormData,
) {
  return saveForm({
    formData,
    fields: ["amount", "accountId", "date"] as const,
    schema: cardPaymentSchema,
    save: async (data, userId) => {
      const ownPayment = movementId
        ? and(eq(movements.id, movementId), eq(movements.userId, userId), eq(movements.type, "card_payment"))
        : undefined;
      const [current] = ownPayment
        ? await db.select({ accountId: movements.accountId }).from(movements).where(ownPayment)
        : [];

      const [[card], [account]] = await Promise.all([
        db.select({ id: creditCards.id }).from(creditCards).where(ownCard(cardId, userId)),
        db
          .select({ id: accounts.id })
          .from(accounts)
          .where(
            and(
              eq(accounts.id, data.accountId),
              eq(accounts.userId, userId),
              activeOrCurrent(accounts.archivedAt, accounts.id, current?.accountId),
            ),
          ),
      ]);
      if (!card) throw new FieldError("accountId", "No encontramos esa tarjeta.");
      if (!account) throw new FieldError("accountId", "Elegí desde qué cuenta pagás.");

      if (ownPayment) {
        await db.update(movements).set(data).where(ownPayment);
        return "Tá, quedó actualizado.";
      }
      await db.insert(movements).values({ ...data, userId, cardId, type: "card_payment" });
    },
    success: "Tá, resumen pagado. Una cosa menos.",
  });
}
