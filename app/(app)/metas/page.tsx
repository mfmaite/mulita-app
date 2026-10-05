import { Target } from "lucide-react";
import type { Metadata } from "next";
import { GoalCard } from "@/components/goals/goal-card";
import { GoalDialog } from "@/components/goals/goal-dialog";
import { GoalsSummary } from "@/components/goals/goals-summary";
import { PageHeader } from "@/components/shell/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { getGoalsOverview } from "@/lib/goals/queries";

export const metadata: Metadata = { title: "Metas" };

export default async function GoalsPage() {
  const { goals, ...overview } = await getGoalsOverview();

  return (
    <>
      <PageHeader title="Metas de ahorro" description="Repartí tu ahorro y mirá cuándo llegás.">
        <GoalDialog />
      </PageHeader>
      <GoalsSummary {...overview} hasGoals={goals.length > 0} />
      {goals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="Todavía no hay metas"
          description="¿Un colchón para imprevistos? ¿Ese viaje que venís postergando? Creá tu primera meta."
        />
      ) : (
        <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </ul>
      )}
    </>
  );
}
