import type { ComponentProps } from "react";

type CheckboxFieldProps = Omit<ComponentProps<"input">, "type"> & { label: string };

export function CheckboxField({ label, ...props }: CheckboxFieldProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm">
      <input type="checkbox" className="size-5 rounded accent-green-700" {...props} />
      {label}
    </label>
  );
}
