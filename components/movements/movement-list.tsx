import { formatDay } from "@/lib/dates";
import type { MonthMovement, MovementFormData } from "@/lib/movements/queries";
import { MovementRow } from "./movement-row";

type MovementListProps = {
  movements: MonthMovement[];
  data: MovementFormData;
};

export function MovementList({ movements, data }: MovementListProps) {
  const days = Object.entries(Object.groupBy(movements, (movement) => movement.date));

  return (
    <div className="space-y-5">
      {days.map(([date, dayMovements = []]) => (
        <section key={date} className="space-y-2">
          <h2 className="font-sans text-sm font-semibold text-muted">{formatDay(date)}</h2>
          <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">
            {dayMovements.map((movement) => (
              <MovementRow key={movement.id} movement={movement} data={data} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
