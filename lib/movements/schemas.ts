import { z } from "zod";
import { currencies } from "@/lib/db/schema";
import { moneyField } from "@/lib/money";

const amount = moneyField("Ese monto no se entiende. Probá con algo como 1.500 o 1.500,50.").refine(
  (cents) => cents > 0,
  "El monto tiene que ser mayor a cero.",
);

const source = z
  .string()
  .regex(/^(account|card):[0-9a-f-]{36}$/i, "Elegí de dónde sale la plata.")
  .transform((value) => {
    const [kind, id] = value.split(":");
    return { kind: kind as "account" | "card", id };
  });

const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Elegí un mes.");
const empty = <Value>(fallback: Value) => z.literal("").transform(() => fallback);

const common = {
  amount,
  source,
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
  currency: z.union([empty(null), z.enum(currencies, "Elegí la moneda.")]),
  installments: z.union([
    empty(1),
    z.coerce.number().int("Poné un número de cuotas.").min(1, "Al menos 1 cuota.").max(48, "Hasta 48 cuotas."),
  ]),
  firstBillingMonth: z.union([empty(null), month]),
});

const transferSchema = z.object({
  ...common,
  type: z.literal("transfer"),
  destinationAccountId: z.uuid("Elegí a qué cuenta va la plata."),
  destinationAmount: z.union([empty(null), amount]),
});

export const movementSchema = z
  .discriminatedUnion("type", [entrySchema, transferSchema], "Elegí qué tipo de movimiento es.")
  .superRefine((data, context) => {
    const issue = (path: string, message: string) => context.addIssue({ code: "custom", path: [path], message });

    if (data.source.kind === "card" && data.type !== "expense") {
      issue("source", data.type === "income" ? "Los ingresos van a una cuenta." : "Las transferencias salen de una cuenta.");
    }
    if (data.type === "transfer" && data.destinationAccountId === data.source.id) {
      issue("destinationAccountId", "Elegí una cuenta distinta a la de origen.");
    }
    if (data.type === "expense" && data.source.kind === "card") {
      if (!data.currency) issue("currency", "Elegí la moneda.");
      if (!data.firstBillingMonth) issue("firstBillingMonth", "Elegí en qué mes se cobra la primera cuota.");
      else if (data.firstBillingMonth < data.date.slice(0, 7)) {
        issue("firstBillingMonth", "La primera cuota no puede cobrarse antes de la compra.");
      }
    }
  });

export const movementFields = [
  "type",
  "amount",
  "source",
  "categoryId",
  "currency",
  "installments",
  "firstBillingMonth",
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
