"use client";

import { SubmitButton } from "@/components/ui/submit-button";
import { TextField } from "@/components/ui/text-field";
import { useFormAction } from "@/components/ui/use-form-action";
import { createCard, updateCard } from "@/lib/cards/actions";
import type { CreditCard } from "@/lib/db/schema";

type CardFormProps = {
  card?: CreditCard;
  onSaved: () => void;
};

export function CardForm({ card, onSaved }: CardFormProps) {
  const save = card ? updateCard.bind(null, card.id) : createCard;
  const [state, onSubmit, isPending] = useFormAction(save, onSaved);

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <TextField
        label="Nombre"
        name="name"
        placeholder="Ej: OCA"
        defaultValue={card?.name}
        errors={state.fieldErrors?.name}
      />
      <TextField
        label="Día de cierre"
        name="closingDay"
        type="number"
        inputMode="numeric"
        min={1}
        max={31}
        placeholder="Ej: 27"
        hint="El día del mes en que cierra el resumen. Si algún mes cierra otro día, lo podés cambiar después."
        defaultValue={card?.closingDay}
        errors={state.fieldErrors?.closingDay}
      />
      <SubmitButton pending={isPending} className="w-full" pendingLabel="Guardando...">
        {card ? "Guardar cambios" : "Crear tarjeta"}
      </SubmitButton>
    </form>
  );
}
