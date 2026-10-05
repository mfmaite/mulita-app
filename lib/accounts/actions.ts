"use server";

import { and, eq } from "drizzle-orm";
import { requireSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { accounts, movements } from "@/lib/db/schema";
import type { FormState } from "@/lib/forms";
import { hasMovements } from "@/lib/movements/usage";
import { FieldError, revalidateApp, saveForm } from "@/lib/save-form";
import { accountSchema, type AccountField } from "./schemas";

type AccountState = FormState<AccountField>;

const formOptions = {
  fields: ["name", "type", "currency", "initialBalance"] as const,
  schema: accountSchema,
  duplicate: { field: "name", message: "Ya tenés una cuenta con ese nombre." },
} as const;

function ownAccount(id: string, userId: string) {
  return and(eq(accounts.id, id), eq(accounts.userId, userId));
}

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
    save: async (data, userId) => {
      const [current] = await db.select({ currency: accounts.currency }).from(accounts).where(ownAccount(id, userId));
      if (current && current.currency !== data.currency && (await hasMovements(movements.accountId, id))) {
        throw new FieldError("currency", "No podés cambiar la moneda de una cuenta que ya tiene movimientos.");
      }
      await db.update(accounts).set(data).where(ownAccount(id, userId));
    },
    success: "Tá, quedó actualizada.",
  });
}

export async function deleteAccount(id: string) {
  const { user } = await requireSession();

  if (await hasMovements(movements.accountId, id)) {
    await db.update(accounts).set({ archivedAt: new Date() }).where(ownAccount(id, user.id));
    revalidateApp();
    return "La archivamos: tiene movimientos, así que la sacamos de la lista sin perder nada.";
  }

  await db.delete(accounts).where(ownAccount(id, user.id));
  revalidateApp();
  return "Listo, la borramos.";
}
