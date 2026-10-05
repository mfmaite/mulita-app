"use client";

import type { ReactNode } from "react";
import { ConfirmDeleteButton } from "@/components/ui/confirm-delete-button";
import { FormDialog } from "@/components/ui/form-dialog";
import { deleteMovement } from "@/lib/movements/actions";
import type { MonthMovement, MovementFormData } from "@/lib/movements/queries";
import { MovementForm } from "./movement-form";

type MovementDialogProps = {
  data: MovementFormData;
  movement?: MonthMovement;
  trigger: (open: () => void) => ReactNode;
};

export function MovementDialog({ data, movement, trigger }: MovementDialogProps) {
  return (
    <FormDialog title={movement ? "Editar movimiento" : "Crear movimiento"} trigger={trigger}>
      {(close) => (
        <>
          <MovementForm data={data} movement={movement} onSaved={close} />
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
