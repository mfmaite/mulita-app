"use client";

import { CalendarClock } from "lucide-react";
import { FormDialog } from "@/components/ui/form-dialog";
import { SubmitButton } from "@/components/ui/submit-button";
import { TextField } from "@/components/ui/text-field";
import { useFormAction } from "@/components/ui/use-form-action";
import { setClosingOverride } from "@/lib/cards/actions";
import type { CardWithClosing } from "@/lib/cards/queries";

type ClosingOverrideDialogProps = {
  card: CardWithClosing;
  month: string;
};

function ClosingOverrideForm({ card, month, onSaved }: ClosingOverrideDialogProps & { onSaved: () => void }) {
  const [state, onSubmit, isPending] = useFormAction(setClosingOverride.bind(null, card.id), onSaved);

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <p className="text-sm text-muted">
        {card.name} cierra el {card.closingDay}, pero a veces se corre (por ejemplo, si cae domingo). Cambialo solo
        para el mes que corresponda.
      </p>
      <TextField label="Mes" name="month" type="month" defaultValue={month} errors={state.fieldErrors?.month} />
      <TextField
        label="Ese mes cierra el día"
        name="closingDay"
        type="number"
        inputMode="numeric"
        min={1}
        max={31}
        defaultValue={card.monthClosingDay}
        errors={state.fieldErrors?.closingDay}
      />
      <SubmitButton pending={isPending} className="w-full" pendingLabel="Guardando...">
        Guardar cierre
      </SubmitButton>
    </form>
  );
}

export function ClosingOverrideDialog({ card, month }: ClosingOverrideDialogProps) {
  return (
    <FormDialog
      title="Cierre de un mes"
      trigger={(open) => (
        <button
          onClick={open}
          aria-label={`Cambiar el cierre de un mes de ${card.name}`}
          className="rounded-full p-2 text-green-800 hover:bg-cream-100"
        >
          <CalendarClock className="size-4" aria-hidden />
        </button>
      )}
    >
      {(close) => <ClosingOverrideForm card={card} month={month} onSaved={close} />}
    </FormDialog>
  );
}
