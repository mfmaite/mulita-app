"use server";

import { and, eq } from "drizzle-orm";
import { requireSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { categories, movements } from "@/lib/db/schema";
import type { FormState } from "@/lib/forms";
import { hasMovements } from "@/lib/movements/usage";
import { FieldError, revalidateApp, saveForm } from "@/lib/save-form";
import { categorySchema, type CategoryField } from "./schemas";

type CategoryState = FormState<CategoryField>;

const formOptions = {
  fields: ["kind", "name", "description"] as const,
  schema: categorySchema,
  duplicate: { field: "name", message: "Ya tenés una categoría con ese nombre." },
} as const;

function ownCategory(id: string, userId: string) {
  return and(eq(categories.id, id), eq(categories.userId, userId));
}

export async function createCategory(_: CategoryState, formData: FormData) {
  return saveForm({
    ...formOptions,
    formData,
    save: (data, userId) => db.insert(categories).values({ ...data, userId }),
    success: "Tá, quedó registrada.",
  });
}

export async function updateCategory(id: string, _: CategoryState, formData: FormData) {
  return saveForm({
    ...formOptions,
    formData,
    save: async (data, userId) => {
      const [current] = await db.select({ kind: categories.kind }).from(categories).where(ownCategory(id, userId));
      if (current && current.kind !== data.kind && (await hasMovements(movements.categoryId, id))) {
        throw new FieldError("kind", "No podés cambiar el tipo de una categoría que ya tiene movimientos.");
      }
      await db.update(categories).set(data).where(ownCategory(id, userId));
    },
    success: "Tá, quedó actualizada.",
  });
}

export async function deleteCategory(id: string) {
  const { user } = await requireSession();

  if (await hasMovements(movements.categoryId, id)) {
    await db.update(categories).set({ archivedAt: new Date() }).where(ownCategory(id, user.id));
    revalidateApp();
    return "La archivamos: tiene movimientos, así que la sacamos de la lista sin perder nada.";
  }

  await db.delete(categories).where(ownCategory(id, user.id));
  revalidateApp();
  return "Listo, la borramos.";
}
