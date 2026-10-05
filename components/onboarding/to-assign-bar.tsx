import { Money } from "@/components/ui/money";

export function ToAssignBar({ toAssign }: { toAssign: number }) {
  if (toAssign < 0) {
    return (
      <p className="text-sm font-semibold text-danger-strong">
        Te pasaste por <Money cents={-toAssign} currency="UYU" />. Bajá alguna categoría o el ahorro.
      </p>
    );
  }

  return (
    <p className="text-sm">
      {toAssign === 0 ? (
        <span className="font-semibold text-success-strong">Todo asignado, y tá.</span>
      ) : (
        <>
          Te quedan <Money cents={toAssign} currency="UYU" className="font-semibold" /> sin asignar.
        </>
      )}
    </p>
  );
}
