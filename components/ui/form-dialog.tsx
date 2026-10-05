"use client";

import { Pencil, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "./button";
import { Dialog } from "./dialog";
import { useDialog } from "./use-dialog";

type FormDialogProps = {
  title: string;
  trigger: { kind: "create"; label: string } | { kind: "edit"; label: string };
  children: (close: () => void) => ReactNode;
};

export function FormDialog({ title, trigger, children }: FormDialogProps) {
  const { ref, isOpen, open, close, onClose } = useDialog();

  return (
    <>
      {trigger.kind === "create" ? (
        <Button onClick={open} className="self-start sm:self-auto">
          <Plus className="size-5" aria-hidden />
          {trigger.label}
        </Button>
      ) : (
        <button
          onClick={open}
          aria-label={trigger.label}
          className="rounded-full p-2 text-green-800 hover:bg-cream-100"
        >
          <Pencil className="size-4" aria-hidden />
        </button>
      )}
      <Dialog ref={ref} title={title} onClose={onClose}>
        {isOpen && <div className="space-y-3">{children(close)}</div>}
      </Dialog>
    </>
  );
}
