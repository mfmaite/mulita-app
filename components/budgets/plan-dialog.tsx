"use client";

import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/ui/form-dialog";
import type { MonthPlan } from "@/lib/budgets/plan";
import { PlanForm } from "./plan-form";

type PlanDialogProps = {
  plan: MonthPlan;
  month: string;
  label: string;
};

export function PlanDialog({ plan, month, label }: PlanDialogProps) {
  return (
    <FormDialog
      title="Ingreso y ahorro"
      trigger={(open) => (
        <Button variant="secondary" onClick={open} className="px-4 py-1.5 text-sm">
          {label}
        </Button>
      )}
    >
      {(close) => <PlanForm plan={plan} month={month} onSaved={close} />}
    </FormDialog>
  );
}
