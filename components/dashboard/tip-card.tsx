import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Tip } from "@/lib/tips";

const tones = {
  info: "bg-cream-100 text-green-900",
  warning: "bg-warning-soft text-warning-strong",
};

export function TipCard({ tip, className }: { tip: Tip; className?: string }) {
  return (
    <aside className={cn("flex gap-3 rounded-2xl px-4 py-3", tones[tip.tone], className)}>
      <Lightbulb className="mt-0.5 size-5 shrink-0" aria-hidden />
      <div className="space-y-0.5">
        <p className="font-display font-bold">Tip de Mulita</p>
        <p className="text-sm">{tip.text}</p>
      </div>
    </aside>
  );
}
