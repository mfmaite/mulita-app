"use client";

import { Scale } from "lucide-react";
import { FormDialog } from "@/components/ui/form-dialog";
import { Money } from "@/components/ui/money";
import { SubmitButton } from "@/components/ui/submit-button";
import { TextField } from "@/components/ui/text-field";
import { useFormAction } from "@/components/ui/use-form-action";
import type { AccountWithBalance } from "@/lib/accounts/queries";
import { reconcileAccount } from "@/lib/movements/actions";

function ReconcileForm({ account, onSaved }: { account: AccountWithBalance; onSaved: () => void }) {
  const [state, onSubmit, isPending] = useFormAction(reconcileAccount.bind(null, account.id), onSaved);

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <p className="rounded-2xl bg-cream-100 px-4 py-3 text-sm">
        Según Mulita, en <strong>{account.name}</strong> tenés{" "}
        <Money cents={account.balance} currency={account.currency} className="font-semibold" />.
      </p>
      <TextField
        label="¿Cuánto tenés de verdad?"
        name="realBalance"
        inputMode="decimal"
        placeholder="0"
        autoFocus
        hint="Mulita anota la diferencia como un ajuste de hoy."
        defaultValue={state.values?.realBalance}
        errors={state.fieldErrors?.realBalance}
        className="font-display text-2xl font-bold"
      />
      <SubmitButton pending={isPending} className="w-full" pendingLabel="Cuadrando...">
        Cuadrar saldo
      </SubmitButton>
    </form>
  );
}

export function ReconcileDialog({ account }: { account: AccountWithBalance }) {
  return (
    <FormDialog
      title="Cuadrar saldo"
      trigger={(open) => (
        <button
          onClick={open}
          aria-label={`Cuadrar saldo de ${account.name}`}
          className="rounded-full p-2 text-green-800 hover:bg-cream-100"
        >
          <Scale className="size-4" aria-hidden />
        </button>
      )}
    >
      {(close) => <ReconcileForm account={account} onSaved={close} />}
    </FormDialog>
  );
}
