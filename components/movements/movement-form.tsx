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
import type { MovementType } from "@/lib/db/schema";
import { centsToInput } from "@/lib/money";
import { createMovement, updateMovement } from "@/lib/movements/actions";
import type { MonthMovement, MovementFormData } from "@/lib/movements/queries";

const typeOptions = [
  { value: "expense", label: "Gasto" },
  { value: "income", label: "Ingreso" },
  { value: "transfer", label: "Transferencia" },
];

const currencySymbols = { UYU: "$", USD: "US$" };

type AccountOption = MovementFormData["accounts"][number];

function withArchived<Option extends { id: string; name: string }>(options: Option[], current?: Option | false | null | "") {
  if (!current || options.some((option) => option.id === current.id)) return options;
  return [...options, { ...current, name: `${current.name} (archivada)` }];
}

function accountOptionsFor(data: MovementFormData, movement?: MonthMovement) {
  const source: AccountOption | undefined = movement && {
    id: movement.accountId,
    name: movement.accountName,
    currency: movement.currency,
    type: movement.accountType,
  };
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

type MovementFormProps = {
  data: MovementFormData;
  movement?: MonthMovement;
  onSaved: () => void;
};

export function MovementForm({ data, movement, onSaved }: MovementFormProps) {
  const save = movement ? updateMovement.bind(null, movement.id) : createMovement;
  const [state, onSubmit, isPending] = useFormAction(save, onSaved);

  const isDifferentCurrency = movement?.destinationCurrency && movement.destinationCurrency !== movement.currency;
  const values = {
    type: movement?.type ?? "expense",
    amount: movement ? centsToInput(movement.amount) : undefined,
    accountId: movement?.accountId ?? data.lastAccountId,
    categoryId: movement?.categoryId ?? "",
    destinationAccountId: movement?.destinationAccountId ?? "",
    destinationAmount: isDifferentCurrency && movement.destinationAmount ? centsToInput(movement.destinationAmount) : undefined,
    date: movement?.date ?? today(),
    detail: movement?.detail ?? undefined,
    ...state.values,
  };

  const [type, setType] = useState(values.type as MovementType);
  const [accountId, setAccountId] = useState(values.accountId);
  const [destinationAccountId, setDestinationAccountId] = useState(values.destinationAccountId);
  const [categoryId, setCategoryId] = useState(values.categoryId);

  const changeType = (value: string) => {
    setType(value as MovementType);
    setCategoryId("");
  };

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

  const accounts = accountOptionsFor(data, movement);
  const account = accounts.find(({ id }) => id === accountId);
  const destination = accounts.find(({ id }) => id === destinationAccountId);
  const isTransfer = type === "transfer";
  const categories = withArchived(
    data.categories,
    movement?.categoryId && { id: movement.categoryId, name: movement.categoryName ?? "", kind: movement.type },
  ).filter((category) => category.kind === type);

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <SegmentedControl
        label="Tipo"
        name="type"
        options={typeOptions}
        defaultValue={values.type}
        errors={state.fieldErrors?.type}
        onValueChange={changeType}
      />
      <TextField
        label={`${isTransfer ? "Monto que sale" : "Monto"} (${currencySymbols[account?.currency ?? "UYU"]})`}
        name="amount"
        inputMode="decimal"
        placeholder="0"
        autoFocus={!movement}
        defaultValue={values.amount}
        errors={state.fieldErrors?.amount}
        className="font-display text-2xl font-bold"
      />
      <Field label={isTransfer ? "Desde" : "Cuenta"} errors={state.fieldErrors?.accountId}>
        <Select name="accountId" value={accountId} onChange={(event) => setAccountId(event.target.value)}>
          {accounts.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </Select>
      </Field>
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
              defaultValue={values.destinationAmount}
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
      <TextField label="Fecha" name="date" type="date" defaultValue={values.date} errors={state.fieldErrors?.date} />
      <TextField
        label="Detalle (opcional)"
        name="detail"
        placeholder={isTransfer ? "Ej: Compra de dólares" : "Ej: Feria del domingo"}
        defaultValue={values.detail}
        errors={state.fieldErrors?.detail}
      />
      <SubmitButton pending={isPending} className="w-full" pendingLabel={movement ? "Guardando..." : "Creando..."}>
        {movement ? "Guardar cambios" : "Crear movimiento"}
      </SubmitButton>
    </form>
  );
}
