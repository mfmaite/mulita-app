"use client";

import { ConfirmDeleteButton } from "@/components/ui/confirm-delete-button";
import { FormDialog } from "@/components/ui/form-dialog";
import { deleteAccount } from "@/lib/accounts/actions";
import type { Account } from "@/lib/db/schema";
import { AccountForm } from "./account-form";

export function AccountDialog({ account }: { account?: Account }) {
  if (!account) {
    return (
      <FormDialog title="Nueva cuenta" trigger={{ kind: "create", label: "Nueva cuenta" }}>
        {(close) => <AccountForm onSaved={close} />}
      </FormDialog>
    );
  }

  return (
    <FormDialog title="Editar cuenta" trigger={{ kind: "edit", label: `Editar ${account.name}` }}>
      {(close) => (
        <>
          <AccountForm account={account} onSaved={close} />
          <ConfirmDeleteButton
            label="Borrar cuenta"
            question="¿La borramos?"
            successMessage={`Listo, chau ${account.name}.`}
            onConfirm={() => deleteAccount(account.id)}
            onDeleted={close}
          />
        </>
      )}
    </FormDialog>
  );
}
