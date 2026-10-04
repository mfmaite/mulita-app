type SemanticColorProps = {
  name: string;
  label: string;
  example: string;
};

const variants = ["", "-soft", "-strong"];

export function SemanticColor({ name, label, example }: SemanticColorProps) {
  return (
    <div className="space-y-2 rounded-2xl border border-border bg-surface p-4">
      <div className="flex gap-2">
        {variants.map((variant) => (
          <div
            key={variant}
            title={`${name}${variant}`}
            className="h-10 flex-1 rounded-lg"
            style={{ background: `var(--color-${name}${variant})` }}
          />
        ))}
      </div>
      <p className="text-sm font-semibold">{label}</p>
      <p
        className="rounded-lg px-3 py-2 text-sm"
        style={{ background: `var(--color-${name}-soft)`, color: `var(--color-${name}-strong)` }}
      >
        {example}
      </p>
    </div>
  );
}
