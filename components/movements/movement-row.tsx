import { ArrowRight } from "lucide-react";
import { Money } from "@/components/ui/money";
import { cn } from "@/lib/cn";
import { signedAmount } from "@/lib/movements/balance";
import type { MonthMovement, MovementFormData } from "@/lib/movements/queries";
import { EditMovementButton } from "./edit-movement-button";

type MovementRowProps = {
  movement: MonthMovement;
  data: MovementFormData;
};

function describe(movement: MonthMovement) {
  switch (movement.type) {
    case "transfer":
      return {
        title: movement.detail ?? (movement.destinationType === "savings" ? "Ahorro" : "Transferencia"),
        subtitle: `${movement.accountName} → ${movement.destinationAccountName}`,
      };
    case "adjustment":
      return { title: movement.detail ?? "Cuadre de saldo", subtitle: movement.accountName };
    default:
      return {
        title: movement.detail ?? movement.categoryName ?? "Sin categoría",
        subtitle: [movement.detail && movement.categoryName, movement.accountName].filter(Boolean).join(" · "),
      };
  }
}

function TransferAmount({ movement }: { movement: MonthMovement }) {
  const showsDestination =
    movement.destinationCurrency && movement.destinationAmount && movement.destinationCurrency !== movement.currency;

  return (
    <span className="flex shrink-0 flex-col items-end font-semibold">
      <Money cents={movement.amount} currency={movement.currency} />
      {showsDestination && (
        <span className="flex items-center gap-1 text-sm font-medium text-muted">
          <ArrowRight className="size-3.5" aria-hidden />
          <Money cents={movement.destinationAmount!} currency={movement.destinationCurrency!} />
        </span>
      )}
    </span>
  );
}

export function MovementRow({ movement, data }: MovementRowProps) {
  const { title, subtitle } = describe(movement);
  const amount = signedAmount(movement.type, movement.amount);

  return (
    <li className="flex items-center gap-3 py-2.5 pr-2 pl-4">
      <div className="min-w-0 flex-1">
        <p className="leading-snug font-semibold">{title}</p>
        <p className="text-sm text-muted">{subtitle}</p>
      </div>
      {movement.type === "transfer" ? (
        <TransferAmount movement={movement} />
      ) : (
        <Money
          cents={amount}
          currency={movement.currency}
          signed
          className={cn("shrink-0 font-semibold", amount > 0 ? "text-success-strong" : "text-foreground")}
        />
      )}
      <EditMovementButton data={data} movement={movement} />
    </li>
  );
}
