"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { z } from "zod";
import { invalidForm, type FormState } from "@/lib/forms";
import { auth } from ".";
import { authErrorMessage } from "./errors";
import { signInSchema, signUpSchema, type CredentialsField } from "./schemas";

type CredentialsState = FormState<CredentialsField>;

async function submitCredentials<Data>(
  schema: z.ZodType<Data>,
  formData: FormData,
  submit: (body: Data) => Promise<unknown>,
): Promise<CredentialsState> {
  const values = { name: formData.get("name")?.toString(), email: formData.get("email")?.toString() };
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalidForm(parsed.error, values);

  try {
    await submit(parsed.data);
  } catch (error) {
    return { values, message: authErrorMessage(error) };
  }

  redirect("/");
}

export async function signUp(_: CredentialsState, formData: FormData) {
  return submitCredentials(signUpSchema, formData, async (body) =>
    auth.api.signUpEmail({ body, headers: await headers() }),
  );
}

export async function signIn(_: CredentialsState, formData: FormData) {
  return submitCredentials(signInSchema, formData, async (body) =>
    auth.api.signInEmail({ body, headers: await headers() }),
  );
}

export async function signInWithGoogle() {
  const { url } = await auth.api.signInSocial({
    body: { provider: "google", callbackURL: "/" },
    headers: await headers(),
  });
  if (url) redirect(url);
}

export async function signOut() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/ingresar");
}
