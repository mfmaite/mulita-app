import { ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { fieldControlClassName } from "./input";

export function Select({ className, ...props }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select className={cn(fieldControlClassName, "appearance-none pr-10", className)} {...props} />
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-cream-700"
        aria-hidden
      />
    </div>
  );
}
