import { z } from "zod";

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
