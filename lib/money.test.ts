import { describe, expect, it } from "vitest";
import { centsToInput, formatMoney, moneyField, parseMoney } from "./money";

const nbsp = "\u00a0";

describe("formatMoney", () => {
  it("formats pesos without decimals when the amount is whole", () => {
    expect(formatMoney(12505400, "UYU")).toBe(`$${nbsp}125.054`);
  });

  it("keeps two decimals when there are cents", () => {
    expect(formatMoney(4125, "USD")).toBe(`US$${nbsp}41,25`);
    expect(formatMoney(-123450, "UYU")).toBe(`-$${nbsp}1.234,50`);
  });
});

describe("parseMoney", () => {
  it.each([
    ["1500", 150000],
    ["1.500", 150000],
    ["1.500,50", 150050],
    ["1500,5", 150050],
    ["1500.50", 150050],
    ["$ 2.980", 298000],
    ["US$ 41,25", 4125],
    ["-712", -71200],
    ["0", 0],
  ])("parses %s as %i cents", (input, cents) => {
    expect(parseMoney(input)).toBe(cents);
  });

  it.each(["", "abc", "12,345", "1.2.3", "10,999", "--5"])("rejects %s", (input) => {
    expect(parseMoney(input)).toBeNull();
  });
});

describe("centsToInput", () => {
  it("shows two decimals only when there are cents", () => {
    expect(centsToInput(150050)).toBe("1500,50");
    expect(centsToInput(1657000)).toBe("16570");
  });

  it("round-trips through parseMoney", () => {
    for (const cents of [0, 150050, 4125, -71200, 12505400]) {
      expect(parseMoney(centsToInput(cents))).toBe(cents);
    }
  });
});

describe("moneyField", () => {
  const field = moneyField("No se entiende");

  it("accepts amounts up to the limit", () => {
    expect(field.parse("999.999.999,99")).toBe(99_999_999_999);
    expect(field.parse("-999.999.999,99")).toBe(-99_999_999_999);
    expect(field.parse("")).toBe(0);
  });

  it("rejects amounts above the limit", () => {
    const result = field.safeParse("1.000.000.000");
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toMatch(/demasiado grande/);
  });

  it("rejects amounts it cannot understand", () => {
    expect(field.safeParse("mil pesos").error?.issues[0].message).toBe("No se entiende");
  });
});
