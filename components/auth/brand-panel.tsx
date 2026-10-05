import { Logo } from "@/components/brand/logo";

export function BrandPanel() {
  return (
    <aside className="hidden flex-col bg-green-700 p-12 text-cream-50 lg:flex">
      <div className="flex flex-1 flex-col justify-center gap-6">
        <div className="w-fit rounded-full bg-cream-100 p-2">
          <Logo size={180} priority />
        </div>
        <div className="space-y-2">
          <p className="font-display text-7xl font-bold leading-none">Mulita</p>
          <h2 className="text-3xl text-cream-100">Tus cuentas claras, y tá.</h2>
        </div>
        <p className="max-w-md text-lg text-green-100">
          Anotá tus gastos, armá tu presupuesto y seguí las cuotas de la tarjeta sin planillas eternas.
        </p>
      </div>
      <p className="text-sm text-green-200">Hecho en Uruguay, con el mate al lado.</p>
    </aside>
  );
}
