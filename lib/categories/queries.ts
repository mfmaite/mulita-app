import "server-only";
import { asc, eq } from "drizzle-orm";
import { requireSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";

export async function listCategories() {
  const { user } = await requireSession();
  return db.select().from(categories).where(eq(categories.userId, user.id)).orderBy(asc(categories.name));
}
