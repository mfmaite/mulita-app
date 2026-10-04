import type { Metadata } from "next";
import { ColorScale } from "@/components/design-system/color-scale";
import { SemanticColor } from "@/components/design-system/semantic-color";
import { TypeSample } from "@/components/design-system/type-sample";

export const metadata: Metadata = {
  title: "Design system",
};

const scales = [
  { name: "green", label: "Verde bosque", brandStep: 700, brandHex: "#234B40" },
  { name: "cream", label: "Crema", brandStep: 100, brandHex: "#F4EBD8" },
] as const;

const semantics = [
  { name: "success", label: "Éxito", example: "Tá, quedó registrado." },
  { name: "warning", label: "Alerta", example: "Ojo, ya usaste el 96% del presupuesto." },
  { name: "danger", label: "Error", example: "Se nos cortó la luz como en un apagón de UTE. Probá de nuevo." },
  { name: "info", label: "Info", example: "Tip: el gasto libre no se elimina, se presupuesta." },
];

const typeSamples = [
  { label: "Display · Baloo 2", className: "font-display text-5xl font-bold text-primary", text: "Mulita" },
  { label: "Título 1", className: "font-display text-3xl font-bold", text: "Tus cuentas claras, y tá." },
  { label: "Título 2", className: "font-display text-2xl font-bold", text: "Presupuesto de setiembre" },
  { label: "Título 3", className: "font-display text-xl font-bold", text: "Comida casa" },
  { label: "Texto · DM Sans", className: "leading-relaxed", text: "Anotá tus gastos, armá tu presupuesto y mirá cómo vienen las cuotas de la tarjeta." },
  { label: "Texto chico", className: "text-sm text-muted", text: "Supermercado, feria y almacén" },
  { label: "Montos", className: "font-display text-3xl font-bold tabular-nums", text: "$ 125.054 · USD 41,25" },
];

export default function DesignPage() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-12 px-4 py-10 sm:px-8">
      <header className="space-y-1">
        <h1 className="text-4xl text-primary">Design system</h1>
        <p className="text-muted">Colores y tipografía de Mulita.</p>
      </header>

      <section className="space-y-6">
        <h2 className="text-2xl">Colores</h2>
        {scales.map((scale) => (
          <ColorScale key={scale.name} {...scale} />
        ))}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {semantics.map((semantic) => (
            <SemanticColor key={semantic.name} {...semantic} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl">Tipografía</h2>
        <div className="rounded-3xl border border-border bg-surface px-6">
          {typeSamples.map(({ label, className, text }) => (
            <TypeSample key={label} label={label} className={className}>
              {text}
            </TypeSample>
          ))}
        </div>
      </section>
    </main>
  );
}
