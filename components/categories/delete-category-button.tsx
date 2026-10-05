"use client";

import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteCategory } from "@/lib/categories/actions";
import type { Category } from "@/lib/db/schema";

type DeleteCategoryButtonProps = {
  category: Category;
  onDeleted: () => void;
};

export function DeleteCategoryButton({ category, onDeleted }: DeleteCategoryButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  const confirmDelete = () =>
    startTransition(async () => {
      await deleteCategory(category.id);
      toast.success(`Listo, chau ${category.name}.`);
      onDeleted();
    });

  if (!isConfirming) {
    return (
      <Button
        variant="ghost"
        className="w-full text-danger-strong hover:bg-danger-soft"
        onClick={() => setIsConfirming(true)}
      >
        <Trash2 className="size-5" aria-hidden />
        Borrar categoría
      </Button>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2 rounded-2xl bg-danger-soft p-2 pl-4">
      <span className="text-sm font-medium text-danger-strong">¿La borramos?</span>
      <div className="flex gap-1">
        <Button variant="ghost" onClick={() => setIsConfirming(false)}>
          No
        </Button>
        <Button variant="danger" disabled={isPending} onClick={confirmDelete}>
          {isPending ? "Borrando..." : "Sí, borrar"}
        </Button>
      </div>
    </div>
  );
}
