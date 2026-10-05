import { z } from "zod";
import { categoryKinds } from "@/lib/db/schema";

export const categorySchema = z.object({
  kind: z.enum(categoryKinds, "Elegí si es un gasto o un ingreso."),
  name: z.string().trim().min(1, "Ponele un nombre.").max(40, "Ese nombre es muy largo. Probá con uno más corto."),
  description: z
    .string()
    .trim()
    .max(160, "La descripción es muy larga. Con una frase alcanza.")
    .transform((value) => value || null),
});

export type CategoryField = keyof z.input<typeof categorySchema>;
