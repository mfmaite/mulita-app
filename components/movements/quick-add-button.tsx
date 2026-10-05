"use client";

import { Plus } from "lucide-react";
import type { MovementFormData } from "@/lib/movements/queries";
import { MovementDialog } from "./movement-dialog";

export function QuickAddButton({ data }: { data: MovementFormData }) {
  return (
    <div className="flex flex-1 justify-center">
      <MovementDialog
        data={data}
        trigger={(open) => (
          <button
            onClick={open}
            aria-label="Crear movimiento"
            className="-mt-6 flex size-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg ring-4 ring-background transition-colors hover:bg-primary-hover"
          >
            <Plus className="size-7" aria-hidden />
          </button>
        )}
      />
    </div>
  );
}
