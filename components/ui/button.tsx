import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const variants = {
  primary: "bg-primary text-on-primary hover:bg-primary-hover",
  secondary: "bg-cream-200 text-green-800 hover:bg-cream-300",
  outline: "border border-cream-300 bg-surface text-foreground hover:bg-cream-100",
  ghost: "text-green-800 hover:bg-cream-100",
};

export type ButtonProps = ComponentProps<"button"> & {
  variant?: keyof typeof variants;
};

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
