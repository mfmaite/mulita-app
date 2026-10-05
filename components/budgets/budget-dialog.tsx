"use client";

import { EditTrigger } from "@/components/ui/dialog-triggers";
import { FormDialog } from "@/components/ui/form-dialog";
import { SubmitButton } from "@/components/ui/submit-button";
import { TextField } from "@/components/ui/text-field";
import { useFormAction } from "@/components/ui/use-form-action";
import { setBudget } from "@/lib/budgets/actions";
import type { BudgetRow } from "@/lib/budgets/queries";
import { centsToInput } from "@/lib/money";
import { formatMonth } from "@/lib/month";

type BudgetDialogProps = {
  row: BudgetRow;
  month: string;
};

function BudgetForm({ row, month, onSaved }: BudgetDialogProps & { onSaved: () => void }) {
  const [state, onSubmit, isPending] = useFormAction(setBudget.bind(null, row.id, month), onSaved);

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <TextField
        label="Presupuesto mensual ($)"
        name="amount"
        inputMode="decimal"
        placeholder="0"
        autoFocus
        defaultValue={row.budget > 0 ? centsToInput(row.budget) : undefined}
        hint={`Vale desde ${formatMonth(month).toLowerCase()} en adelante. Los meses anteriores no cambian.`}
        errors={state.fieldErrors?.amount}
        className="font-display text-2xl font-bold"
      />
      <SubmitButton pending={isPending} className="w-full" pendingLabel="Guardando...">
        Guardar presupuesto
      </SubmitButton>
    </form>
  );
}

export function BudgetDialog({ row, month }: BudgetDialogProps) {
  return (
    <FormDialog
      title={`Presupuesto de ${row.name}`}
      trigger={(open) => <EditTrigger label={`Editar presupuesto de ${row.name}`} onClick={open} />}
    >
      {(close) => <BudgetForm row={row} month={month} onSaved={close} />}
    </FormDialog>
  );
}
