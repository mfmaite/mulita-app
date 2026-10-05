import { SignOutButton } from "@/components/auth/sign-out-button";
import { Logo } from "@/components/brand/logo";
import { requireSession } from "@/lib/auth/session";

export default async function Home() {
  const { user } = await requireSession();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo size={120} priority />
      <div className="space-y-2">
        <h1 className="text-4xl text-primary">¡Hola, {user.name.split(" ")[0]}!</h1>
        <p className="max-w-sm text-muted">Ya estás adentro. Estamos cebando el mate: en breve vas a poder ordenar tus cuentas acá.</p>
      </div>
      <SignOutButton />
    </main>
  );
}
