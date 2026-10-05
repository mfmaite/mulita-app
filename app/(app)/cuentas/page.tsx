import { Wallet } from "lucide-react";
import type { Metadata } from "next";
import { AccountCard } from "@/components/accounts/account-card";
import { AccountDialog } from "@/components/accounts/account-dialog";
import { AccountTotals } from "@/components/accounts/account-totals";
import { PageHeader } from "@/components/shell/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { listAccounts } from "@/lib/accounts/queries";

export const metadata: Metadata = { title: "Cuentas" };

export default async function AccountsPage() {
  const accounts = await listAccounts();

  return (
    <>
      <PageHeader title="Cuentas" description="Dónde tenés la plata: débito, ahorro y efectivo.">
        <AccountDialog />
      </PageHeader>
      {accounts.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="Todavía no hay cuentas"
          description="Cargá tu caja de ahorro, tu cuenta en dólares o la plata del colchón para empezar."
        />
      ) : (
        <>
          <AccountTotals accounts={accounts} />
          <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {accounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </ul>
        </>
      )}
    </>
  );
}
