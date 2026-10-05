import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export const fieldControlClassName =
  "w-full rounded-xl border border-cream-300 bg-cream-50 px-4 py-2.5 text-foreground placeholder:text-cream-600 focus:border-green-600 focus:ring-2 focus:ring-green-200 focus:outline-none aria-invalid:border-danger aria-invalid:focus:ring-danger-soft";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(fieldControlClassName, className)} {...props} />;
}
