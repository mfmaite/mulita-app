import { z } from "zod";
import { movementTypes } from "@/lib/db/schema";
import { moneyField } from "@/lib/money";

export const movementSchema = z.object({
  type: z.enum(movementTypes, "Elegí si es un gasto o un ingreso."),
  amount: moneyField("Ese monto no se entiende. Probá con algo como 1.500 o 1.500,50.").refine(
    (cents) => cents > 0,
    "El monto tiene que ser mayor a cero.",
  ),
  accountId: z.uuid("Elegí una cuenta."),
  categoryId: z.uuid("Elegí una categoría."),
  date: z.iso.date("Poné una fecha válida."),
  detail: z
    .string()
    .trim()
    .max(80, "El detalle es muy largo. Con unas palabras alcanza.")
    .transform((value) => value || null),
});

export type MovementField = keyof z.input<typeof movementSchema>;
export type MovementData = z.output<typeof movementSchema>;
