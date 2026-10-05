import { bigint, date, pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { categories } from "./categories";
import { id, timestamps } from "./columns";

export const budgets = pgTable(
  "budgets",
  {
    id: id(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    categoryId: uuid()
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    effectiveFrom: date().notNull(),
    amount: bigint({ mode: "number" }).notNull(),
    ...timestamps,
  },
  (table) => [uniqueIndex("budgets_category_id_effective_from_idx").on(table.categoryId, table.effectiveFrom)],
);

export const exchangeRates = pgTable(
  "exchange_rates",
  {
    id: id(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    month: date().notNull(),
    usdToUyu: bigint({ mode: "number" }).notNull(),
    ...timestamps,
  },
  (table) => [uniqueIndex("exchange_rates_user_id_month_idx").on(table.userId, table.month)],
);
