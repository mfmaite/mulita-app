import type { UsageLevel } from "@/lib/budgets/calculations";
import { cn } from "@/lib/cn";

const levelColors: Record<UsageLevel, string> = {
  none: "bg-cream-300",
  ok: "bg-success",
  warning: "bg-warning",
  over: "bg-danger",
};

type ProgressBarProps = {
  percent: number | null;
  level: UsageLevel;
  className?: string;
};

export function ProgressBar({ percent, level, className }: ProgressBarProps) {
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent === null ? undefined : Math.round(percent)}
      className={cn("h-2.5 overflow-hidden rounded-full bg-cream-100", className)}
    >
      <div className={cn("h-full rounded-full", levelColors[level])} style={{ width: `${Math.min(percent ?? 0, 100)}%` }} />
    </div>
  );
}
