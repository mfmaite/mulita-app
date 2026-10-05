import Link from "next/link";
import { Divider } from "@/components/ui/divider";
import { CredentialsForm, type AuthMode } from "./credentials-form";
import { GoogleSignIn } from "./google-sign-in";

const copy = {
  "sign-in": {
    title: "¡Hola de nuevo!",
    subtitle: "Entrá y fijate cómo vienen tus cuentas.",
    switchText: "¿Todavía no tenés cuenta?",
    switchLabel: "Registrate",
    switchHref: "/registro",
  },
  "sign-up": {
    title: "Creá tu cuenta",
    subtitle: "Registrate y empezá a usar Mulita.",
    switchText: "¿Ya tenés cuenta?",
    switchLabel: "Ingresá",
    switchHref: "/ingresar",
  },
};

export function AuthScreen({ mode }: { mode: AuthMode }) {
  const { title, subtitle, switchText, switchLabel, switchHref } = copy[mode];

  return (
    <div className="w-full max-w-sm space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl text-primary">{title}</h1>
        <p className="text-muted">{subtitle}</p>
      </header>
      <GoogleSignIn />
      <Divider label="o con tu mail" />
      <CredentialsForm mode={mode} />
      <p className="text-center text-sm text-muted">
        {switchText}{" "}
        <Link href={switchHref} className="font-semibold text-primary underline-offset-4 hover:underline">
          {switchLabel}
        </Link>
      </p>
    </div>
  );
}
