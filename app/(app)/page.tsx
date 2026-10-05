import { Sprout } from "lucide-react";
import { MonthSelector } from "@/components/shell/month-selector";
import { PageHeader } from "@/components/shell/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { requireSession } from "@/lib/auth/session";
import { monthParam, parseMonth } from "@/lib/month";

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const [{ user }, params] = await Promise.all([requireSession(), searchParams]);
  const month = parseMonth(params[monthParam]);

  return (
    <>
      <PageHeader title={`¡Hola, ${user.name.split(" ")[0]}!`} description="Así vienen tus cuentas este mes.">
        <MonthSelector month={month} path="/" />
      </PageHeader>
      <EmptyState
        icon={Sprout}
        title="Acá va a crecer tu resumen del mes"
        description="En cuanto anotes tus primeros movimientos, Mulita te muestra cómo venís."
      />
    </>
  );
}
