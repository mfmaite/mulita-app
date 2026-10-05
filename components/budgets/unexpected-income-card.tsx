import { PartyPopper } from "lucide-react";
import { Money } from "@/components/ui/money";
import { Stat } from "@/components/ui/stat";
import { splitUnexpectedIncome } from "@/lib/tips";

export function UnexpectedIncomeCard({ amount }: { amount: number }) {
  const { savings, planned, treat } = splitUnexpectedIncome(amount);

  return (
    <section className="space-y-4 rounded-2xl border border-cream-300 bg-cream-100 px-5 py-4">
      <div className="flex gap-3">
        <PartyPopper className="size-6 shrink-0 text-green-700" aria-hidden />
        <div className="space-y-1">
          <h2 className="text-lg">
            Te entraron <Money cents={amount} currency="UYU" /> de más
          </h2>
          <p className="text-sm text-muted">Ya los sumamos a este mes. La regla de la casa para que no se evaporen:</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <Stat label="Al ahorro" cents={savings} hint="La mitad" />
        <Stat label="A gastos" cents={planned} hint="Un 30%, planeados" />
        <Stat label="A un gusto" cents={treat} hint="El 20% que queda" />
      </div>
      <p className="text-sm text-muted">
        Para repartirlo sin tocar los meses que vienen, marcá &quot;Solo este mes&quot; al editar el ahorro o una categoría.
      </p>
    </section>
  );
}
