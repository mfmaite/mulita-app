"use client";

import { useActionState } from "react";
import { toast } from "sonner";
import type { FormState } from "@/lib/forms";

type FormAction<Field extends string> = (previous: FormState<Field>, formData: FormData) => Promise<FormState<Field>>;

export function useFormAction<Field extends string>(action: FormAction<Field>, onSuccess?: () => void) {
  return useActionState(async (previous: FormState<Field>, formData: FormData) => {
    const result = await action(previous, formData);
    if (result.success) {
      toast.success(result.success);
      onSuccess?.();
    }
    return result;
  }, {});
}
