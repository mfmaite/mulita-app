import { sql } from "drizzle-orm";
import { pgEnum, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { id, timestamps } from "./columns";

export const categoryKinds = ["expense", "income"] as const;

export const categoryKind = pgEnum("category_kind", categoryKinds);

export const categories = pgTable(
  "categories",
  {
    id: id(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    kind: categoryKind().notNull(),
    name: text().notNull(),
    description: text(),
    ...timestamps,
  },
  (table) => [uniqueIndex("categories_user_id_name_idx").on(table.userId, sql`lower(${table.name})`)],
);

export type Category = typeof categories.$inferSelect;
export type CategoryKind = (typeof categoryKinds)[number];
