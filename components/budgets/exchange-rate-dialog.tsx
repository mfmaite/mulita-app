"use client";

import { FormDialog } from "@/components/ui/form-dialog";
import { SubmitButton } from "@/components/ui/submit-button";
import { TextField } from "@/components/ui/text-field";
import { useFormAction } from "@/components/ui/use-form-action";
import { setExchangeRate } from "@/lib/budgets/actions";
import { centsToInput } from "@/lib/money";
import { formatMonth } from "@/lib/month";

type ExchangeRateDialogProps = {
  month: string;
  usdToUyu?: number;
};

function ExchangeRateForm({ month, usdToUyu, onSaved }: ExchangeRateDialogProps & { onSaved: () => void }) {
  const [state, onSubmit, isPending] = useFormAction(setExchangeRate.bind(null, month), onSaved);

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <TextField
        label="¿Cuántos pesos vale un dólar?"
        name="usdToUyu"
        inputMode="decimal"
        placeholder="Ej: 41,25"
        autoFocus
        defaultValue={usdToUyu ? centsToInput(usdToUyu) : undefined}
        hint={`Se usa para pasar a pesos tus gastos en dólares de ${formatMonth(month).toLowerCase()} y de los meses siguientes sin cotización.`}
        errors={state.fieldErrors?.usdToUyu}
        className="font-display text-2xl font-bold"
      />
      <SubmitButton pending={isPending} className="w-full" pendingLabel="Guardando...">
        Guardar cotización
      </SubmitButton>
    </form>
  );
}

export function ExchangeRateDialog({ month, usdToUyu }: ExchangeRateDialogProps) {
  return (
    <FormDialog
      title="Cotización del dólar"
      trigger={(open) => (
        <button onClick={open} className="font-semibold text-primary underline-offset-4 hover:underline">
          {usdToUyu ? "Cambiar" : "Cargar cotización"}
        </button>
      )}
    >
      {(close) => <ExchangeRateForm month={month} usdToUyu={usdToUyu} onSaved={close} />}
    </FormDialog>
  );
}
