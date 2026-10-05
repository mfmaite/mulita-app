"use client";

import { X } from "lucide-react";
import type { ReactNode, Ref } from "react";

type DialogProps = {
  ref: Ref<HTMLDialogElement>;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function Dialog({ ref, title, onClose, children }: DialogProps) {
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className="m-auto w-full max-w-md rounded-3xl bg-surface text-foreground shadow-2xl backdrop:bg-green-950/40 max-sm:mx-0 max-sm:mt-auto max-sm:mb-0 max-sm:max-w-none max-sm:rounded-b-none"
    >
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
        <h2 className="text-xl">{title}</h2>
        <form method="dialog">
          <button aria-label="Cerrar" className="rounded-full p-1.5 text-green-800 hover:bg-cream-100">
            <X className="size-5" aria-hidden />
          </button>
        </form>
      </div>
      <div className="p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">{children}</div>
    </dialog>
  );
}
