import type { AccountWithBalance } from "@/lib/accounts/queries";
import { Money } from "@/components/ui/money";
import { AccountDialog } from "./account-dialog";
import { accountTypeMeta, currencyLabels } from "./account-meta";
import { ReconcileDialog } from "./reconcile-dialog";

export function AccountCard({ account }: { account: AccountWithBalance }) {
  const { label, icon: Icon } = accountTypeMeta[account.type];

  return (
    <li className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3">
      <span className="rounded-full bg-cream-100 p-2.5 text-green-700">
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-center sm:gap-3">
        <div className="min-w-0 flex-1">
          <p className="leading-snug font-semibold">{account.name}</p>
          <p className="text-sm text-muted">
            {label} · {currencyLabels[account.currency]}
          </p>
        </div>
        <Money
          cents={account.balance}
          currency={account.currency}
          className="font-display text-lg font-bold"
        />
      </div>
      <div className="flex shrink-0">
        <ReconcileDialog account={account} />
        <AccountDialog account={account} />
      </div>
    </li>
  );
}
