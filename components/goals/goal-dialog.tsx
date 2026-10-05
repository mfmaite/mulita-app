"use client";

import { ConfirmDeleteButton } from "@/components/ui/confirm-delete-button";
import { CreateTrigger, EditTrigger } from "@/components/ui/dialog-triggers";
import { FormDialog } from "@/components/ui/form-dialog";
import type { SavingsGoal } from "@/lib/db/schema";
import { deleteGoal } from "@/lib/goals/actions";
import { GoalForm } from "./goal-form";

export function GoalDialog({ goal }: { goal?: SavingsGoal }) {
  if (!goal) {
    return (
      <FormDialog title="Nueva meta" trigger={(open) => <CreateTrigger label="Nueva meta" onClick={open} />}>
        {(close) => <GoalForm onSaved={close} />}
      </FormDialog>
    );
  }

  return (
    <FormDialog title="Editar meta" trigger={(open) => <EditTrigger label={`Editar ${goal.name}`} onClick={open} />}>
      {(close) => (
        <>
          <GoalForm goal={goal} onSaved={close} />
          <ConfirmDeleteButton
            label="Borrar meta"
            question="¿La borramos?"
            onConfirm={() => deleteGoal(goal.id)}
            onDeleted={close}
          />
        </>
      )}
    </FormDialog>
  );
}
