"use client";

import { Pause, Play } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { setFixedActive } from "@/lib/fixed/actions";

type PauseFixedButtonProps = {
  id: string;
  active: boolean;
  onDone: () => void;
};

export function PauseFixedButton({ id, active, onDone }: PauseFixedButtonProps) {
  const [isPending, startTransition] = useTransition();

  const toggle = () =>
    startTransition(async () => {
      toast.success(await setFixedActive(id, !active));
      onDone();
    });

  return (
    <Button variant="secondary" className="w-full" disabled={isPending} onClick={toggle}>
      {active ? <Pause className="size-5" aria-hidden /> : <Play className="size-5" aria-hidden />}
      {active ? "Pausar" : "Reactivar"}
    </Button>
  );
}
