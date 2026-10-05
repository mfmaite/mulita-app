"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { requireSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { isUniqueViolation } from "@/lib/db/errors";
import { categories } from "@/lib/db/schema";
import { formValues, invalidForm, type FormState } from "@/lib/forms";
import { categorySchema, type CategoryField } from "./schemas";

type CategoryState = FormState<CategoryField>;
type CategoryData = z.output<typeof categorySchema>;

const fields = ["kind", "name", "description"] as const;

async function saveCategory(
  formData: FormData,
  save: (data: CategoryData, userId: string) => Promise<unknown>,
  success: string,
): Promise<CategoryState> {
  const values = formValues(formData, fields);
  const parsed = categorySchema.safeParse(values);
  if (!parsed.success) return invalidForm(parsed.error, values);

  const { user } = await requireSession();

  try {
    await save(parsed.data, user.id);
  } catch (error) {
    if (!isUniqueViolation(error)) throw error;
    return { values, fieldErrors: { name: ["Ya tenés una categoría con ese nombre."] } };
  }

  revalidatePath("/categorias");
  return { success };
}

export async function createCategory(_: CategoryState, formData: FormData) {
  return saveCategory(formData, (data, userId) => db.insert(categories).values({ ...data, userId }), "Tá, quedó registrada.");
}

export async function updateCategory(id: string, _: CategoryState, formData: FormData) {
  return saveCategory(
    formData,
    (data, userId) =>
      db
        .update(categories)
        .set(data)
        .where(and(eq(categories.id, id), eq(categories.userId, userId))),
    "Tá, quedó actualizada.",
  );
}

export async function deleteCategory(id: string) {
  const { user } = await requireSession();
  await db.delete(categories).where(and(eq(categories.id, id), eq(categories.userId, user.id)));
  revalidatePath("/categorias");
}
