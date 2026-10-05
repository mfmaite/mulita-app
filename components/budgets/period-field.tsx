"use client";

import { useState } from "react";
import { CheckboxField } from "@/components/ui/checkbox-field";
import { formatMonth, shiftMonth } from "@/lib/month";

export function PeriodField({ month }: { month: string }) {
  const [onlyThisMonth, setOnlyThisMonth] = useState(false);
  const label = formatMonth(month).toLowerCase();
  const next = formatMonth(shiftMonth(month, 1)).toLowerCase();

  return (
    <div className="space-y-1.5">
      <CheckboxField
        name="onlyThisMonth"
        label="Solo este mes"
        checked={onlyThisMonth}
        onChange={(event) => setOnlyThisMonth(event.target.checked)}
      />
      <p className="text-sm text-muted">
        {onlyThisMonth
          ? `Solo para ${label}. En ${next} vuelve a lo de antes.`
          : `Vale desde ${label} en adelante. Los meses anteriores no cambian.`}
      </p>
    </div>
  );
}
