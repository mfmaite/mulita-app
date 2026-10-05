"use client";

import { Calculator } from "lucide-react";
import { useRef, useState, type ComponentProps } from "react";
import { cn } from "@/lib/cn";
import type { Currency } from "@/lib/db/schema";
import { evaluateAmount, formatMoney, hasOperation } from "@/lib/money";
import { Field } from "./field";
import { Input } from "./input";

const operators = ["+", "−", "×", "÷"];

type AmountFieldProps = Omit<ComponentProps<"input">, "value" | "onChange"> & {
  label: string;
  currency: Currency;
  value: string;
  onValueChange: (value: string) => void;
  hint?: string;
  errors?: string[];
};

export function AmountField({ label, currency, value, onValueChange, hint, errors, className, ...props }: AmountFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showOperators, setShowOperators] = useState(false);

  const isOperation = hasOperation(value);
  const result = isOperation ? evaluateAmount(value) : null;
  const operationHint = isOperation ? (result === null ? "Esa cuenta no cierra." : `= ${formatMoney(result, currency)}`) : hint;

  const insert = (operator: string) => {
    const input = inputRef.current;
    const start = input?.selectionStart ?? value.length;
    const end = input?.selectionEnd ?? value.length;
    onValueChange(`${value.slice(0, start)}${operator}${value.slice(end)}`);
    requestAnimationFrame(() => {
      input?.focus();
      input?.setSelectionRange(start + operator.length, start + operator.length);
    });
  };

  return (
    <Field label={label} hint={operationHint} errors={errors}>
      <div className="relative">
        <Input
          ref={inputRef}
          inputMode="decimal"
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          aria-invalid={Boolean(errors?.length)}
          className={cn("pr-12", className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowOperators((shown) => !shown)}
          aria-label="Calculadora"
          aria-pressed={showOperators}
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-2 text-green-800 hover:bg-cream-100 aria-pressed:bg-cream-200"
        >
          <Calculator className="size-5" aria-hidden />
        </button>
      </div>
      {showOperators && (
        <div className="grid grid-cols-4 gap-2">
          {operators.map((operator) => (
            <button
              key={operator}
              type="button"
              onClick={() => insert(operator)}
              className="rounded-xl bg-cream-100 py-2 font-display text-xl font-bold text-green-800 hover:bg-cream-200"
            >
              {operator}
            </button>
          ))}
        </div>
      )}
    </Field>
  );
}
