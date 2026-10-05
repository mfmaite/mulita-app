import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { fieldControlClassName } from "./input";

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea rows={3} className={cn(fieldControlClassName, "resize-none", className)} {...props} />;
}
