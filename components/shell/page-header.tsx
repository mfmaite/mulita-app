import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
      <div className="space-y-0.5 sm:space-y-1">
        <h1 className="text-2xl text-primary sm:text-3xl">{title}</h1>
        {description && <p className="text-sm text-muted sm:text-base">{description}</p>}
      </div>
      {children}
    </header>
  );
}
