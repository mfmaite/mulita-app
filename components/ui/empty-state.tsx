import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: ReactNode;
};

export function EmptyState({ icon: Icon, title, description, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-cream-300 bg-surface px-6 py-10 text-center sm:py-14">
      <span className="rounded-full bg-cream-100 p-3 text-green-700 sm:p-4">
        <Icon className="size-6 sm:size-8" aria-hidden />
      </span>
      <h2 className="text-lg sm:text-xl">{title}</h2>
      <p className="max-w-sm text-sm text-muted sm:text-base">{description}</p>
      {children}
    </div>
  );
}
