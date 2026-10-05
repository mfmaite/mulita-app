"use client";

import { useState } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { TextField } from "@/components/ui/text-field";
import { closingDayFor } from "@/lib/cards/closing";
import { installmentAmounts, suggestFirstBillingMonth } from "@/lib/cards/installments";
import type { Currency } from "@/lib/db/schema";
import { formatMoney } from "@/lib/money";
import type { MovementFormData } from "@/lib/movements/queries";

const currencyOptions = [
  { value: "UYU", label: "Pesos" },
  { value: "USD", label: "Dólares" },
];

type CardPurchaseFieldsProps = {
  card: MovementFormData["cards"][number];
  date: string;
  amount: number | null;
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  initialInstallments?: number | null;
  initialFirstMonth?: string;
  fieldErrors?: Partial<Record<"currency" | "installments" | "firstBillingMonth", string[]>>;
};

export function CardPurchaseFields({
  card,
  date,
  amount,
  currency,
  onCurrencyChange,
  initialInstallments,
  initialFirstMonth,
  fieldErrors,
}: CardPurchaseFieldsProps) {
  const [installments, setInstallments] = useState(String(initialInstallments ?? 1));
  const [chosenFirstMonth, setChosenFirstMonth] = useState(initialFirstMonth);

  const closingDay = date ? closingDayFor(card.closingDay, card.overrides, date.slice(0, 7)) : card.closingDay;
  const suggestedFirstMonth = date ? suggestFirstBillingMonth(date, closingDay) : undefined;
  const count = Number(installments);
  const installmentHint =
    amount && Number.isInteger(count) && count > 1
      ? `Son ${count} cuotas de ${formatMoney(installmentAmounts(amount, count)[0], currency)}.`
      : undefined;

  return (
    <>
      <SegmentedControl
        label="Moneda de la compra"
        name="currency"
        options={currencyOptions}
        defaultValue={currency}
        errors={fieldErrors?.currency}
        onValueChange={(value) => onCurrencyChange(value as Currency)}
      />
      <TextField
        label="Cuotas"
        name="installments"
        type="number"
        inputMode="numeric"
        min={1}
        max={48}
        value={installments}
        onChange={(event) => setInstallments(event.target.value)}
        hint={installmentHint}
        errors={fieldErrors?.installments}
      />
      <TextField
        label="Primer mes de cobro"
        name="firstBillingMonth"
        type="month"
        value={chosenFirstMonth ?? suggestedFirstMonth ?? ""}
        onChange={(event) => setChosenFirstMonth(event.target.value)}
        hint={`Sugerido según el cierre: ${card.name} cierra el ${closingDay}.`}
        errors={fieldErrors?.firstBillingMonth}
      />
    </>
  );
}
