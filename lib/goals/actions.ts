"use server";

import { and, eq, ne, sum } from "drizzle-orm";
import { requireSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { savingsGoals, userSettings } from "@/lib/db/schema";
import type { FormState } from "@/lib/forms";
import { FieldError, revalidateApp, saveForm } from "@/lib/save-form";
import { goalSchema, savingsPlanSchema, type GoalField, type SavingsPlanField } from "./schemas";

type GoalState = FormState<GoalField>;

const formOptions = {
  fields: ["name", "target", "share", "note"] as const,
  schema: goalSchema,
  duplicate: { field: "name", message: "Ya tenés una meta con ese nombre." },
} as const;

function ownGoal(id: string, userId: string) {
  return and(eq(savingsGoals.id, id), eq(savingsGoals.userId, userId));
}

async function assertShareFits(share: number, userId: string, goalId?: string) {
  const [{ assigned }] = await db
    .select({ assigned: sum(savingsGoals.share).mapWith(Number) })
    .from(savingsGoals)
    .where(and(eq(savingsGoals.userId, userId), goalId ? ne(savingsGoals.id, goalId) : undefined));
  const available = 100 - (assigned ?? 0);
  if (share > available) throw new FieldError("share", `Te pasás del 100%. Te queda ${available}% para repartir.`);
}

export async function createGoal(_: GoalState, formData: FormData) {
  return saveForm({
    ...formOptions,
    formData,
    save: async (data, userId) => {
      await assertShareFits(data.share, userId);
      await db.insert(savingsGoals).values({ ...data, userId });
    },
    success: "Tá, meta creada. ¡A juntar!",
  });
}

export async function updateGoal(id: string, _: GoalState, formData: FormData) {
  return saveForm({
    ...formOptions,
    formData,
    save: async (data, userId) => {
      await assertShareFits(data.share, userId, id);
      await db.update(savingsGoals).set(data).where(ownGoal(id, userId));
    },
    success: "Tá, quedó actualizada.",
  });
}

export async function deleteGoal(id: string) {
  const { user } = await requireSession();
  await db.delete(savingsGoals).where(ownGoal(id, user.id));
  revalidateApp();
  return "Listo, la borramos.";
}

export async function setSavingsPlan(_: FormState<SavingsPlanField>, formData: FormData) {
  return saveForm({
    formData,
    fields: ["monthlySavingsPlan"] as const,
    schema: savingsPlanSchema,
    save: ({ monthlySavingsPlan }, userId) =>
      db
        .insert(userSettings)
        .values({ userId, monthlySavingsPlan })
        .onConflictDoUpdate({ target: userSettings.userId, set: { monthlySavingsPlan } }),
    success: "Tá, ahorro mensual guardado.",
  });
}
