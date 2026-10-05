import { cn } from "@/lib/cn";

export const segmentTrackClassName = "grid w-full auto-cols-fr grid-flow-col gap-1 rounded-xl bg-cream-100 p-1";
export const segmentItemClassName =
  "cursor-pointer rounded-lg px-3 py-2 text-center text-sm font-semibold text-cream-800 transition-colors";

type Option = { value: string; label: string };

type SegmentedControlProps = {
  label: string;
  name: string;
  options: Option[];
  defaultValue?: string;
  errors?: string[];
  onValueChange?: (value: string) => void;
};

export function SegmentedControl({ label, name, options, defaultValue, errors, onValueChange }: SegmentedControlProps) {
  return (
    <fieldset className="space-y-1.5">
      <legend className="text-sm font-medium">{label}</legend>
      <div className={segmentTrackClassName}>
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              segmentItemClassName,
              "has-checked:bg-surface has-checked:text-green-800 has-checked:shadow-sm has-focus-visible:ring-2 has-focus-visible:ring-green-600",
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              defaultChecked={option.value === defaultValue}
              onChange={(event) => onValueChange?.(event.target.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
      {errors?.[0] && <p className="text-sm text-danger-strong">{errors[0]}</p>}
    </fieldset>
  );
}
