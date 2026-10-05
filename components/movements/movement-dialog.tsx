"use client";

import type { ReactNode } from "react";
import { ConfirmDeleteButton } from "@/components/ui/confirm-delete-button";
import { FormDialog } from "@/components/ui/form-dialog";
import { deleteMovement } from "@/lib/movements/actions";
import type { MonthMovement, MovementFormData } from "@/lib/movements/queries";
import { PayStatementForm } from "@/components/cards/pay-statement-form";
import { MovementForm } from "./movement-form";

type MovementDialogProps = {
  data: MovementFormData;
  movement?: MonthMovement;
  trigger: (open: () => void) => ReactNode;
};

function titleFor(movement?: MonthMovement) {
  if (!movement) return "Crear movimiento";
  if (movement.type === "adjustment") return "Cuadre de saldo";
  return movement.type === "card_payment" ? "Pago de tarjeta" : "Editar movimiento";
}

export function MovementDialog({ data, movement, trigger }: MovementDialogProps) {
  return (
    <FormDialog title={titleFor(movement)} trigger={trigger}>
      {(close) => (
        <>
          {movement?.type === "adjustment" ? (
            <div className="space-y-1 text-center">
              <p>Este ajuste lo hizo Mulita cuando cuadraste el saldo de {movement.accountName}.</p>
              <p className="text-sm text-muted">Si algo no cerraba, borralo y volvé a cuadrar.</p>
            </div>
          ) : movement?.type === "card_payment" && movement.cardId ? (
            <PayStatementForm cardId={movement.cardId} accounts={data.accounts} payment={movement} onSaved={close} />
          ) : (
            <MovementForm data={data} movement={movement} onSaved={close} />
          )}
          {movement && (
            <ConfirmDeleteButton
              label="Borrar movimiento"
              question="¿Lo borramos?"
              onConfirm={() => deleteMovement(movement.id)}
              onDeleted={close}
            />
          )}
        </>
      )}
    </FormDialog>
  );
}
