"use client";

import { CreateTrigger } from "@/components/ui/dialog-triggers";
import type { MovementFormData } from "@/lib/movements/queries";
import { MovementDialog } from "./movement-dialog";

type NewMovementButtonProps = {
  data: MovementFormData;
  label?: string;
  className?: string;
};

export function NewMovementButton({ data, label = "Crear movimiento", className }: NewMovementButtonProps) {
  return (
    <MovementDialog
      data={data}
      trigger={(open) => <CreateTrigger label={label} onClick={open} className={className} />}
    />
  );
}
