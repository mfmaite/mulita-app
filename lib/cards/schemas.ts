import { z } from "zod";
import { moneyField } from "@/lib/money";

const closingDay = z.coerce.number("Poné un día entre 1 y 31.").int("Poné un día entre 1 y 31.").min(1, "Poné un día entre 1 y 31.").max(31, "Poné un día entre 1 y 31.");

export const cardSchema = z.object({
  name: z.string().trim().min(1, "Ponele un nombre.").max(40, "Ese nombre es muy largo. Probá con uno más corto."),
  closingDay,
});

export const closingOverrideSchema = z.object({
  month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Elegí un mes."),
  closingDay,
});

export type CardField = keyof z.input<typeof cardSchema>;
export type ClosingOverrideField = keyof z.input<typeof closingOverrideSchema>;

export const cardPaymentSchema = z.object({
  amount: moneyField("Ese monto no se entiende. Probá con algo como 1.500 o 1.500,50.").refine(
    (cents) => cents > 0,
    "El monto tiene que ser mayor a cero.",
  ),
  accountId: z.uuid("Elegí desde qué cuenta pagás."),
  date: z.iso.date("Poné una fecha válida."),
});

export type CardPaymentField = keyof z.input<typeof cardPaymentSchema>;
