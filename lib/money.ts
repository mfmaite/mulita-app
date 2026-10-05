import { z } from "zod";
import type { Currency } from "@/lib/db/schema";

const formatters = new Map<string, Intl.NumberFormat>();

type FormatOptions = { signed?: boolean };

function formatterFor(currency: Currency, fractionDigits: number, { signed = false }: FormatOptions) {
  const key = `${currency}-${fractionDigits}-${signed}`;
  if (!formatters.has(key)) {
    formatters.set(
      key,
      new Intl.NumberFormat("es-UY", {
        style: "currency",
        currency,
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
        signDisplay: signed ? "exceptZero" : "auto",
      }),
    );
  }
  return formatters.get(key)!;
}

export function formatMoney(cents: number, currency: Currency, options: FormatOptions = {}) {
  return formatterFor(currency, cents % 100 === 0 ? 0 : 2, options).format(cents / 100);
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

const operatorSymbols: Record<string, "+" | "-" | "*" | "/"> = {
  "+": "+",
  "-": "-",
  "−": "-",
  "*": "*",
  "x": "*",
  "×": "*",
  "/": "/",
  "÷": "/",
};
const operatorPattern = /[+\-−*x×/÷]/;

export function hasOperation(input: string) {
  return operatorPattern.test(input.trim().replace(/^[-−]/, ""));
}

export function evaluateAmount(input: string) {
  if (!hasOperation(input)) return parseMoney(input);

  const tokens = input.replace(/US\$|\$|\s/g, "").match(/[+\-−*x×/÷]|[^+\-−*x×/÷]+/g) ?? [];
  if (tokens[0] && operatorSymbols[tokens[0]] === "-") tokens.splice(0, 2, `-${tokens[1] ?? ""}`);

  const numbers: number[] = [];
  const operations: string[] = [];
  for (const [index, token] of tokens.entries()) {
    if (index % 2 === 1) {
      const operation = operatorSymbols[token];
      if (!operation) return null;
      operations.push(operation);
      continue;
    }
    const cents = parseMoney(token);
    if (cents === null) return null;
    numbers.push(cents / 100);
  }
  if (numbers.length !== operations.length + 1) return null;

  const terms = [numbers[0]];
  const signs: string[] = [];
  for (const [index, operation] of operations.entries()) {
    const next = numbers[index + 1];
    if (operation === "*") terms[terms.length - 1] *= next;
    else if (operation === "/") {
      if (next === 0) return null;
      terms[terms.length - 1] /= next;
    } else {
      signs.push(operation);
      terms.push(next);
    }
  }

  const total = terms.reduce((sum, term, index) => (index === 0 ? term : signs[index - 1] === "+" ? sum + term : sum - term), 0);
  return Math.round(total * 100);
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
      const cents = evaluateAmount(value || "0");
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
