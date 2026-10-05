import { AmountField } from "@/components/ui/amount-field";
import type { OnboardingData } from "@/lib/onboarding/queries";
import { formatMoney } from "@/lib/money";
import { StepHeader } from "./step-header";

type BudgetsStepProps = {
  categories: OnboardingData["categories"];
  values: Record<string, string>;
  onChange: (categoryId: string, value: string) => void;
};

export function BudgetsStep({ categories, values, onChange }: BudgetsStepProps) {
  return (
    <div className="space-y-4">
      <StepHeader
        title="Repartí lo que queda"
        description="Ponele un tope a cada categoría. Si no sabés por dónde arrancar, empezá por los fijos y ajustás sobre la marcha."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map((category) => (
          <AmountField
            key={category.id}
            label={category.name}
            currency="UYU"
            placeholder="0"
            value={values[category.id] ?? ""}
            onValueChange={(value) => onChange(category.id, value)}
            hint={category.fixed > 0 ? `Tus fijos de este mes suman ${formatMoney(category.fixed, "UYU")}.` : undefined}
          />
        ))}
      </div>
    </div>
  );
}
