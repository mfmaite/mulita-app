import { Logo } from "@/components/brand/logo";

export function Splash() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 z-50 flex animate-splash flex-col items-center justify-center gap-6 bg-green-700 px-8 text-center text-cream-50 motion-reduce:hidden lg:hidden"
    >
      <div className="rounded-full bg-cream-100 p-2">
        <Logo size={140} priority />
      </div>
      <div className="space-y-2">
        <p className="font-display text-6xl font-bold leading-none">Mulita</p>
        <p className="font-display text-2xl text-cream-100">Tus cuentas claras, y tá.</p>
      </div>
    </div>
  );
}
