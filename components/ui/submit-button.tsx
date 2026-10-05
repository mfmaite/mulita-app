"use client";

import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "./button";

type SubmitButtonProps = Omit<ButtonProps, "type"> & {
  pendingLabel?: string;
  pending?: boolean;
};

export function SubmitButton({ pendingLabel, pending: isPending, children, disabled, ...props }: SubmitButtonProps) {
  const pending = useFormStatus().pending || Boolean(isPending);
  return (
    <Button type="submit" disabled={pending || disabled} aria-busy={pending} {...props}>
      {pending && pendingLabel ? pendingLabel : children}
    </Button>
  );
}
