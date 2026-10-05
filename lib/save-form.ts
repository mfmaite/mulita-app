import "server-only";
import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { requireSession } from "@/lib/auth/session";
import { isUniqueViolation } from "@/lib/db/errors";
import { formValues, invalidForm, type FormState } from "@/lib/forms";

type SaveFormOptions<Field extends string, Data> = {
  formData: FormData;
  fields: readonly Field[];
  schema: z.ZodType<Data>;
  save: (data: Data, userId: string) => Promise<unknown>;
  success: string;
  revalidate: string;
  duplicate?: { field: Field; message: string };
};

export async function saveForm<Field extends string, Data>({
  formData,
  fields,
  schema,
  save,
  success,
  revalidate,
  duplicate,
}: SaveFormOptions<Field, Data>): Promise<FormState<Field>> {
  const values = formValues(formData, fields);
  const parsed = schema.safeParse(values);
  if (!parsed.success) return invalidForm(parsed.error, values);

  const { user } = await requireSession();

  try {
    await save(parsed.data, user.id);
  } catch (error) {
    if (!duplicate || !isUniqueViolation(error)) throw error;
    return { values, fieldErrors: { [duplicate.field]: [duplicate.message] } as FormState<Field>["fieldErrors"] };
  }

  revalidatePath(revalidate);
  return { success };
}
