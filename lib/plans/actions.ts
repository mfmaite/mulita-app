"use server";

import type { FormState } from "@/lib/forms";
import { changeMessage } from "@/lib/budgets/messages";
import { parseMonth } from "@/lib/month";
import { saveForm } from "@/lib/save-form";
import { savePlanFrom } from "./queries";
import { planFields, planSchema, type PlanField } from "./schemas";

export async function setMonthlyPlan(month: string, _: FormState<PlanField>, formData: FormData) {
  const validMonth = parseMonth(month);

  return saveForm({
    formData,
    fields: planFields,
    schema: planSchema,
    save: async ({ onlyThisMonth, ...plan }, userId) => {
      await savePlanFrom(userId, validMonth, plan, onlyThisMonth);
      return changeMessage(validMonth, onlyThisMonth);
    },
    success: changeMessage(validMonth, false),
  });
}
