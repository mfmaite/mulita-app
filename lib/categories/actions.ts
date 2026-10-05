"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import type { FormState } from "@/lib/forms";
import { saveForm } from "@/lib/save-form";
import { categorySchema, type CategoryField } from "./schemas";

type CategoryState = FormState<CategoryField>;

const formOptions = {
  fields: ["kind", "name", "description"] as const,
  schema: categorySchema,
  revalidate: "/categorias",
  duplicate: { field: "name", message: "Ya tenés una categoría con ese nombre." },
} as const;

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
    save: (data, userId) =>
      db
        .update(categories)
        .set(data)
        .where(and(eq(categories.id, id), eq(categories.userId, userId))),
    success: "Tá, quedó actualizada.",
  });
}

export async function deleteCategory(id: string) {
  const { user } = await requireSession();
  await db.delete(categories).where(and(eq(categories.id, id), eq(categories.userId, user.id)));
  revalidatePath("/categorias");
}
