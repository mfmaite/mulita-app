import { z } from "zod";

const email = z.email("Ese mail no parece un mail. Revisalo.");

export const signInSchema = z.object({
  email,
  password: z.string().min(1, "La contraseña no puede estar vacía."),
});

export const signUpSchema = z.object({
  name: z.string().trim().min(1, "El nombre no puede estar vacío.").max(50, "Ese nombre es más largo que la rambla. Probá con uno más corto."),
  email,
  password: z
    .string()
    .min(8, "La contraseña tiene que tener al menos 8 caracteres.")
    .max(128, "Esa contraseña es más larga que la rambla. Probá con una más corta."),
});

export type CredentialsField = keyof z.infer<typeof signUpSchema>;
