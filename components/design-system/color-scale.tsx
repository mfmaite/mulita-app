const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

type ColorScaleProps = {
  name: string;
  label: string;
  brandStep: (typeof steps)[number];
  brandHex: string;
};

export function ColorScale({ name, label, brandStep, brandHex }: ColorScaleProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg">{label}</h3>
        <span className="text-sm text-muted">
          {brandHex} del logo = {name}-{brandStep}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-11">
        {steps.map((step) => (
          <div
            key={step}
            className={`flex h-20 flex-col justify-end rounded-xl border border-black/5 p-2 text-xs font-semibold ${step === brandStep ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}
            style={{
              background: `var(--color-${name}-${step})`,
              color: `var(--color-${name}-${step <= 400 ? 950 : 50})`,
            }}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}
