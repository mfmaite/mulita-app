type PlanInput = {
  expectedIncome: number;
  income: number;
  unexpectedIncome: number;
  savingsTarget: number;
  saved: number;
  budgeted: number;
};

export function monthPlan({ expectedIncome, income, unexpectedIncome, savingsTarget, saved, budgeted }: PlanInput) {
  const regularIncome = income - unexpectedIncome;
  const baseIncome = Math.max(expectedIncome, regularIncome);
  const totalIncome = baseIncome + unexpectedIncome;

  return {
    expectedIncome,
    baseIncome,
    unexpectedIncome,
    usesRealIncome: regularIncome > expectedIncome,
    income: totalIncome,
    savingsTarget,
    saved,
    savingsPercent: savingsTarget > 0 ? (saved / savingsTarget) * 100 : null,
    budgeted,
    toAssign: totalIncome - savingsTarget - budgeted,
  };
}

export type MonthPlan = ReturnType<typeof monthPlan>;
