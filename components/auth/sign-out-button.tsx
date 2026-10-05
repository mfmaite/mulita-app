import { LogOut } from "lucide-react";
import { SubmitButton } from "@/components/ui/submit-button";
import { signOut } from "@/lib/auth/actions";

export function SignOutButton({ className }: { className?: string }) {
  return (
    <form action={signOut}>
      <SubmitButton variant="ghost" pendingLabel="Saliendo..." className={className}>
        <LogOut className="size-5" aria-hidden />
        Salir
      </SubmitButton>
    </form>
  );
}
