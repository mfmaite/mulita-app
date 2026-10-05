import { sql } from "drizzle-orm";
import { bigint, integer, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { id, timestamps } from "./columns";

export const savingsGoals = pgTable(
  "savings_goals",
  {
    id: id(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text().notNull(),
    target: bigint({ mode: "number" }).notNull(),
    share: integer().notNull(),
    note: text(),
    ...timestamps,
  },
  (table) => [uniqueIndex("savings_goals_user_id_name_idx").on(table.userId, sql`lower(${table.name})`)],
);

export const userSettings = pgTable("user_settings", {
  userId: uuid()
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  monthlySavingsPlan: bigint({ mode: "number" }).default(0).notNull(),
  ...timestamps,
});

export type SavingsGoal = typeof savingsGoals.$inferSelect;
