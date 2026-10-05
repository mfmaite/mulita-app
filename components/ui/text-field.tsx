import type { ComponentProps } from "react";
import { Field } from "./field";
import { Input } from "./input";

type TextFieldProps = ComponentProps<"input"> & {
  label: string;
  errors?: string[];
};

export function TextField({ label, errors, ...props }: TextFieldProps) {
  return (
    <Field label={label} errors={errors}>
      <Input aria-invalid={Boolean(errors?.length)} {...props} />
    </Field>
  );
}
