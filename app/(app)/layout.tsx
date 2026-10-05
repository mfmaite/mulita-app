import type { ReactNode } from "react";
import { BottomNav } from "@/components/shell/bottom-nav";
import { Sidebar } from "@/components/shell/sidebar";
import { requireSession } from "@/lib/auth/session";
import { getMovementFormData } from "@/lib/movements/queries";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const [{ user }, movementFormData] = await Promise.all([requireSession(), getMovementFormData()]);

  return (
    <div className="flex-1 lg:grid lg:grid-cols-[16rem_1fr]">
      <Sidebar userName={user.name} movementFormData={movementFormData} />
      <main className="px-4 pt-6 pb-28 sm:px-8 sm:pt-8 lg:py-10">
        <div className="mx-auto max-w-5xl space-y-6 sm:space-y-8">{children}</div>
      </main>
      <BottomNav movementFormData={movementFormData} />
    </div>
  );
}
