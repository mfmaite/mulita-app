"use client";

import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "./button";

type ConfirmDeleteButtonProps = {
  label: string;
  question: string;
  onConfirm: () => Promise<string>;
  onDeleted: () => void;
};

export function ConfirmDeleteButton({ label, question, onConfirm, onDeleted }: ConfirmDeleteButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  const confirm = () =>
    startTransition(async () => {
      toast.success(await onConfirm());
      onDeleted();
    });

  if (!isConfirming) {
    return (
      <Button
        variant="ghost"
        className="w-full text-danger-strong hover:bg-danger-soft"
        onClick={() => setIsConfirming(true)}
      >
        <Trash2 className="size-5" aria-hidden />
        {label}
      </Button>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2 rounded-2xl bg-danger-soft p-2 pl-4">
      <span className="text-sm font-medium text-danger-strong">{question}</span>
      <div className="flex gap-1">
        <Button variant="ghost" onClick={() => setIsConfirming(false)}>
          No
        </Button>
        <Button variant="danger" disabled={isPending} onClick={confirm}>
          {isPending ? "Borrando..." : "Sí, borrar"}
        </Button>
      </div>
    </div>
  );
}
