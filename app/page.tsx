import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
      <Image src="/mulita.svg" alt="" width={160} height={160} priority unoptimized />
      <div className="space-y-2">
        <h1 className="text-5xl text-primary">Mulita</h1>
        <p className="font-display text-2xl">Tus cuentas claras, y tá.</p>
      </div>
      <p className="max-w-sm text-muted">Estamos cebando el mate. En breve vas a poder ordenar tus cuentas acá.</p>
    </main>
  );
}
