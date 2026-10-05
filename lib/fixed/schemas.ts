import { z } from "zod";
import { currencies, frequencies } from "@/lib/db/schema";
import { moneyField } from "@/lib/money";
import { monthField, sourceField } from "@/lib/movements/schemas";

const common = {
  name: z.string().trim().min(1, "Ponele un nombre.").max(40, "Ese nombre es muy largo. Probá con uno más corto."),
  amount: moneyField("Ese monto no se entiende. Probá con algo como 1.500 o 1.500,50.").refine(
    (cents) => cents > 0,
    "El monto tiene que ser mayor a cero.",
  ),
  variableAmount: z.string().transform((value) => value === "on"),
  dueDay: z.coerce
    .number("Poné un día entre 1 y 31.")
    .int("Poné un día entre 1 y 31.")
    .min(1, "Poné un día entre 1 y 31.")
    .max(31, "Poné un día entre 1 y 31."),
  frequency: z.enum(frequencies, "Elegí cada cuánto se paga."),
  startMonth: monthField,
  note: z
    .string()
    .trim()
    .max(160, "La nota es muy larga. Con una frase alcanza.")
    .transform((value) => value || null),
};

export const fixedSchema = z
  .discriminatedUnion(
    "kind",
    [
      z.object({
        ...common,
        kind: z.literal("expense"),
        source: sourceField,
        categoryId: z.uuid("Elegí una categoría."),
        currency: z.union([z.literal("").transform(() => null), z.enum(currencies, "Elegí la moneda.")]),
      }),
      z.object({
        ...common,
        kind: z.literal("card_payment"),
        accountId: z.uuid("Elegí desde qué cuenta lo pagás."),
        cardId: z.uuid("Elegí la tarjeta."),
      }),
      z.object({
        ...common,
        kind: z.literal("savings"),
        accountId: z.uuid("Elegí desde qué cuenta ahorrás."),
        destinationAccountId: z.uuid("Elegí la cuenta de ahorro."),
      }),
    ],
    "Elegí qué tipo de fijo es.",
  )
  .superRefine((data, context) => {
    if (data.kind === "expense" && data.source.kind === "card" && !data.currency) {
      context.addIssue({ code: "custom", path: ["currency"], message: "Elegí la moneda." });
    }
    if (data.kind === "savings" && data.accountId === data.destinationAccountId) {
      context.addIssue({ code: "custom", path: ["destinationAccountId"], message: "Elegí una cuenta distinta a la de origen." });
    }
  });

export const fixedFields = [
  "kind",
  "name",
  "amount",
  "variableAmount",
  "dueDay",
  "frequency",
  "startMonth",
  "note",
  "source",
  "categoryId",
  "currency",
  "accountId",
  "cardId",
  "destinationAccountId",
] as const;

export type FixedField = (typeof fixedFields)[number];
export type FixedData = z.output<typeof fixedSchema>;
