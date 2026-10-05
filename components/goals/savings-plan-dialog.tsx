"use client";

import { FormDialog } from "@/components/ui/form-dialog";
import { SubmitButton } from "@/components/ui/submit-button";
import { TextField } from "@/components/ui/text-field";
import { useFormAction } from "@/components/ui/use-form-action";
import { setSavingsPlan } from "@/lib/goals/actions";
import { centsToInput } from "@/lib/money";

function SavingsPlanForm({ monthlyPlan, onSaved }: { monthlyPlan: number; onSaved: () => void }) {
  const [state, onSubmit, isPending] = useFormAction(setSavingsPlan, onSaved);

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <TextField
        label="¿Cuánto querés ahorrar por mes? ($)"
        name="monthlySavingsPlan"
        inputMode="decimal"
        placeholder="0"
        autoFocus
        hint="Vale desde este mes en adelante. Con esto Mulita calcula cuánto le toca a cada meta y cuándo llegás."
        defaultValue={monthlyPlan > 0 ? centsToInput(monthlyPlan) : undefined}
        errors={state.fieldErrors?.monthlySavingsPlan}
        className="font-display text-2xl font-bold"
      />
      <SubmitButton pending={isPending} className="w-full" pendingLabel="Guardando...">
        Guardar
      </SubmitButton>
    </form>
  );
}

export function SavingsPlanDialog({ monthlyPlan }: { monthlyPlan: number }) {
  return (
    <FormDialog
      title="Ahorro mensual"
      trigger={(open) => (
        <button onClick={open} className="font-semibold text-cream-50 underline underline-offset-4">
          {monthlyPlan > 0 ? "Cambiar" : "Definirlo"}
        </button>
      )}
    >
      {(close) => <SavingsPlanForm monthlyPlan={monthlyPlan} onSaved={close} />}
    </FormDialog>
  );
}
