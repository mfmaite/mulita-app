"use client";

import { useActionState } from "react";
import { Alert } from "@/components/ui/alert";
import { SubmitButton } from "@/components/ui/submit-button";
import { TextField } from "@/components/ui/text-field";
import { signIn, signUp } from "@/lib/auth/actions";

export type AuthMode = "sign-in" | "sign-up";

const actions = { "sign-in": signIn, "sign-up": signUp };

export function CredentialsForm({ mode }: { mode: AuthMode }) {
  const [state, action] = useActionState(actions[mode], {});
  const isSignUp = mode === "sign-up";

  return (
    <form action={action} noValidate className="space-y-4">
      {state.message && <Alert tone="danger">{state.message}</Alert>}
      {isSignUp && (
        <TextField
          label="Nombre"
          name="name"
          autoComplete="given-name"
          placeholder="Tu nombre"
          defaultValue={state.values?.name}
          errors={state.fieldErrors?.name}
        />
      )}
      <TextField
        label="Mail"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="vos@ejemplo.com"
        defaultValue={state.values?.email}
        errors={state.fieldErrors?.email}
      />
      <TextField
        label="Contraseña"
        name="password"
        type="password"
        autoComplete={isSignUp ? "new-password" : "current-password"}
        placeholder={isSignUp ? "Al menos 8 caracteres" : undefined}
        errors={state.fieldErrors?.password}
      />
      <SubmitButton className="w-full" pendingLabel={isSignUp ? "Creando tu cuenta..." : "Entrando..."}>
        {isSignUp ? "Crear cuenta" : "Ingresar"}
      </SubmitButton>
    </form>
  );
}
