"use client";

import { useState } from "react";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { TextField } from "@/components/ui/text-field";
import { useFormAction } from "@/components/ui/use-form-action";
import { saveCardPayment } from "@/lib/cards/actions";
import type { CurrencyTotals } from "@/lib/cards/statement";
import { today } from "@/lib/dates";
import { centsToInput, formatMoney } from "@/lib/money";
import type { MonthMovement, MovementFormData } from "@/lib/movements/queries";

const currencySymbols = { UYU: "$", USD: "US$" };

type PayStatementFormProps = {
  cardId: string;
  accounts: MovementFormData["accounts"];
  totals?: CurrencyTotals;
  payment?: MonthMovement;
  onSaved: () => void;
};

export function PayStatementForm({ cardId, accounts, totals = {}, payment, onSaved }: PayStatementFormProps) {
  const [state, onSubmit, isPending] = useFormAction(saveCardPayment.bind(null, cardId, payment?.id ?? null), onSaved);

  const suggestionFor = (accountId: string) => {
    const currency = accounts.find(({ id }) => id === accountId)?.currency;
    const due = currency && totals[currency];
    return due ? centsToInput(due) : "";
  };

  const initialAccountId =
    payment?.accountId ?? accounts.find(({ currency }) => totals[currency])?.id ?? accounts[0]?.id ?? "";
  const [accountId, setAccountId] = useState(initialAccountId);
  const [amount, setAmount] = useState(payment ? centsToInput(payment.amount) : suggestionFor(initialAccountId));
  const [amountEdited, setAmountEdited] = useState(Boolean(payment));

  const currency = accounts.find(({ id }) => id === accountId)?.currency ?? "UYU";
  const due = totals[currency];

  const changeAccount = (nextAccountId: string) => {
    setAccountId(nextAccountId);
    if (!amountEdited) setAmount(suggestionFor(nextAccountId));
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <Field label="¿Desde qué cuenta pagás?" errors={state.fieldErrors?.accountId}>
        <Select name="accountId" value={accountId} onChange={(event) => changeAccount(event.target.value)}>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </Select>
      </Field>
      <TextField
        label={`Monto (${currencySymbols[currency]})`}
        name="amount"
        inputMode="decimal"
        placeholder="0"
        value={amount}
        onChange={(event) => {
          setAmount(event.target.value);
          setAmountEdited(true);
        }}
        hint={due ? `Este mes pagás ${formatMoney(due, currency)} en ${currency === "UYU" ? "pesos" : "dólares"}.` : undefined}
        errors={state.fieldErrors?.amount}
        className="font-display text-2xl font-bold"
      />
      <TextField label="Fecha" name="date" type="date" defaultValue={payment?.date ?? today()} errors={state.fieldErrors?.date} />
      <SubmitButton pending={isPending} className="w-full" pendingLabel="Pagando...">
        {payment ? "Guardar cambios" : "Pagar resumen"}
      </SubmitButton>
    </form>
  );
}
