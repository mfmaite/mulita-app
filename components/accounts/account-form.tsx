"use client";

import { SegmentedControl } from "@/components/ui/segmented-control";
import { SubmitButton } from "@/components/ui/submit-button";
import { TextField } from "@/components/ui/text-field";
import { useFormAction } from "@/components/ui/use-form-action";
import { createAccount, updateAccount } from "@/lib/accounts/actions";
import type { Account } from "@/lib/db/schema";
import { centsToInput } from "@/lib/money";
import { accountTypeMeta, currencyLabels } from "./account-meta";

const typeOptions = Object.entries(accountTypeMeta).map(([value, { label }]) => ({ value, label }));
const currencyOptions = Object.entries(currencyLabels).map(([value, label]) => ({ value, label }));

type AccountFormProps = {
  account?: Account;
  onSaved: () => void;
};

export function AccountForm({ account, onSaved }: AccountFormProps) {
  const save = account ? updateAccount.bind(null, account.id) : createAccount;
  const [state, action] = useFormAction(save, onSaved);

  const values = {
    name: account?.name,
    type: account?.type,
    currency: account?.currency,
    initialBalance: account ? centsToInput(account.initialBalance) : undefined,
    ...state.values,
  };

  return (
    <form action={action} noValidate className="space-y-4">
      <TextField
        label="Nombre"
        name="name"
        placeholder="Ej: Caja de ahorro BROU"
        defaultValue={values.name}
        errors={state.fieldErrors?.name}
      />
      <SegmentedControl label="Tipo" name="type" options={typeOptions} defaultValue={values.type ?? "checking"} />
      <SegmentedControl
        label="Moneda"
        name="currency"
        options={currencyOptions}
        defaultValue={values.currency ?? "UYU"}
        errors={state.fieldErrors?.currency}
      />
      <TextField
        label="Saldo inicial"
        name="initialBalance"
        inputMode="decimal"
        placeholder="0"
        hint="Lo que tenés hoy en la cuenta. Después vamos viendo."
        defaultValue={values.initialBalance}
        errors={state.fieldErrors?.initialBalance}
      />
      <SubmitButton className="w-full" pendingLabel="Guardando...">
        {account ? "Guardar cambios" : "Crear cuenta"}
      </SubmitButton>
    </form>
  );
}
