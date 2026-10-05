import { bigint, date, pgTable, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { id, timestamps } from "./columns";

export const monthlyPlans = pgTable(
  "monthly_plans",
  {
    id: id(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    effectiveFrom: date().notNull(),
    expectedIncome: bigint({ mode: "number" }).default(0).notNull(),
    savingsTarget: bigint({ mode: "number" }).default(0).notNull(),
    ...timestamps,
  },
  (table) => [uniqueIndex("monthly_plans_user_id_effective_from_idx").on(table.userId, table.effectiveFrom)],
);

export const userSettings = pgTable("user_settings", {
  userId: uuid()
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  monthlySavingsPlan: bigint({ mode: "number" }).default(0).notNull(),
  onboardedAt: timestamp({ withTimezone: true }),
  ...timestamps,
});

export type MonthlyPlan = typeof monthlyPlans.$inferSelect;
