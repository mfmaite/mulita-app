"use client";

import { ConfirmDeleteButton } from "@/components/ui/confirm-delete-button";
import { FormDialog } from "@/components/ui/form-dialog";
import { deleteCategory } from "@/lib/categories/actions";
import type { Category } from "@/lib/db/schema";
import { CategoryForm } from "./category-form";

export function CategoryDialog({ category }: { category?: Category }) {
  if (!category) {
    return (
      <FormDialog title="Nueva categoría" trigger={{ kind: "create", label: "Nueva categoría" }}>
        {(close) => <CategoryForm onSaved={close} />}
      </FormDialog>
    );
  }

  return (
    <FormDialog title="Editar categoría" trigger={{ kind: "edit", label: `Editar ${category.name}` }}>
      {(close) => (
        <>
          <CategoryForm category={category} onSaved={close} />
          <ConfirmDeleteButton
            label="Borrar categoría"
            question="¿La borramos?"
            successMessage={`Listo, chau ${category.name}.`}
            onConfirm={() => deleteCategory(category.id)}
            onDeleted={close}
          />
        </>
      )}
    </FormDialog>
  );
}
