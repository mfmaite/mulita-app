import { Money } from "@/components/ui/money";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { GoalWithProgress } from "@/lib/goals/queries";
import { formatMonth } from "@/lib/month";
import { GoalDialog } from "./goal-dialog";

function estimateLabel({ monthsLeft, estimatedMonth }: GoalWithProgress) {
  if (monthsLeft === 0) return "¡Meta cumplida!";
  if (monthsLeft === null || !estimatedMonth) return "Definí tu ahorro mensual para saber cuándo llegás.";
  const when = monthsLeft === 1 ? "el mes que viene" : `en ${monthsLeft} meses`;
  return `Llegás en ${formatMonth(estimatedMonth).toLowerCase()} (${when}).`;
}

export function GoalCard({ goal }: { goal: GoalWithProgress }) {
  const isDone = goal.monthsLeft === 0;

  return (
    <li className="space-y-3 rounded-2xl border border-border bg-surface py-3 pr-2 pl-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="leading-snug font-semibold">{goal.name}</p>
          <p className="text-sm text-muted">{goal.share}% de tu ahorro</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <span className="text-sm text-muted tabular-nums">{Math.round(goal.percent)}%</span>
          <GoalDialog goal={goal} />
        </div>
      </div>
      <div className="space-y-2 pr-2">
        <ProgressBar percent={goal.percent} level="ok" />
        <p className="text-sm text-muted">
          <Money cents={goal.saved} currency="UYU" className="font-semibold text-foreground" /> de{" "}
          <Money cents={goal.target} currency="UYU" />
          {!isDone && (
            <>
              {" "}
              · faltan <Money cents={goal.missing} currency="UYU" />
            </>
          )}
        </p>
        {!isDone && goal.monthlyContribution > 0 && (
          <p className="text-sm text-muted">
            Le tocan <Money cents={goal.monthlyContribution} currency="UYU" /> por mes.
          </p>
        )}
        <p className={isDone ? "text-sm font-semibold text-success-strong" : "text-sm font-medium"}>{estimateLabel(goal)}</p>
        {goal.note && <p className="text-sm text-muted italic">{goal.note}</p>}
      </div>
    </li>
  );
}
