"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { accounts } from "@/lib/db/schema";
import type { FormState } from "@/lib/forms";
import { saveForm } from "@/lib/save-form";
import { accountSchema, type AccountField } from "./schemas";

type AccountState = FormState<AccountField>;

const formOptions = {
  fields: ["name", "type", "currency", "initialBalance"] as const,
  schema: accountSchema,
  revalidate: "/cuentas",
  duplicate: { field: "name", message: "Ya tenés una cuenta con ese nombre." },
} as const;

export async function createAccount(_: AccountState, formData: FormData) {
  return saveForm({
    ...formOptions,
    formData,
    save: (data, userId) => db.insert(accounts).values({ ...data, userId }),
    success: "Tá, quedó registrada.",
  });
}

export async function updateAccount(id: string, _: AccountState, formData: FormData) {
  return saveForm({
    ...formOptions,
    formData,
    save: (data, userId) =>
      db
        .update(accounts)
        .set(data)
        .where(and(eq(accounts.id, id), eq(accounts.userId, userId))),
    success: "Tá, quedó actualizada.",
  });
}

export async function deleteAccount(id: string) {
  const { user } = await requireSession();
  await db.delete(accounts).where(and(eq(accounts.id, id), eq(accounts.userId, user.id)));
  revalidatePath("/cuentas");
}
