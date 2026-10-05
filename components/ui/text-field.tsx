import type { ComponentProps } from "react";
import { Field } from "./field";
import { Input } from "./input";

type TextFieldProps = ComponentProps<"input"> & {
  label: string;
  hint?: string;
  errors?: string[];
};

export function TextField({ label, hint, errors, ...props }: TextFieldProps) {
  return (
    <Field label={label} hint={hint} errors={errors}>
      <Input aria-invalid={Boolean(errors?.length)} {...props} />
    </Field>
  );
}
