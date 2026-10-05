import { Pencil, Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "./button";

type TriggerProps = {
  label: string;
  onClick: () => void;
  className?: string;
};

export function CreateTrigger({ label, onClick, className }: TriggerProps) {
  return (
    <Button onClick={onClick} className={cn("self-start sm:self-auto", className)}>
      <Plus className="size-5" aria-hidden />
      {label}
    </Button>
  );
}

export function EditTrigger({ label, onClick }: TriggerProps) {
  return (
    <button onClick={onClick} aria-label={label} className="rounded-full p-2 text-green-800 hover:bg-cream-100">
      <Pencil className="size-4" aria-hidden />
    </button>
  );
}
