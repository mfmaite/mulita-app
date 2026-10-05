import Link from "next/link";
import { skipOnboarding } from "@/lib/onboarding/actions";

const className = "text-sm font-semibold text-primary underline-offset-4 hover:underline";

export function LeaveOnboarding({ onboarded }: { onboarded: boolean }) {
  if (onboarded) {
    return (
      <Link href="/presupuesto" className={className}>
        Volver al presupuesto
      </Link>
    );
  }

  return (
    <form action={skipOnboarding}>
      <button className={className}>Lo hago después</button>
    </form>
  );
}
