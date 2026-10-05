"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="top-center"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "flex w-full items-center gap-3 rounded-2xl px-4 py-3 font-sans text-sm font-medium shadow-lg",
          success: "bg-success-soft text-success-strong",
          error: "bg-danger-soft text-danger-strong",
          info: "bg-info-soft text-info-strong",
        },
      }}
    />
  );
}
