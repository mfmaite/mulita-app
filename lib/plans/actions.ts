"use server";

import type { FormState } from "@/lib/forms";
import { formatMonth, parseMonth } from "@/lib/month";
import { saveForm } from "@/lib/save-form";
import { savePlanFrom } from "./queries";
import { planFields, planSchema, type PlanField } from "./schemas";

export async function setMonthlyPlan(month: string, _: FormState<PlanField>, formData: FormData) {
  const validMonth = parseMonth(month);

  return saveForm({
    formData,
    fields: planFields,
    schema: planSchema,
    save: (data, userId) => savePlanFrom(userId, validMonth, data),
    success: `Tá, vale desde ${formatMonth(validMonth).toLowerCase()} en adelante.`,
  });
}
