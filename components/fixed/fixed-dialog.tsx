"use client";

import { ConfirmDeleteButton } from "@/components/ui/confirm-delete-button";
import { CreateTrigger, EditTrigger } from "@/components/ui/dialog-triggers";
import { FormDialog } from "@/components/ui/form-dialog";
import type { FixedCommitment } from "@/lib/db/schema";
import { deleteFixed } from "@/lib/fixed/actions";
import type { MovementFormData } from "@/lib/movements/queries";
import { FixedForm } from "./fixed-form";
import { PauseFixedButton } from "./pause-fixed-button";

type FixedDialogProps = {
  data: MovementFormData;
  fixed?: FixedCommitment;
};

export function FixedDialog({ data, fixed }: FixedDialogProps) {
  if (!fixed) {
    return (
      <FormDialog title="Nuevo fijo" trigger={(open) => <CreateTrigger label="Nuevo fijo" onClick={open} />}>
        {(close) => <FixedForm data={data} onSaved={close} />}
      </FormDialog>
    );
  }

  return (
    <FormDialog title="Editar fijo" trigger={(open) => <EditTrigger label={`Editar ${fixed.name}`} onClick={open} />}>
      {(close) => (
        <>
          <FixedForm data={data} fixed={fixed} onSaved={close} />
          <PauseFixedButton id={fixed.id} active={fixed.active} onDone={close} />
          <ConfirmDeleteButton
            label="Borrar fijo"
            question="¿Lo borramos?"
            onConfirm={() => deleteFixed(fixed.id)}
            onDeleted={close}
          />
        </>
      )}
    </FormDialog>
  );
}
