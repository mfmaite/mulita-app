import { z } from "zod";
import { moneyField } from "@/lib/money";

const amount = moneyField("Ese monto no se entiende. Probá con algo como 1.500 o 1.500,50.").refine(
  (cents) => cents >= 0,
  "No puede ser negativo.",
);

export const planSchema = z.object({ expectedIncome: amount, savingsTarget: amount });

export const planFields = ["expectedIncome", "savingsTarget"] as const;

export type PlanField = (typeof planFields)[number];
