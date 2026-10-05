import { AmountField } from "@/components/ui/amount-field";
import { formatMoney } from "@/lib/money";
import { StepHeader } from "./step-header";

type SavingsStepProps = {
  value: string;
  onChange: (value: string) => void;
  income: number;
  savings: number | null;
};

export function suggestedSavings(income: number) {
  return Math.round((income * 0.2) / 100) * 100;
}

export function SavingsStep({ value, onChange, income, savings }: SavingsStepProps) {
  const share = savings && income > 0 ? Math.round((savings / income) * 100) : null;

  return (
    <div className="space-y-4">
      <StepHeader
        title="¿Cuánto querés ahorrar por mes?"
        description={`Primero te pagás a vos, después a la UTE. Una buena base es el 20% de lo que ganás: ${formatMoney(suggestedSavings(income), "UYU")}.`}
      />
      <AmountField
        label="Ahorro mensual ($)"
        currency="UYU"
        placeholder="0"
        autoFocus
        value={value}
        onValueChange={onChange}
        hint={share === null ? "Si este mes no da, poné 0 y lo ajustás después." : `Es el ${share}% de lo que ganás.`}
        className="font-display text-2xl font-bold"
      />
    </div>
  );
}
