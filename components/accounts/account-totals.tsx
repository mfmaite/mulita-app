import { Money } from "@/components/ui/money";
import { totalsByCurrency } from "@/lib/accounts/totals";
import { currencies, type Account } from "@/lib/db/schema";
import { currencyLabels } from "./account-meta";

export function AccountTotals({ accounts }: { accounts: Account[] }) {
  const totals = totalsByCurrency(accounts.map(({ currency, initialBalance }) => ({ currency, amount: initialBalance })));

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3">
      {currencies
        .filter((currency) => totals[currency] !== undefined)
        .map((currency) => (
          <div key={currency} className="rounded-2xl bg-green-700 px-4 py-3 text-cream-50 sm:px-5 sm:py-4">
            <p className="text-xs text-green-100 sm:text-sm">Total en {currencyLabels[currency].toLowerCase()}</p>
            <Money
              cents={totals[currency]!}
              currency={currency}
              className="font-display text-xl font-bold text-cream-50 sm:text-3xl"
            />
          </div>
        ))}
    </div>
  );
}
