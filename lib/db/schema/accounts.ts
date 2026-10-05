import { sql } from "drizzle-orm";
import { bigint, pgEnum, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { archivedAt, id, timestamps } from "./columns";

export const accountTypes = ["checking", "savings", "cash"] as const;
export const currencies = ["UYU", "USD"] as const;

export const accountType = pgEnum("account_type", accountTypes);
export const currency = pgEnum("currency", currencies);

export const accounts = pgTable(
  "accounts",
  {
    id: id(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text().notNull(),
    type: accountType().notNull(),
    currency: currency().notNull(),
    initialBalance: bigint({ mode: "number" }).default(0).notNull(),
    archivedAt: archivedAt(),
    ...timestamps,
  },
  (table) => [uniqueIndex("accounts_user_id_name_idx")
      .on(table.userId, sql`lower(${table.name})`)
      .where(sql`${table.archivedAt} is null`)],
);

export type Account = typeof accounts.$inferSelect;
export type AccountType = (typeof accountTypes)[number];
export type Currency = (typeof currencies)[number];
