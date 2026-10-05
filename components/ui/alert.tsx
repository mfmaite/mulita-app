import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const tones = {
  success: "bg-success-soft text-success-strong",
  warning: "bg-warning-soft text-warning-strong",
  danger: "bg-danger-soft text-danger-strong",
  info: "bg-info-soft text-info-strong",
};

type AlertProps = {
  tone: keyof typeof tones;
  children: ReactNode;
};

export function Alert({ tone, children }: AlertProps) {
  return (
    <p role={tone === "danger" ? "alert" : "status"} className={cn("rounded-xl px-4 py-3 text-sm", tones[tone])}>
      {children}
    </p>
  );
}
