"use client";

import { useState } from "react";
import { AmountField } from "@/components/ui/amount-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { TextField } from "@/components/ui/text-field";
import { useFormAction } from "@/components/ui/use-form-action";
import { today } from "@/lib/dates";
import { payFixed } from "@/lib/fixed/actions";
import type { DueFixed } from "@/lib/fixed/queries";
import { centsToInput, currencySymbols, formatMoney } from "@/lib/money";

type PayFixedFormProps = {
  row: DueFixed;
  month: string;
  onSaved: () => void;
};

export function PayFixedForm({ row, month, onSaved }: PayFixedFormProps) {
  const { fixed, currency, destinationName, destinationCurrency } = row;
  const [state, onSubmit, isPending] = useFormAction(payFixed.bind(null, fixed.id, month), onSaved);
  const [amount, setAmount] = useState(centsToInput(fixed.amount));
  const [destinationAmount, setDestinationAmount] = useState("");

  const needsDestinationAmount = fixed.kind === "savings" && destinationCurrency && destinationCurrency !== currency;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <AmountField
        label={`Monto (${currencySymbols[currency]})`}
        name="amount"
        currency={currency}
        value={amount}
        onValueChange={setAmount}
        hint={fixed.variableAmount ? `El estimado es ${formatMoney(fixed.amount, currency)}. Poné lo que vino.` : undefined}
        errors={state.fieldErrors?.amount}
        className="font-display text-2xl font-bold"
      />
      {needsDestinationAmount && (
        <AmountField
          label={`Cuánto llegó a ${destinationName} (${currencySymbols[destinationCurrency]})`}
          name="destinationAmount"
          currency={destinationCurrency}
          placeholder="0"
          value={destinationAmount}
          onValueChange={setDestinationAmount}
          errors={state.fieldErrors?.destinationAmount}
        />
      )}
      <TextField label="Fecha" name="date" type="date" defaultValue={today()} errors={state.fieldErrors?.date} />
      <SubmitButton pending={isPending} className="w-full" pendingLabel="Pagando...">
        Pagar
      </SubmitButton>
    </form>
  );
}
