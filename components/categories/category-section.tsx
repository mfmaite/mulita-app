import type { Category } from "@/lib/db/schema";
import { CategoryDialog } from "./category-dialog";

type CategorySectionProps = {
  title: string;
  emptyText: string;
  categories: Category[];
};

export function CategorySection({ title, emptyText, categories }: CategorySectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="flex items-baseline gap-2 text-xl">
        {title}
        <span className="font-sans text-sm font-medium text-muted">{categories.length}</span>
      </h2>
      {categories.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-cream-300 px-4 py-6 text-center text-sm text-muted">
          {emptyText}
        </p>
      ) : (
        <ul className="grid gap-2 md:grid-cols-2">
          {categories.map((category) => (
            <li
              key={category.id}
              className="flex items-start justify-between gap-3 rounded-2xl border border-border bg-surface px-4 py-3"
            >
              <div className="min-w-0 space-y-0.5">
                <p className="font-semibold">{category.name}</p>
                {category.description && <p className="text-sm text-muted">{category.description}</p>}
              </div>
              <CategoryDialog category={category} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
