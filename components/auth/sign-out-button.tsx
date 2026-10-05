import { SubmitButton } from "@/components/ui/submit-button";
import { signOut } from "@/lib/auth/actions";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <SubmitButton variant="ghost" pendingLabel="Saliendo...">
        Salir
      </SubmitButton>
    </form>
  );
}
