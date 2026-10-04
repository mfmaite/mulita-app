type TypeSampleProps = {
  label: string;
  className: string;
  children: React.ReactNode;
};

export function TypeSample({ label, className, children }: TypeSampleProps) {
  return (
    <div className="grid gap-1 border-b border-border py-4 last:border-0 sm:grid-cols-[10rem_1fr] sm:items-baseline">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</span>
      <p className={className}>{children}</p>
    </div>
  );
}
