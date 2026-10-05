import { Tags } from "lucide-react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/shell/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "Categorías" };

export default function CategoriesPage() {
  return (
    <>
      <PageHeader title="Categorías" description="En qué se te va la plata, ordenado." />
      <EmptyState
        icon={Tags}
        title="Las categorías vienen en camino"
        description="Muy pronto vas a tener tus categorías cargadas, listas para usar."
      />
    </>
  );
}
