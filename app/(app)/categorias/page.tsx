import type { Metadata } from "next";
import { CategoryDialog } from "@/components/categories/category-dialog";
import { CategorySection } from "@/components/categories/category-section";
import { PageHeader } from "@/components/shell/page-header";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { listCategories } from "@/lib/categories/queries";

export const metadata: Metadata = { title: "Categorías" };

const sections = [
  {
    kind: "expense",
    filter: "gastos",
    title: "Gastos",
    emptyText: "No tenés categorías de gastos. Raro, pero bien.",
  },
  {
    kind: "income",
    filter: "ingresos",
    title: "Ingresos",
    emptyText: "Todavía no hay categorías de ingresos.",
  },
] as const;

export default async function CategoriesPage({ searchParams }: PageProps<"/categorias">) {
  const [categories, { tipo }] = await Promise.all([listCategories(), searchParams]);
  const activeFilter = sections.find((section) => section.filter === tipo)?.filter;

  const tabs = [
    { label: "Todas", href: "/categorias", isActive: !activeFilter },
    ...sections.map(({ title, filter }) => ({
      label: title,
      href: `/categorias?tipo=${filter}`,
      isActive: activeFilter === filter,
    })),
  ];

  return (
    <>
      <PageHeader title="Categorías" description="En qué entra y en qué se te va la plata.">
        <CategoryDialog />
      </PageHeader>
      <FilterTabs label="Filtrar categorías" tabs={tabs} />
      {sections
        .filter((section) => !activeFilter || section.filter === activeFilter)
        .map(({ kind, title, emptyText }) => (
          <CategorySection
            key={kind}
            title={title}
            emptyText={emptyText}
            categories={categories.filter((category) => category.kind === kind)}
          />
        ))}
    </>
  );
}
