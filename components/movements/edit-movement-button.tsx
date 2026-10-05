"use client";

import { EditTrigger } from "@/components/ui/dialog-triggers";
import type { MonthMovement, MovementFormData } from "@/lib/movements/queries";
import { MovementDialog } from "./movement-dialog";

type EditMovementButtonProps = {
  data: MovementFormData;
  movement: MonthMovement;
};

export function EditMovementButton({ data, movement }: EditMovementButtonProps) {
  return (
    <MovementDialog
      data={data}
      movement={movement}
      trigger={(open) => <EditTrigger label="Editar movimiento" onClick={open} />}
    />
  );
}
