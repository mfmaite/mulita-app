import type { ReactNode } from "react";
import { Money } from "@/components/ui/money";
import { ProgressBar } from "@/components/ui/progress-bar";

type StatProps = {
  label: string;
  cents: number;
  hint?: ReactNode;
  progress?: number | null;
};

export function Stat({ label, cents, hint, progress }: StatProps) {
  return (
    <div className="space-y-0.5">
      <p className="text-sm text-muted">{label}</p>
      <Money cents={cents} currency="UYU" className="font-display text-lg font-bold sm:text-2xl" />
      {hint && <p className="text-xs text-muted">{hint}</p>}
      {progress !== undefined && progress !== null && <ProgressBar percent={progress} level="ok" className="mt-1.5 h-1.5" />}
    </div>
  );
}
