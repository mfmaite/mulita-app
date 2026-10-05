import type { ReactNode } from "react";

type FieldProps = {
  label: string;
  hint?: string;
  errors?: string[];
  children: ReactNode;
};

export function Field({ label, hint, errors, children }: FieldProps) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {errors?.[0] ? (
        <span className="block text-sm text-danger-strong">{errors[0]}</span>
      ) : (
        hint && <span className="block text-sm text-muted">{hint}</span>
      )}
    </label>
  );
}
