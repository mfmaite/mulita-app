import { cn } from "@/lib/cn";

type StepProgressProps = {
  step: number;
  total: number;
};

export function StepProgress({ step, total }: StepProgressProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-muted">
        Paso {step + 1} de {total}
      </p>
      <div className="flex gap-2" aria-hidden>
        {Array.from({ length: total }, (_, index) => (
          <span key={index} className={cn("h-1.5 flex-1 rounded-full", index <= step ? "bg-green-700" : "bg-cream-200")} />
        ))}
      </div>
    </div>
  );
}
