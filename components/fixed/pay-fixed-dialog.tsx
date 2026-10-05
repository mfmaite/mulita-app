"use client";

import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/ui/form-dialog";
import type { DueFixed } from "@/lib/fixed/queries";
import { PayFixedForm } from "./pay-fixed-form";

type PayFixedDialogProps = {
  row: DueFixed;
  month: string;
};

export function PayFixedDialog({ row, month }: PayFixedDialogProps) {
  return (
    <FormDialog
      title={`Pagar ${row.fixed.name}`}
      trigger={(open) => (
        <Button variant="secondary" onClick={open} className="px-3 py-1 text-sm">
          Pagar
        </Button>
      )}
    >
      {(close) => <PayFixedForm row={row} month={month} onSaved={close} />}
    </FormDialog>
  );
}
