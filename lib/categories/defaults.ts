import type { CategoryKind } from "@/lib/db/schema";

type DefaultCategory = { kind: CategoryKind; name: string; description: string };

export const defaultCategories: DefaultCategory[] = [
  { kind: "expense", name: "Vivienda", description: "Alquiler, gastos comunes, tributos domiciliarios." },
  { kind: "expense", name: "Cuentas y servicios", description: "UTE, OSE, Antel, internet, etc." },
  { kind: "expense", name: "Aportes y obligaciones", description: "FONASA, aportes jubilatorios y otras obligaciones." },
  { kind: "expense", name: "Comida casa", description: "Supermercado, feria, almacén." },
  { kind: "expense", name: "Gasto libre", description: "Delivery, restaurantes y café. No se elimina: se presupuesta." },
  { kind: "expense", name: "Transporte", description: "Ómnibus, STM, Uber y taxi." },
  { kind: "expense", name: "Salud y cuidado", description: "Médico, medicamentos y cuidado personal." },
  { kind: "expense", name: "Actividades", description: "Cursos, talleres, salidas y hobbies." },
  { kind: "expense", name: "Compras hogar", description: "Cosas para la casa." },
  { kind: "expense", name: "Compras personales", description: "Ropa y otras compras para vos." },
  { kind: "expense", name: "Mascotas", description: "Comida, veterinaria y cositas para tus mascotas." },
  { kind: "expense", name: "Deudas", description: "Plata que le debés a amigues u otras personas." },
  { kind: "income", name: "Ingreso principal", description: "Tu sueldo o ingreso fijo." },
  { kind: "income", name: "Ingreso inesperado", description: "Ventas, devoluciones de impuestos o plata que no esperabas." },
  { kind: "income", name: "Reintegro", description: "Te devolvieron plata de algo que ya habías pagado." },
];
