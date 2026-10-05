"use client";

import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useDialog } from "@/components/ui/use-dialog";
import type { Category } from "@/lib/db/schema";
import { CategoryForm } from "./category-form";
import { DeleteCategoryButton } from "./delete-category-button";

export function CategoryDialog({ category }: { category?: Category }) {
  const { ref, isOpen, open, close, onClose } = useDialog();

  return (
    <>
      {category ? (
        <button
          onClick={open}
          aria-label={`Editar ${category.name}`}
          className="rounded-full p-2 text-green-800 hover:bg-cream-100"
        >
          <Pencil className="size-4" aria-hidden />
        </button>
      ) : (
        <Button onClick={open} className="self-start sm:self-auto">
          <Plus className="size-5" aria-hidden />
          Nueva categoría
        </Button>
      )}
      <Dialog ref={ref} title={category ? "Editar categoría" : "Nueva categoría"} onClose={onClose}>
        {isOpen && (
          <div className="space-y-3">
            <CategoryForm category={category} onSaved={close} />
            {category && <DeleteCategoryButton category={category} onDeleted={close} />}
          </div>
        )}
      </Dialog>
    </>
  );
}
