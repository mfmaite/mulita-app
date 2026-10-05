import type { ReactNode } from "react";
import { Logo } from "@/components/brand/logo";
import { requireSession } from "@/lib/auth/session";

export default async function OnboardingLayout({ children }: { children: ReactNode }) {
  await requireSession();

  return (
    <main className="mx-auto w-full max-w-2xl space-y-8 px-4 pt-8 sm:px-8 sm:py-12">
      <div className="flex items-center gap-3">
        <Logo size={44} priority />
        <span className="font-display text-2xl font-bold text-primary">Mulita</span>
      </div>
      {children}
    </main>
  );
}
