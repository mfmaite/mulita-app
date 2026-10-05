import { SubmitButton } from "@/components/ui/submit-button";
import { signInWithGoogle } from "@/lib/auth/actions";
import { GoogleIcon } from "./google-icon";

export function GoogleSignIn() {
  return (
    <form action={signInWithGoogle}>
      <SubmitButton variant="outline" className="w-full" pendingLabel="Yendo a Google...">
        <GoogleIcon />
        Seguir con Google
      </SubmitButton>
    </form>
  );
}
