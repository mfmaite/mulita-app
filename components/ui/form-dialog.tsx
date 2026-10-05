"use client";

import type { ReactNode } from "react";
import { Dialog } from "./dialog";
import { useDialog } from "./use-dialog";

type FormDialogProps = {
  title: string;
  trigger: (open: () => void) => ReactNode;
  children: (close: () => void) => ReactNode;
};

export function FormDialog({ title, trigger, children }: FormDialogProps) {
  const { ref, isOpen, open, close, onClose } = useDialog();

  return (
    <>
      {trigger(open)}
      <Dialog ref={ref} title={title} onClose={onClose}>
        {isOpen && <div className="space-y-3">{children(close)}</div>}
      </Dialog>
    </>
  );
}
