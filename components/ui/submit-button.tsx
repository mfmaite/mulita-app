"use client";

import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "./button";

type SubmitButtonProps = Omit<ButtonProps, "type"> & {
  pendingLabel?: string;
};

export function SubmitButton({ pendingLabel, children, disabled, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || disabled} aria-busy={pending} {...props}>
      {pending && pendingLabel ? pendingLabel : children}
    </Button>
  );
}
