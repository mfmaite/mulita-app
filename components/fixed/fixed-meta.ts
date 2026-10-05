import type { FixedKind, Frequency } from "@/lib/db/schema";

export const frequencyLabels: Record<Frequency, string> = {
  monthly: "Todos los meses",
  bimonthly: "Cada 2 meses",
  quarterly: "Cada 3 meses",
  yearly: "Una vez al año",
};

export const kindLabels: Record<FixedKind, string> = {
  expense: "Gasto",
  card_payment: "Pago de tarjeta",
  savings: "Ahorro",
};
