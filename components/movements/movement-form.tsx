"use client";

import Link from "next/link";
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SubmitButton } from "@/components/ui/submit-button";
import { TextField } from "@/components/ui/text-field";
import { useFormAction } from "@/components/ui/use-form-action";
import { today } from "@/lib/dates";
import type { Currency, MovementType } from "@/lib/db/schema";
import { centsToInput, parseMoney } from "@/lib/money";
import { createMovement, updateMovement } from "@/lib/movements/actions";
import type { MonthMovement, MovementFormData } from "@/lib/movements/queries";
import { CardPurchaseFields } from "./card-purchase-fields";

const typeOptions = [
  { value: "expense", label: "Gasto" },
  { value: "income", label: "Ingreso" },
  { value: "transfer", label: "Transferencia" },
];

const currencySymbols: Record<Currency, string> = { UYU: "$", USD: "US$" };

type AccountOption = MovementFormData["accounts"][number];
type CardOption = MovementFormData["cards"][number];

function withArchived<Option extends { id: string; name: string }>(options: Option[], current?: Option | false | null | "") {
  if (!current || options.some((option) => option.id === current.id)) return options;
  return [...options, { ...current, name: `${current.name} (archivada)` }];
}

function accountOptionsFor(data: MovementFormData, movement?: MonthMovement) {
  const source: AccountOption | undefined =
    movement?.accountId && movement.accountName && movement.accountType
      ? { id: movement.accountId, name: movement.accountName, currency: movement.currency, type: movement.accountType }
      : undefined;
  const destination: AccountOption | undefined =
    movement?.destinationAccountId && movement.destinationAccountName && movement.destinationCurrency && movement.destinationType
      ? {
          id: movement.destinationAccountId,
          name: movement.destinationAccountName,
          currency: movement.destinationCurrency,
          type: movement.destinationType,
        }
      : undefined;
  return withArchived(withArchived(data.accounts, source), destination);
}

function cardOptionsFor(data: MovementFormData, movement?: MonthMovement) {
  const current: CardOption | undefined =
    movement?.cardId && movement.cardName ? { id: movement.cardId, name: movement.cardName, closingDay: 1, overrides: [] } : undefined;
  return withArchived(data.cards, current);
}

function sourceOf(movement: MonthMovement) {
  return movement.cardId ? `card:${movement.cardId}` : `account:${movement.accountId}`;
}

type MovementFormProps = {
  data: MovementFormData;
  movement?: MonthMovement;
  onSaved: () => void;
};

export function MovementForm({ data, movement, onSaved }: MovementFormProps) {
  const save = movement ? updateMovement.bind(null, movement.id) : createMovement;
  const [state, onSubmit, isPending] = useFormAction(save, onSaved);

  const accounts = accountOptionsFor(data, movement);
  const cards = cardOptionsFor(data, movement);
  const isDifferentCurrency = movement?.destinationCurrency && movement.destinationCurrency !== movement.currency;

  const [type, setType] = useState<MovementType>(movement?.type ?? "expense");
  const [source, setSource] = useState(movement ? sourceOf(movement) : (data.lastSource ?? ""));
  const [destinationAccountId, setDestinationAccountId] = useState(movement?.destinationAccountId ?? "");
  const [categoryId, setCategoryId] = useState(movement?.categoryId ?? "");
  const [amount, setAmount] = useState(movement ? centsToInput(movement.amount) : "");
  const [date, setDate] = useState(movement?.date ?? today());
  const [cardCurrency, setCardCurrency] = useState<Currency>(movement?.cardId ? movement.currency : "UYU");

  if (data.accounts.length === 0) {
    return (
      <div className="space-y-3 text-center">
        <p className="text-muted">Para crear un movimiento primero necesitás una cuenta donde ponerlo.</p>
        <Link href="/cuentas" onClick={onSaved} className="font-semibold text-primary underline-offset-4 hover:underline">
          Crear mi primera cuenta
        </Link>
      </div>
    );
  }

  const [sourceKind, sourceId] = source.split(":");
  const card = sourceKind === "card" ? cards.find(({ id }) => id === sourceId) : undefined;
  const account = sourceKind === "account" ? accounts.find(({ id }) => id === sourceId) : undefined;
  const destination = accounts.find(({ id }) => id === destinationAccountId);
  const currency = card ? cardCurrency : (account?.currency ?? "UYU");
  const isTransfer = type === "transfer";
  const categories = withArchived(
    data.categories,
    movement?.categoryId && { id: movement.categoryId, name: movement.categoryName ?? "", kind: movement.type },
  ).filter((category) => category.kind === type);

  const changeType = (value: string) => {
    setType(value as MovementType);
    setCategoryId("");
    if (value !== "expense" && sourceKind === "card") setSource(`account:${accounts[0].id}`);
  };

  const amountLabel = card ? "Monto total" : isTransfer ? "Monto que sale" : "Monto";
  const sourceLabel = isTransfer ? "Desde" : type === "expense" ? "¿Con qué pagaste?" : "Cuenta";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <SegmentedControl
        label="Tipo"
        name="type"
        options={typeOptions}
        defaultValue={type}
        errors={state.fieldErrors?.type}
        onValueChange={changeType}
      />
      <TextField
        label={`${amountLabel} (${currencySymbols[currency]})`}
        name="amount"
        inputMode="decimal"
        placeholder="0"
        autoFocus={!movement}
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        errors={state.fieldErrors?.amount}
        className="font-display text-2xl font-bold"
      />
      <Field label={sourceLabel} errors={state.fieldErrors?.source}>
        <Select name="source" value={source} onChange={(event) => setSource(event.target.value)}>
          <optgroup label="Cuentas">
            {accounts.map((option) => (
              <option key={option.id} value={`account:${option.id}`}>
                {option.name}
              </option>
            ))}
          </optgroup>
          {type === "expense" && cards.length > 0 && (
            <optgroup label="Tarjetas">
              {cards.map((option) => (
                <option key={option.id} value={`card:${option.id}`}>
                  {option.name}
                </option>
              ))}
            </optgroup>
          )}
        </Select>
      </Field>
      {card && (
        <CardPurchaseFields
          card={card}
          date={date}
          amount={parseMoney(amount)}
          currency={cardCurrency}
          onCurrencyChange={setCardCurrency}
          initialInstallments={movement?.installments}
          initialFirstMonth={movement?.firstBillingMonth?.slice(0, 7)}
          fieldErrors={state.fieldErrors}
        />
      )}
      {isTransfer ? (
        <>
          <Field label="Hacia" errors={state.fieldErrors?.destinationAccountId}>
            <Select
              name="destinationAccountId"
              value={destinationAccountId}
              onChange={(event) => setDestinationAccountId(event.target.value)}
            >
              <option value="" disabled>
                Elegí a qué cuenta va
              </option>
              {accounts.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </Select>
          </Field>
          {destination && account && destination.currency !== account.currency && (
            <TextField
              label={`Monto que llega (${currencySymbols[destination.currency]})`}
              name="destinationAmount"
              inputMode="decimal"
              placeholder="0"
              hint="Por ejemplo, cuántos dólares te dieron al comprar."
              defaultValue={isDifferentCurrency && movement.destinationAmount ? centsToInput(movement.destinationAmount) : undefined}
              errors={state.fieldErrors?.destinationAmount}
            />
          )}
          {destination?.type === "savings" && (
            <Alert tone="info">Como va a una cuenta de ahorro, Mulita lo cuenta como ahorro del mes.</Alert>
          )}
        </>
      ) : (
        <Field label="Categoría" errors={state.fieldErrors?.categoryId}>
          <Select name="categoryId" value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
            <option value="" disabled>
              Elegí una categoría
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </Field>
      )}
      <TextField
        label="Fecha"
        name="date"
        type="date"
        value={date}
        onChange={(event) => setDate(event.target.value)}
        errors={state.fieldErrors?.date}
      />
      <TextField
        label="Detalle (opcional)"
        name="detail"
        placeholder={isTransfer ? "Ej: Compra de dólares" : "Ej: Feria del domingo"}
        defaultValue={movement?.detail ?? undefined}
        errors={state.fieldErrors?.detail}
      />
      <SubmitButton pending={isPending} className="w-full" pendingLabel={movement ? "Guardando..." : "Creando..."}>
        {movement ? "Guardar cambios" : "Crear movimiento"}
      </SubmitButton>
    </form>
  );
}
