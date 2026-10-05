"use client";

import { ConfirmDeleteButton } from "@/components/ui/confirm-delete-button";
import { CreateTrigger, EditTrigger } from "@/components/ui/dialog-triggers";
import { FormDialog } from "@/components/ui/form-dialog";
import { deleteCategory } from "@/lib/categories/actions";
import type { Category } from "@/lib/db/schema";
import { CategoryForm } from "./category-form";

export function CategoryDialog({ category }: { category?: Category }) {
  if (!category) {
    return (
      <FormDialog title="Nueva categoría" trigger={(open) => <CreateTrigger label="Nueva categoría" onClick={open} />}>
        {(close) => <CategoryForm onSaved={close} />}
      </FormDialog>
    );
  }

  return (
    <FormDialog
      title="Editar categoría"
      trigger={(open) => <EditTrigger label={`Editar ${category.name}`} onClick={open} />}
    >
      {(close) => (
        <>
          <CategoryForm category={category} onSaved={close} />
          <ConfirmDeleteButton
            label="Borrar categoría"
            question="¿La borramos?"
            onConfirm={() => deleteCategory(category.id)}
            onDeleted={close}
          />
        </>
      )}
    </FormDialog>
  );
}
