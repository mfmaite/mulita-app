import type { ReactNode } from "react";

type FieldProps = {
  label: string;
  errors?: string[];
  children: ReactNode;
};

export function Field({ label, errors, children }: FieldProps) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {errors?.[0] && <span className="block text-sm text-danger-strong">{errors[0]}</span>}
    </label>
  );
}
