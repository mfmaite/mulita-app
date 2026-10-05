import "server-only";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { defaultCategories } from "./defaults";

export async function seedDefaultCategories(userId: string) {
  await db
    .insert(categories)
    .values(defaultCategories.map((category) => ({ ...category, userId })))
    .onConflictDoNothing();
}
