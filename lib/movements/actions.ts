"use server";

import { and, eq } from "drizzle-orm";
import { requireSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { activeOrCurrent } from "@/lib/db/conditions";
import { accounts, categories, movements } from "@/lib/db/schema";
import type { FormState } from "@/lib/forms";
import { FieldError, revalidateApp, saveForm } from "@/lib/save-form";
import { movementSchema, type MovementData, type MovementField } from "./schemas";

type MovementState = FormState<MovementField>;

const formOptions = {
  fields: ["type", "amount", "accountId", "categoryId", "date", "detail"] as const,
  schema: movementSchema,
};

type CurrentReferences = { accountId: string; categoryId: string | null };

async function assertReferences(data: MovementData, userId: string, current?: CurrentReferences) {
  const [[account], [category]] = await Promise.all([
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
    db
      .select({ kind: categories.kind })
      .from(categories)
      .where(
        and(
          eq(categories.id, data.categoryId),
          eq(categories.userId, userId),
          activeOrCurrent(categories.archivedAt, categories.id, current?.categoryId),
        ),
      ),
  ]);

  if (!account) throw new FieldError("accountId", "Elegí una cuenta.");
  if (!category) throw new FieldError("categoryId", "Elegí una categoría.");
  if (category.kind !== data.type) {
    throw new FieldError("categoryId", "Esa categoría no corresponde a este tipo de movimiento.");
  }
}

function ownMovement(id: string, userId: string) {
  return and(eq(movements.id, id), eq(movements.userId, userId));
}

export async function createMovement(_: MovementState, formData: FormData) {
  return saveForm({
    ...formOptions,
    formData,
    save: async (data, userId) => {
      await assertReferences(data, userId);
      await db.insert(movements).values({ ...data, userId });
    },
    success: "Tá, quedó registrado.",
  });
}

export async function updateMovement(id: string, _: MovementState, formData: FormData) {
  return saveForm({
    ...formOptions,
    formData,
    save: async (data, userId) => {
      const [current] = await db
        .select({ accountId: movements.accountId, categoryId: movements.categoryId })
        .from(movements)
        .where(ownMovement(id, userId));
      await assertReferences(data, userId, current);
      await db.update(movements).set(data).where(ownMovement(id, userId));
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
