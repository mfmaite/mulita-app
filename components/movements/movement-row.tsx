import { Money } from "@/components/ui/money";
import { cn } from "@/lib/cn";
import { signedAmount } from "@/lib/movements/balance";
import type { MonthMovement, MovementFormData } from "@/lib/movements/queries";
import { EditMovementButton } from "./edit-movement-button";

type MovementRowProps = {
  movement: MonthMovement;
  data: MovementFormData;
};

export function MovementRow({ movement, data }: MovementRowProps) {
  const title = movement.detail ?? movement.categoryName ?? "Sin categoría";
  const subtitle = [movement.detail && movement.categoryName, movement.accountName].filter(Boolean).join(" · ");

  return (
    <li className="flex items-center gap-3 py-2.5 pr-2 pl-4">
      <div className="min-w-0 flex-1">
        <p className="leading-snug font-semibold">{title}</p>
        <p className="text-sm text-muted">{subtitle}</p>
      </div>
      <Money
        cents={signedAmount(movement.type, movement.amount)}
        currency={movement.currency}
        signed
        className={cn("shrink-0 font-semibold", movement.type === "income" ? "text-success-strong" : "text-foreground")}
      />
      <EditMovementButton data={data} movement={movement} />
    </li>
  );
}
