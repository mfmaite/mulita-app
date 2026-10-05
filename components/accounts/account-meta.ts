import { Banknote, Landmark, PiggyBank } from "lucide-react";
import type { AccountType, Currency } from "@/lib/db/schema";

export const accountTypeMeta: Record<AccountType, { label: string; icon: typeof Landmark }> = {
  checking: { label: "Débito", icon: Landmark },
  savings: { label: "Ahorro", icon: PiggyBank },
  cash: { label: "Efectivo", icon: Banknote },
};

export const currencyLabels: Record<Currency, string> = {
  UYU: "Pesos",
  USD: "Dólares",
};
