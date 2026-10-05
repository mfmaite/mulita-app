"use client";

import { useState } from "react";
import { SourceSelect } from "@/components/movements/source-select";
import { AmountField } from "@/components/ui/amount-field";
import { CheckboxField } from "@/components/ui/checkbox-field";
import { Field } from "@/components/ui/field";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { TextField } from "@/components/ui/text-field";
import { Textarea } from "@/components/ui/textarea";
import { useFormAction } from "@/components/ui/use-form-action";
import type { Currency, FixedCommitment, FixedKind } from "@/lib/db/schema";
import { createFixed, updateFixed } from "@/lib/fixed/actions";
import { centsToInput, currencySymbols } from "@/lib/money";
import { currentMonth } from "@/lib/month";
import type { MovementFormData } from "@/lib/movements/queries";
import { frequencyLabels, kindLabels } from "./fixed-meta";

const kindOptions = Object.entries(kindLabels).map(([value, label]) => ({ value, label }));
const frequencyOptions = Object.entries(frequencyLabels);
const currencyOptions = [
  { value: "UYU", label: "Pesos" },
  { value: "USD", label: "Dólares" },
];

function sourceOf(fixed?: FixedCommitment) {
  if (fixed?.kind !== "expense") return undefined;
  return fixed.cardId ? `card:${fixed.cardId}` : `account:${fixed.accountId}`;
}

type FixedFormProps = {
  data: MovementFormData;
  fixed?: FixedCommitment;
  onSaved: () => void;
};

export function FixedForm({ data, fixed, onSaved }: FixedFormProps) {
  const save = fixed ? updateFixed.bind(null, fixed.id) : createFixed;
  const [state, onSubmit, isPending] = useFormAction(save, onSaved);

  const firstAccount = data.accounts[0]?.id ?? "";
  const savingsAccounts = data.accounts.filter((account) => account.type === "savings");

  const [kind, setKind] = useState<FixedKind>(fixed?.kind ?? "expense");
  const [source, setSource] = useState(sourceOf(fixed) ?? data.lastSource ?? `account:${firstAccount}`);
  const [accountId, setAccountId] = useState(fixed?.accountId ?? firstAccount);
  const [cardCurrency, setCardCurrency] = useState<Currency>(fixed?.currency ?? "UYU");
  const [amount, setAmount] = useState(fixed ? centsToInput(fixed.amount) : "");

  const [sourceKind, sourceId] = source.split(":");
  const paysWithCard = kind === "expense" && sourceKind === "card";
  const fromAccountId = kind === "expense" ? sourceId : accountId;
  const currency = paysWithCard
    ? cardCurrency
    : (data.accounts.find(({ id }) => id === fromAccountId)?.currency ?? "UYU");

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <SegmentedControl
        label="Tipo"
        name="kind"
        options={kindOptions}
        defaultValue={kind}
        errors={state.fieldErrors?.kind}
        onValueChange={(value) => setKind(value as FixedKind)}
      />
      <TextField
        label="Nombre"
        name="name"
        placeholder={kind === "savings" ? "Ej: Ahorro del mes" : kind === "card_payment" ? "Ej: Resumen OCA" : "Ej: Alquiler"}
        defaultValue={fixed?.name}
        errors={state.fieldErrors?.name}
      />
      <AmountField
        label={`Monto estimado (${currencySymbols[currency]})`}
        name="amount"
        currency={currency}
        placeholder="0"
        value={amount}
        onValueChange={setAmount}
        errors={state.fieldErrors?.amount}
      />
      <CheckboxField
        name="variableAmount"
        label="El monto cambia de un mes a otro (es un estimado)"
        defaultChecked={fixed?.variableAmount}
      />
      {kind === "expense" && (
        <>
          <Field label="¿Con qué lo pagás?" errors={state.fieldErrors?.source}>
            <SourceSelect accounts={data.accounts} cards={data.cards} value={source} onChange={setSource} />
          </Field>
          {paysWithCard && (
            <SegmentedControl
              label="Moneda"
              name="currency"
              options={currencyOptions}
              defaultValue={cardCurrency}
              errors={state.fieldErrors?.currency}
              onValueChange={(value) => setCardCurrency(value as Currency)}
            />
          )}
          <Field label="Categoría" errors={state.fieldErrors?.categoryId}>
            <Select name="categoryId" defaultValue={fixed?.categoryId ?? ""}>
              <option value="" disabled>
                Elegí una categoría
              </option>
              {data.categories
                .filter((category) => category.kind === "expense")
                .map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </Select>
          </Field>
        </>
      )}
      {kind !== "expense" && (
        <Field label={kind === "savings" ? "Desde" : "¿Desde qué cuenta lo pagás?"} errors={state.fieldErrors?.accountId}>
          <Select name="accountId" value={accountId} onChange={(event) => setAccountId(event.target.value)}>
            {data.accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </Select>
        </Field>
      )}
      {kind === "card_payment" && (
        <Field label="Tarjeta" errors={state.fieldErrors?.cardId}>
          <Select name="cardId" defaultValue={fixed?.cardId ?? data.cards[0]?.id ?? ""}>
            {data.cards.map((card) => (
              <option key={card.id} value={card.id}>
                {card.name}
              </option>
            ))}
          </Select>
        </Field>
      )}
      {kind === "savings" && (
        <Field label="Hacia" errors={state.fieldErrors?.destinationAccountId}>
          <Select name="destinationAccountId" defaultValue={fixed?.destinationAccountId ?? savingsAccounts[0]?.id ?? ""}>
            {savingsAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </Select>
        </Field>
      )}
      <div className="grid grid-cols-[7rem_1fr] gap-3">
        <TextField
          label="Vence el día"
          name="dueDay"
          type="number"
          inputMode="numeric"
          min={1}
          max={31}
          placeholder="Ej: 5"
          defaultValue={fixed?.dueDay}
          errors={state.fieldErrors?.dueDay}
        />
        <Field label="Cada cuánto" errors={state.fieldErrors?.frequency}>
          <Select name="frequency" defaultValue={fixed?.frequency ?? "monthly"}>
            {frequencyOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <TextField
        label="Desde qué mes"
        name="startMonth"
        type="month"
        hint="Para los que no son mensuales: el primer mes en que se paga."
        defaultValue={fixed?.startMonth.slice(0, 7) ?? currentMonth()}
        errors={state.fieldErrors?.startMonth}
      />
      <Field label="Nota (opcional)" errors={state.fieldErrors?.note}>
        <Textarea name="note" rows={2} placeholder="Ej: ajustar cuando llegue la factura" defaultValue={fixed?.note ?? ""} />
      </Field>
      <SubmitButton pending={isPending} className="w-full" pendingLabel="Guardando...">
        {fixed ? "Guardar cambios" : "Agendar fijo"}
      </SubmitButton>
    </form>
  );
}
