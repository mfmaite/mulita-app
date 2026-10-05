import { z } from "zod";

export type FormState<Field extends string = string> = {
  values?: Partial<Record<Field, string>>;
  fieldErrors?: Partial<Record<Field, string[]>>;
  message?: string;
};

export function invalidForm<Field extends string>(
  error: z.ZodError,
  values: Partial<Record<Field, string>>,
): FormState<Field> {
  return { values, fieldErrors: z.flattenError(error).fieldErrors as FormState<Field>["fieldErrors"] };
}
