import { z } from "zod";
import { moneyField } from "@/lib/money";

const unclear = "Ese monto no se entiende. Probá con algo como 1.500 o 1.500,50.";

export const goalSchema = z.object({
  name: z.string().trim().min(1, "Ponele un nombre.").max(40, "Ese nombre es muy largo. Probá con uno más corto."),
  target: moneyField(unclear).refine((cents) => cents > 0, "¿Cuánto querés juntar?"),
  share: z.coerce
    .number("Poné un porcentaje entre 0 y 100.")
    .int("Poné un porcentaje sin decimales.")
    .min(0, "Poné un porcentaje entre 0 y 100.")
    .max(100, "Poné un porcentaje entre 0 y 100."),
  note: z
    .string()
    .trim()
    .max(160, "La nota es muy larga. Con una frase alcanza.")
    .transform((value) => value || null),
});

export const savingsPlanSchema = z.object({
  monthlySavingsPlan: moneyField(unclear).refine((cents) => cents >= 0, "No puede ser negativo."),
});

export type GoalField = keyof z.input<typeof goalSchema>;
export type SavingsPlanField = keyof z.input<typeof savingsPlanSchema>;
