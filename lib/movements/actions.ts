"use server";

import { and, eq, inArray } from "drizzle-orm";
import { accountsWithBalance } from "@/lib/accounts/queries";
import { requireSession } from "@/lib/auth/session";
import { today } from "@/lib/dates";
import { db } from "@/lib/db";
import { activeOrCurrent } from "@/lib/db/conditions";
import { accounts, categories, movements } from "@/lib/db/schema";
import type { FormState } from "@/lib/forms";
import { FieldError, revalidateApp, saveForm } from "@/lib/save-form";
import { movementFields, movementSchema, reconcileSchema, type MovementData, type MovementField, type ReconcileField } from "./schemas";

type MovementState = FormState<MovementField>;

type CurrentReferences = {
  accountId: string;
  categoryId: string | null;
  destinationAccountId: string | null;
};

async function findAccount(id: string, userId: string, currentIds: (string | null | undefined)[]) {
  const [account] = await db
    .select({ id: accounts.id, currency: accounts.currency })
    .from(accounts)
    .where(
      and(
        eq(accounts.id, id),
        eq(accounts.userId, userId),
        activeOrCurrent(accounts.archivedAt, accounts.id, currentIds.includes(id) ? id : undefined),
      ),
    );
  return account;
}

async function toRow(data: MovementData, userId: string, current?: CurrentReferences) {
  const currentAccountIds = [current?.accountId, current?.destinationAccountId];
  const account = await findAccount(data.accountId, userId, currentAccountIds);
  if (!account) throw new FieldError("accountId", "Elegí una cuenta.");

  if (data.type === "transfer") {
    const destination = await findAccount(data.destinationAccountId, userId, currentAccountIds);
    if (!destination) throw new FieldError("destinationAccountId", "Elegí a qué cuenta va la plata.");

    const sameCurrency = destination.currency === account.currency;
    if (!sameCurrency && !data.destinationAmount) {
      throw new FieldError("destinationAmount", "¿Cuánto llegó a la otra cuenta?");
    }

    return {
      ...data,
      categoryId: null,
      destinationAmount: sameCurrency ? data.amount : data.destinationAmount,
    };
  }

  const [category] = await db
    .select({ kind: categories.kind })
    .from(categories)
    .where(
      and(
        eq(categories.id, data.categoryId),
        eq(categories.userId, userId),
        activeOrCurrent(categories.archivedAt, categories.id, current?.categoryId),
      ),
    );

  if (!category) throw new FieldError("categoryId", "Elegí una categoría.");
  if (category.kind !== data.type) {
    throw new FieldError("categoryId", "Esa categoría no corresponde a este tipo de movimiento.");
  }

  return { ...data, destinationAccountId: null, destinationAmount: null };
}

function ownMovement(id: string, userId: string) {
  return and(eq(movements.id, id), eq(movements.userId, userId));
}

export async function createMovement(_: MovementState, formData: FormData) {
  return saveForm({
    formData,
    fields: movementFields,
    schema: movementSchema,
    save: async (data, userId) => {
      await db.insert(movements).values({ ...(await toRow(data, userId)), userId });
    },
    success: "Tá, quedó registrado.",
  });
}

export async function updateMovement(id: string, _: MovementState, formData: FormData) {
  return saveForm({
    formData,
    fields: movementFields,
    schema: movementSchema,
    save: async (data, userId) => {
      const [current] = await db
        .select({
          accountId: movements.accountId,
          categoryId: movements.categoryId,
          destinationAccountId: movements.destinationAccountId,
        })
        .from(movements)
        .where(and(ownMovement(id, userId), inArray(movements.type, ["income", "expense", "transfer"])));
      if (!current) throw new FieldError("type", "Ese movimiento no se puede editar.");
      await db.update(movements).set(await toRow(data, userId, current)).where(ownMovement(id, userId));
    },
    success: "Tá, quedó actualizado.",
  });
}

export async function deleteMovement(id: string) {
  const { user } = await requireSession();
  await db.delete(movements).where(ownMovement(id, user.id));
  revalidateApp();
  return "Listo, lo borramos.";
}

export async function reconcileAccount(accountId: string, _: FormState<ReconcileField>, formData: FormData) {
  return saveForm({
    formData,
    fields: ["realBalance"] as const,
    schema: reconcileSchema,
    save: async ({ realBalance }, userId) => {
      const account = (await accountsWithBalance(userId)).find(({ id }) => id === accountId);
      if (!account) throw new FieldError("realBalance", "No encontramos esa cuenta.");

      const difference = realBalance - account.balance;
      if (difference === 0) return "Ya estaba cuadrada. ¡Qué orden!";

      await db.insert(movements).values({ userId, accountId, type: "adjustment", amount: difference, date: today() });
    },
    success: "Tá, quedó cuadrada.",
  });
}
