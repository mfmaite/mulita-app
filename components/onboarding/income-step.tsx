import { AmountField } from "@/components/ui/amount-field";
import { StepHeader } from "./step-header";

type IncomeStepProps = {
  value: string;
  onChange: (value: string) => void;
};

export function IncomeStep({ value, onChange }: IncomeStepProps) {
  return (
    <div className="space-y-4">
      <StepHeader
        title="¿Cuánto ganás por mes?"
        description="Lo que te entra limpio: sueldo, facturas fijas, lo que cobrás sí o sí. Si algún mes entra más, Mulita se da cuenta sola."
      />
      <AmountField
        label="Ingreso mensual ($)"
        currency="UYU"
        placeholder="0"
        autoFocus
        value={value}
        onValueChange={onChange}
        className="font-display text-2xl font-bold"
      />
    </div>
  );
}
