"use client";

import { Field } from "@/components/ui/field";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SubmitButton } from "@/components/ui/submit-button";
import { TextField } from "@/components/ui/text-field";
import { Textarea } from "@/components/ui/textarea";
import { useFormAction } from "@/components/ui/use-form-action";
import { createCategory, updateCategory } from "@/lib/categories/actions";
import type { Category } from "@/lib/db/schema";

const kindOptions = [
  { value: "expense", label: "Gasto" },
  { value: "income", label: "Ingreso" },
];

type CategoryFormProps = {
  category?: Category;
  onSaved: () => void;
};

export function CategoryForm({ category, onSaved }: CategoryFormProps) {
  const save = category ? updateCategory.bind(null, category.id) : createCategory;

  const [state, action] = useFormAction(save, onSaved);

  const values = { ...category, ...state.values };

  return (
    <form action={action} noValidate className="space-y-4">
      <SegmentedControl label="Tipo" name="kind" options={kindOptions} defaultValue={values.kind ?? "expense"} />
      <TextField
        label="Nombre"
        name="name"
        placeholder="Ej: Feria del domingo"
        defaultValue={values.name}
        errors={state.fieldErrors?.name}
      />
      <Field label="Descripción (opcional)" errors={state.fieldErrors?.description}>
        <Textarea
          name="description"
          placeholder="¿Qué entra en esta categoría?"
          defaultValue={values.description ?? ""}
          aria-invalid={Boolean(state.fieldErrors?.description)}
        />
      </Field>
      <SubmitButton className="w-full" pendingLabel="Guardando...">
        {category ? "Guardar cambios" : "Crear categoría"}
      </SubmitButton>
    </form>
  );
}
