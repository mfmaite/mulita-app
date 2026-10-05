import { Money } from "@/components/ui/money";
import type { UsageLevel } from "@/lib/budgets/calculations";

type BudgetStatusProps = {
  budget: number;
  spent: number;
  level: UsageLevel;
};

export function BudgetStatus({ budget, spent, level }: BudgetStatusProps) {
  const difference = budget - spent;

  if (level === "none") {
    return spent > 0 ? (
      <span className="text-muted">
        <Money cents={spent} currency="UYU" /> sin presupuesto
      </span>
    ) : (
      <span className="text-muted">Sin presupuesto</span>
    );
  }

  if (level === "over") {
    return (
      <span className="font-semibold text-danger-strong">
        Te pasaste <Money cents={-difference} currency="UYU" />
      </span>
    );
  }

  return (
    <span className={level === "warning" ? "font-semibold text-warning-strong" : "text-success-strong"}>
      {level === "warning" ? "Ojo, te quedan" : "Te quedan"} <Money cents={difference} currency="UYU" />
    </span>
  );
}
