"use client";

import { Field } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { TextField } from "@/components/ui/text-field";
import { Textarea } from "@/components/ui/textarea";
import { useFormAction } from "@/components/ui/use-form-action";
import type { SavingsGoal } from "@/lib/db/schema";
import { createGoal, updateGoal } from "@/lib/goals/actions";
import { centsToInput } from "@/lib/money";

type GoalFormProps = {
  goal?: SavingsGoal;
  onSaved: () => void;
};

export function GoalForm({ goal, onSaved }: GoalFormProps) {
  const save = goal ? updateGoal.bind(null, goal.id) : createGoal;
  const [state, onSubmit, isPending] = useFormAction(save, onSaved);

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <TextField
        label="Nombre"
        name="name"
        placeholder="Ej: Viaje a Brasil"
        defaultValue={goal?.name}
        errors={state.fieldErrors?.name}
      />
      <TextField
        label="¿Cuánto querés juntar? ($)"
        name="target"
        inputMode="decimal"
        placeholder="0"
        defaultValue={goal ? centsToInput(goal.target) : undefined}
        errors={state.fieldErrors?.target}
      />
      <TextField
        label="Porcentaje de tu ahorro (%)"
        name="share"
        type="number"
        inputMode="numeric"
        min={0}
        max={100}
        placeholder="Ej: 20"
        hint="Qué parte de lo que ahorrás va a esta meta."
        defaultValue={goal?.share}
        errors={state.fieldErrors?.share}
      />
      <Field label="Nota (opcional)" errors={state.fieldErrors?.note}>
        <Textarea
          name="note"
          placeholder="Ej: arrancar con un mes de gastos y después ir por tres"
          defaultValue={goal?.note ?? ""}
          aria-invalid={Boolean(state.fieldErrors?.note)}
        />
      </Field>
      <SubmitButton pending={isPending} className="w-full" pendingLabel="Guardando...">
        {goal ? "Guardar cambios" : "Crear meta"}
      </SubmitButton>
    </form>
  );
}
