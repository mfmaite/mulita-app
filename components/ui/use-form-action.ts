"use client";

import { startTransition, useActionState, type FormEvent } from "react";
import { toast } from "sonner";
import type { FormState } from "@/lib/forms";

type FormAction<Field extends string> = (previous: FormState<Field>, formData: FormData) => Promise<FormState<Field>>;

export function useFormAction<Field extends string>(action: FormAction<Field>, onSuccess?: () => void) {
  const [state, dispatch, isPending] = useActionState(async (previous: FormState<Field>, formData: FormData) => {
    const result = await action(previous, formData);
    if (result.success) {
      toast.success(result.success);
      onSuccess?.();
    }
    return result;
  }, {});

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => dispatch(formData));
  };

  return [state, onSubmit, isPending] as const;
}
