import { formatMoney } from "@/lib/money";

export type TipContext = {
  overBudget: string[];
  unexpectedIncome: number;
  hasBudget: boolean;
};

export type Tip = { tone: "info" | "warning"; text: string };

const everydayTips = [
  "Anotá cada gasto en el momento. Si lo dejás para después, se te escapa como el 121 en hora pico.",
  "Pagar la tarjeta no es un gasto nuevo: ese gasto ya lo contaste en las cuotas.",
  "El gasto libre no se elimina: se presupuesta. Un alfajor a tiempo salva el mes.",
  "Cierre semanal: mirá cuánto te queda de gasto libre, cómo viene la tarjeta y si el ahorro sigue intacto.",
  "Cierre de mes: compará el presupuesto con lo real y ajustá el que viene. Sin culpa, con mate.",
  "Cuadrá el saldo de tus cuentas de vez en cuando: los pesitos perdidos también suman.",
  "Las cuotas también son plata: antes de comprar, mirá cuánto vas a pagar el mes que viene.",
  "Si un gasto inesperado te agarra, usá el colchón y después ajustá el presupuesto o el ahorro del mes.",
];

const toPesos = (cents: number) => Math.round(cents / 100) * 100;

export function splitUnexpectedIncome(amount: number) {
  const savings = toPesos(amount * 0.5);
  const planned = toPesos(amount * 0.3);
  return { savings, planned, treat: amount - savings - planned };
}

function listNames(names: string[]) {
  return names.length === 1 ? names[0] : `${names.slice(0, -1).join(", ")} y ${names.at(-1)}`;
}

export function pickTip({ overBudget, unexpectedIncome, hasBudget }: TipContext, dayOfYear: number): Tip {
  if (overBudget.length > 0) {
    return {
      tone: "warning",
      text: `Te pasaste en ${listNames(overBudget)}. No pasa nada: ajustá otra categoría o el ahorro del mes, y el que viene arrancás más atento.`,
    };
  }

  if (unexpectedIncome > 0) {
    const { savings, planned, treat } = splitUnexpectedIncome(unexpectedIncome);
    return {
      tone: "info",
      text: `Entró un ingreso inesperado de ${formatMoney(unexpectedIncome, "UYU")}. La regla de la casa: ${formatMoney(savings, "UYU")} al ahorro, ${formatMoney(planned, "UYU")} a gastos planeados y ${formatMoney(treat, "UYU")} para darte un gusto.`,
    };
  }

  if (!hasBudget) {
    return {
      tone: "info",
      text: "Ponele un presupuesto a tus categorías: lo que no se mide se escapa como agua entre los dedos.",
    };
  }

  return { tone: "info", text: everydayTips[dayOfYear % everydayTips.length] };
}
