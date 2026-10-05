import { z } from "zod";
import { moneyField } from "@/lib/money";

const amount = moneyField("Ese monto no se entiende. Probá con algo como 1.500 o 1.500,50.").refine(
  (cents) => cents > 0,
  "El monto tiene que ser mayor a cero.",
);

const common = {
  amount,
  accountId: z.uuid("Elegí una cuenta."),
  date: z.iso.date("Poné una fecha válida."),
  detail: z
    .string()
    .trim()
    .max(80, "El detalle es muy largo. Con unas palabras alcanza.")
    .transform((value) => value || null),
};

const entrySchema = z.object({
  ...common,
  type: z.enum(["income", "expense"], "Elegí qué tipo de movimiento es."),
  categoryId: z.uuid("Elegí una categoría."),
});

const transferSchema = z.object({
  ...common,
  type: z.literal("transfer"),
  destinationAccountId: z.uuid("Elegí a qué cuenta va la plata."),
  destinationAmount: z.union([z.literal("").transform(() => null), amount]),
});

export const movementSchema = z
  .discriminatedUnion("type", [entrySchema, transferSchema], "Elegí qué tipo de movimiento es.")
  .refine((data) => data.type !== "transfer" || data.destinationAccountId !== data.accountId, {
    path: ["destinationAccountId"],
    message: "Elegí una cuenta distinta a la de origen.",
  });

export const movementFields = [
  "type",
  "amount",
  "accountId",
  "categoryId",
  "destinationAccountId",
  "destinationAmount",
  "date",
  "detail",
] as const;

export type MovementField = (typeof movementFields)[number];
export type MovementData = z.output<typeof movementSchema>;

export const reconcileSchema = z.object({
  realBalance: moneyField("Ese monto no se entiende. Probá con algo como 1.500 o 1.500,50."),
});

export type ReconcileField = keyof z.input<typeof reconcileSchema>;
