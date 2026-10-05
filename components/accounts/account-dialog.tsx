"use client";

import { ConfirmDeleteButton } from "@/components/ui/confirm-delete-button";
import { CreateTrigger, EditTrigger } from "@/components/ui/dialog-triggers";
import { FormDialog } from "@/components/ui/form-dialog";
import { deleteAccount } from "@/lib/accounts/actions";
import type { Account } from "@/lib/db/schema";
import { AccountForm } from "./account-form";

export function AccountDialog({ account }: { account?: Account }) {
  if (!account) {
    return (
      <FormDialog title="Nueva cuenta" trigger={(open) => <CreateTrigger label="Nueva cuenta" onClick={open} />}>
        {(close) => <AccountForm onSaved={close} />}
      </FormDialog>
    );
  }

  return (
    <FormDialog title="Editar cuenta" trigger={(open) => <EditTrigger label={`Editar ${account.name}`} onClick={open} />}>
      {(close) => (
        <>
          <AccountForm account={account} onSaved={close} />
          <ConfirmDeleteButton
            label="Borrar cuenta"
            question="¿La borramos?"
            onConfirm={() => deleteAccount(account.id)}
            onDeleted={close}
          />
        </>
      )}
    </FormDialog>
  );
}
