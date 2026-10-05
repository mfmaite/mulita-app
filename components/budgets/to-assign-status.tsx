import { Alert } from "@/components/ui/alert";
import { Money } from "@/components/ui/money";

export function ToAssignStatus({ toAssign }: { toAssign: number }) {
  if (toAssign < 0) {
    return (
      <Alert tone="danger">
        El presupuesto más el ahorro superan lo que ganás por <Money cents={-toAssign} currency="UYU" className="font-semibold" />.
        Bajá alguna categoría o el ahorro, que la cuenta no da.
      </Alert>
    );
  }

  if (toAssign === 0) return <Alert tone="success">Está todo asignado. Cuentas claras, y tá.</Alert>;

  return (
    <Alert tone="info">
      Hay <Money cents={toAssign} currency="UYU" className="font-semibold" /> sin asignar. Repartilos entre las categorías
      o sumalos al ahorro.
    </Alert>
  );
}
