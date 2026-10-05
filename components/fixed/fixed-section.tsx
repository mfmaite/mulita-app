import type { ReactNode } from "react";

type FixedSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function FixedSection({ title, description, children }: FixedSectionProps) {
  return (
    <section className="space-y-2">
      <div>
        <h2 className="text-lg">{title}</h2>
        {description && <p className="text-sm text-muted">{description}</p>}
      </div>
      <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">{children}</ul>
    </section>
  );
}
