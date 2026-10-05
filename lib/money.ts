import { z } from "zod";
import type { Currency } from "@/lib/db/schema";

const formatters = new Map<string, Intl.NumberFormat>();

function formatterFor(currency: Currency, fractionDigits: number) {
  const key = `${currency}-${fractionDigits}`;
  if (!formatters.has(key)) {
    formatters.set(
      key,
      new Intl.NumberFormat("es-UY", {
        style: "currency",
        currency,
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      }),
    );
  }
  return formatters.get(key)!;
}

export function formatMoney(cents: number, currency: Currency) {
  return formatterFor(currency, cents % 100 === 0 ? 0 : 2).format(cents / 100);
}

const thousandsWithDots = /^\d{1,3}(\.\d{3})+$/;

export function parseMoney(input: string) {
  const cleaned = input.replace(/US\$|\$|\s/g, "");
  const isNegative = cleaned.startsWith("-");
  const digits = cleaned.replace(/^-/, "");

  const normalized = digits.includes(",")
    ? digits.replaceAll(".", "").replace(",", ".")
    : thousandsWithDots.test(digits)
      ? digits.replaceAll(".", "")
      : digits;

  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;

  const cents = Math.round(Number(normalized) * 100);
  return isNegative ? -cents : cents;
}

export function centsToInput(cents: number) {
  const fractionDigits = cents % 100 === 0 ? 0 : 2;
  return (cents / 100).toLocaleString("es-UY", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
    useGrouping: false,
  });
}

export const maxMoneyCents = 99_999_999_999;

export function moneyField(message: string) {
  return z
    .string()
    .trim()
    .transform((value, context) => {
      const cents = parseMoney(value || "0");
      if (cents === null) {
        context.addIssue({ code: "custom", message });
        return z.NEVER;
      }
      if (Math.abs(cents) > maxMoneyCents) {
        context.addIssue({ code: "custom", message: "Ese monto es demasiado grande. ¿Te sacaste el 5 de Oro?" });
        return z.NEVER;
      }
      return cents;
    });
}
