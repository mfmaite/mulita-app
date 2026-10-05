import type { ReactNode } from "react";
import { Money } from "@/components/ui/money";

type StatProps = {
  label: string;
  cents: number;
  hint?: ReactNode;
};

export function Stat({ label, cents, hint }: StatProps) {
  return (
    <div className="space-y-0.5">
      <p className="text-sm text-muted">{label}</p>
      <Money cents={cents} currency="UYU" className="font-display text-xl font-bold sm:text-2xl" />
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}
