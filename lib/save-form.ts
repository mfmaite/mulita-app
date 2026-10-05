import "server-only";
import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { requireSession } from "@/lib/auth/session";
import { isUniqueViolation } from "@/lib/db/errors";
import { formValues, invalidForm, type FormState } from "@/lib/forms";

export class FieldError extends Error {
  constructor(
    readonly field: string,
    message: string,
  ) {
    super(message);
  }
}

type SaveFormOptions<Field extends string, Data> = {
  formData: FormData;
  fields: readonly Field[];
  schema: z.ZodType<Data>;
  save: (data: Data, userId: string) => Promise<unknown>;
  success: string;
  duplicate?: { field: Field; message: string };
};

export async function saveForm<Field extends string, Data>({
  formData,
  fields,
  schema,
  save,
  success,
  duplicate,
}: SaveFormOptions<Field, Data>): Promise<FormState<Field>> {
  const values = formValues(formData, fields);
  const parsed = schema.safeParse(values);
  if (!parsed.success) return invalidForm(parsed.error, values);

  const { user } = await requireSession();

  let message: unknown;

  try {
    message = await save(parsed.data, user.id);
  } catch (error) {
    const fieldError =
      error instanceof FieldError
        ? error
        : duplicate && isUniqueViolation(error)
          ? new FieldError(duplicate.field, duplicate.message)
          : undefined;
    if (!fieldError) throw error;
    return { values, fieldErrors: { [fieldError.field]: [fieldError.message] } as FormState<Field>["fieldErrors"] };
  }

  revalidateApp();
  return { success: typeof message === "string" ? message : success };
}

export function revalidateApp() {
  revalidatePath("/", "layout");
}
