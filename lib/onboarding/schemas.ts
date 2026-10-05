import { z } from "zod";
import { moneyField } from "@/lib/money";

const unclear = "Ese monto no se entiende. Probá con algo como 1.500 o 1.500,50.";
const amount = moneyField(unclear).refine((cents) => cents >= 0, "No puede ser negativo.");

export const onboardingSchema = z.object({
  expectedIncome: moneyField(unclear).refine((cents) => cents > 0, "Contanos cuánto ganás por mes."),
  savingsTarget: amount,
  budgets: z
    .string()
    .transform((value, context) => {
      try {
        return JSON.parse(value) as unknown;
      } catch {
        context.addIssue({ code: "custom", message: "Revisá los montos de las categorías." });
        return z.NEVER;
      }
    })
    .pipe(z.record(z.uuid(), z.union([z.literal("").transform(() => 0), amount]), "Revisá los montos de las categorías.")),
});

export const onboardingFields = ["expectedIncome", "savingsTarget", "budgets"] as const;

export type OnboardingField = (typeof onboardingFields)[number];
