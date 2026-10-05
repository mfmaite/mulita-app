import { z } from "zod";
import { accountTypes, currencies } from "@/lib/db/schema";
import { moneyField } from "@/lib/money";

export const accountSchema = z.object({
  name: z.string().trim().min(1, "Ponele un nombre.").max(40, "Ese nombre es muy largo. Probá con uno más corto."),
  type: z.enum(accountTypes, "Elegí el tipo de cuenta."),
  currency: z.enum(currencies, "Elegí la moneda."),
  initialBalance: moneyField("Ese monto no se entiende. Probá con algo como 1.500 o 1.500,50."),
});

export type AccountField = keyof z.input<typeof accountSchema>;
