import { Money } from "@/components/ui/money";
import type { Account } from "@/lib/db/schema";
import { AccountDialog } from "./account-dialog";
import { accountTypeMeta, currencyLabels } from "./account-meta";

export function AccountCard({ account }: { account: Account }) {
  const { label, icon: Icon } = accountTypeMeta[account.type];

  return (
    <li className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3">
      <span className="rounded-full bg-cream-100 p-2.5 text-green-700">
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold leading-snug">{account.name}</p>
        <p className="text-sm text-muted">
          {label} · {currencyLabels[account.currency]}
        </p>
      </div>
      <Money
        cents={account.initialBalance}
        currency={account.currency}
        className="shrink-0 font-display font-bold sm:text-lg"
      />
      <AccountDialog account={account} />
    </li>
  );
}
