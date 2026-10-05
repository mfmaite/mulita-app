import { Wallet } from "lucide-react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/shell/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "Cuentas" };

export default function AccountsPage() {
  return (
    <>
      <PageHeader title="Cuentas" description="Dónde tenés la plata: débito, ahorro y efectivo." />
      <EmptyState
        icon={Wallet}
        title="Todavía no hay cuentas"
        description="Muy pronto vas a poder cargar tus cuentas en pesos y en dólares."
      />
    </>
  );
}
