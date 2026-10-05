"use client";

import { useState } from "react";
import { AmountField } from "@/components/ui/amount-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { useFormAction } from "@/components/ui/use-form-action";
import type { MonthPlan } from "@/lib/budgets/plan";
import { centsToInput } from "@/lib/money";
import { setMonthlyPlan } from "@/lib/plans/actions";
import { PeriodField } from "./period-field";

type PlanFormProps = {
  plan: MonthPlan;
  month: string;
  onSaved: () => void;
};

const toInput = (cents: number) => (cents > 0 ? centsToInput(cents) : "");

export function PlanForm({ plan, month, onSaved }: PlanFormProps) {
  const [state, onSubmit, isPending] = useFormAction(setMonthlyPlan.bind(null, month), onSaved);
  const [expectedIncome, setExpectedIncome] = useState(toInput(plan.expectedIncome));
  const [savingsTarget, setSavingsTarget] = useState(toInput(plan.savingsTarget));

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <AmountField
        label="¿Cuánto ganás por mes? ($)"
        name="expectedIncome"
        currency="UYU"
        placeholder="0"
        value={expectedIncome}
        onValueChange={setExpectedIncome}
        hint="Lo que esperás cobrar. Si entra más, Mulita usa lo que entró."
        errors={state.fieldErrors?.expectedIncome}
      />
      <AmountField
        label="¿Cuánto querés ahorrar por mes? ($)"
        name="savingsTarget"
        currency="UYU"
        placeholder="0"
        value={savingsTarget}
        onValueChange={setSavingsTarget}
        hint="Con esto también se reparten tus metas."
        errors={state.fieldErrors?.savingsTarget}
      />
      <PeriodField month={month} />
      <SubmitButton pending={isPending} className="w-full" pendingLabel="Guardando...">
        Guardar
      </SubmitButton>
    </form>
  );
}
