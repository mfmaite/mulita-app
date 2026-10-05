import "server-only";
import { and, asc, eq, isNull } from "drizzle-orm";
import { requireSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";

export async function listCategories() {
  const { user } = await requireSession();
  return db.select().from(categories).where(and(eq(categories.userId, user.id), isNull(categories.archivedAt))).orderBy(asc(categories.name));
}
