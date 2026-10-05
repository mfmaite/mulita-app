import { z } from "zod";
import { moneyField } from "@/lib/money";

const amount = moneyField("Ese monto no se entiende. Probá con algo como 1.500 o 1.500,50.").refine(
  (cents) => cents >= 0,
  "No puede ser negativo.",
);

export const onlyThisMonthField = z.string().transform((value) => value === "on");

export const planSchema = z.object({ expectedIncome: amount, savingsTarget: amount, onlyThisMonth: onlyThisMonthField });

export const planFields = ["expectedIncome", "savingsTarget", "onlyThisMonth"] as const;

export type PlanField = (typeof planFields)[number];
