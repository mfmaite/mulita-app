import { z } from "zod";
import { moneyField } from "@/lib/money";

const unclear = "Ese monto no se entiende. Probá con algo como 1.500 o 1.500,50.";

export const budgetSchema = z.object({
  amount: moneyField(unclear).refine((cents) => cents >= 0, "El presupuesto no puede ser negativo."),
});

export const exchangeRateSchema = z.object({
  usdToUyu: moneyField(unclear).refine((cents) => cents > 0, "Poné cuántos pesos vale un dólar."),
});

export type BudgetField = keyof z.input<typeof budgetSchema>;
export type ExchangeRateField = keyof z.input<typeof exchangeRateSchema>;
