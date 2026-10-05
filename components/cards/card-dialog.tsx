"use client";

import { ConfirmDeleteButton } from "@/components/ui/confirm-delete-button";
import { CreateTrigger, EditTrigger } from "@/components/ui/dialog-triggers";
import { FormDialog } from "@/components/ui/form-dialog";
import { deleteCard } from "@/lib/cards/actions";
import type { CreditCard } from "@/lib/db/schema";
import { CardForm } from "./card-form";

export function CardDialog({ card }: { card?: CreditCard }) {
  if (!card) {
    return (
      <FormDialog title="Nueva tarjeta" trigger={(open) => <CreateTrigger label="Nueva tarjeta" onClick={open} />}>
        {(close) => <CardForm onSaved={close} />}
      </FormDialog>
    );
  }

  return (
    <FormDialog title="Editar tarjeta" trigger={(open) => <EditTrigger label={`Editar ${card.name}`} onClick={open} />}>
      {(close) => (
        <>
          <CardForm card={card} onSaved={close} />
          <ConfirmDeleteButton
            label="Borrar tarjeta"
            question="¿La borramos?"
            onConfirm={() => deleteCard(card.id)}
            onDeleted={close}
          />
        </>
      )}
    </FormDialog>
  );
}
