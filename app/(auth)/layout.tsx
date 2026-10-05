import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { BrandPanel } from "@/components/auth/brand-panel";
import { Splash } from "@/components/auth/splash";
import { Logo } from "@/components/brand/logo";
import { getSession } from "@/lib/auth/session";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  if (await getSession()) redirect("/");

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <Splash />
      <BrandPanel />
      <main className="flex flex-col items-center justify-center gap-8 px-4 py-10">
        <div className="lg:hidden">
          <Logo size={88} priority />
        </div>
        {children}
      </main>
    </div>
  );
}
