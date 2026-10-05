import { shiftMonth } from "@/lib/month";

type Goal = { target: number; share: number };

export function goalProgress({ target, share }: Goal, pool: number, monthlyPlan: number, currentMonth: string) {
  const saved = Math.round((pool * share) / 100);
  const missing = Math.max(target - saved, 0);
  const monthlyContribution = Math.round((monthlyPlan * share) / 100);
  const monthsLeft = missing === 0 ? 0 : monthlyContribution > 0 ? Math.ceil(missing / monthlyContribution) : null;

  return {
    saved,
    missing,
    monthlyContribution,
    monthsLeft,
    estimatedMonth: monthsLeft === null ? null : shiftMonth(currentMonth, monthsLeft),
    percent: target > 0 ? Math.min((saved / target) * 100, 100) : 0,
  };
}

export function unassignedShare(goals: Pick<Goal, "share">[]) {
  return 100 - goals.reduce((total, goal) => total + goal.share, 0);
}
