"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { useFormAction } from "@/components/ui/use-form-action";
import { centsToInput, evaluateAmount } from "@/lib/money";
import { completeOnboarding } from "@/lib/onboarding/actions";
import type { OnboardingData } from "@/lib/onboarding/queries";
import { BudgetsStep } from "./budgets-step";
import { IncomeStep } from "./income-step";
import { SavingsStep, suggestedSavings } from "./savings-step";
import { StepProgress } from "./step-progress";
import { ToAssignBar } from "./to-assign-bar";

const toInput = (cents: number) => (cents > 0 ? centsToInput(cents) : "");
const amountOf = (input: string) => (input.trim() ? evaluateAmount(input) : 0);
const lastStep = 2;

export function OnboardingWizard({ data }: { data: OnboardingData }) {
  const router = useRouter();
  const [state, submit, isPending] = useFormAction(completeOnboarding, () => router.push("/presupuesto"));
  const [step, setStep] = useState(0);
  const [income, setIncome] = useState(toInput(data.plan.expectedIncome));
  const [savings, setSavings] = useState(toInput(data.plan.savingsTarget));
  const [budgets, setBudgets] = useState(() =>
    Object.fromEntries(data.categories.map((category) => [category.id, toInput(category.budget)])),
  );

  const incomeCents = amountOf(income);
  const savingsCents = amountOf(savings);
  const budgetCents = Object.values(budgets).map(amountOf);
  const budgeted = budgetCents.reduce<number>((total, cents) => total + (cents ?? 0), 0);
  const toAssign = (incomeCents ?? 0) - (savingsCents ?? 0) - budgeted;

  const canContinue = [Boolean(incomeCents && incomeCents > 0), savingsCents !== null, !budgetCents.includes(null)][step];
  const serverError = Object.values(state.fieldErrors ?? {}).flat()[0];

  const next = () => {
    if (step === 0 && !savings && incomeCents) setSavings(centsToInput(suggestedSavings(incomeCents)));
    setStep(step + 1);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (step === lastStep) return submit(event);
    event.preventDefault();
    if (canContinue) next();
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <input type="hidden" name="expectedIncome" value={income} />
      <input type="hidden" name="savingsTarget" value={savings} />
      <input type="hidden" name="budgets" value={JSON.stringify(budgets)} />
      <StepProgress step={step} total={lastStep + 1} />
      {step === 0 && <IncomeStep value={income} onChange={setIncome} />}
      {step === 1 && <SavingsStep value={savings} onChange={setSavings} income={incomeCents ?? 0} savings={savingsCents} />}
      {step === 2 && (
        <BudgetsStep
          categories={data.categories}
          values={budgets}
          onChange={(categoryId, value) => setBudgets((current) => ({ ...current, [categoryId]: value }))}
        />
      )}
      {serverError && <Alert tone="danger">{serverError}</Alert>}
      <div className="sticky bottom-0 -mx-4 space-y-3 border-t border-border bg-background px-4 py-4 sm:bottom-6 sm:mx-0 sm:rounded-2xl sm:border sm:shadow-sm">
        {step === lastStep && <ToAssignBar toAssign={toAssign} />}
        <div className="flex gap-3">
          {step > 0 && (
            <Button type="button" variant="ghost" onClick={() => setStep(step - 1)}>
              Atrás
            </Button>
          )}
          {step < lastStep ? (
            <Button type="submit" className="flex-1" disabled={!canContinue}>
              Siguiente
            </Button>
          ) : (
            <SubmitButton pending={isPending} className="flex-1" pendingLabel="Armando..." disabled={!canContinue}>
              Listo, armar presupuesto
            </SubmitButton>
          )}
        </div>
      </div>
    </form>
  );
}
