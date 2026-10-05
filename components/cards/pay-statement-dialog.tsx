"use client";

import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/ui/form-dialog";
import type { CurrencyTotals } from "@/lib/cards/statement";
import type { MovementFormData } from "@/lib/movements/queries";
import { PayStatementForm } from "./pay-statement-form";

type PayStatementDialogProps = {
  cardId: string;
  accounts: MovementFormData["accounts"];
  totals: CurrencyTotals;
};

export function PayStatementDialog({ cardId, accounts, totals }: PayStatementDialogProps) {
  return (
    <FormDialog
      title="Pagar resumen"
      trigger={(open) => (
        <Button variant="secondary" onClick={open} className="w-full sm:w-auto">
          Pagar resumen
        </Button>
      )}
    >
      {(close) => <PayStatementForm cardId={cardId} accounts={accounts} totals={totals} onSaved={close} />}
    </FormDialog>
  );
}
