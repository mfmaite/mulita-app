import { formatMonth } from "@/lib/month";

export function changeMessage(month: string, onlyThisMonth: boolean) {
  const label = formatMonth(month).toLowerCase();
  return onlyThisMonth ? `Tá, solo para ${label}. El mes que viene vuelve a lo de antes.` : `Tá, vale desde ${label} en adelante.`;
}
