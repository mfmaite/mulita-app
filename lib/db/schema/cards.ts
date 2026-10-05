import { sql } from "drizzle-orm";
import { date, integer, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { archivedAt, id, timestamps } from "./columns";

export const creditCards = pgTable(
  "credit_cards",
  {
    id: id(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text().notNull(),
    closingDay: integer().notNull(),
    archivedAt: archivedAt(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("credit_cards_user_id_name_idx")
      .on(table.userId, sql`lower(${table.name})`)
      .where(sql`${table.archivedAt} is null`),
  ],
);

export const cardClosingOverrides = pgTable(
  "card_closing_overrides",
  {
    id: id(),
    cardId: uuid()
      .notNull()
      .references(() => creditCards.id, { onDelete: "cascade" }),
    month: date().notNull(),
    closingDay: integer().notNull(),
    ...timestamps,
  },
  (table) => [uniqueIndex("card_closing_overrides_card_id_month_idx").on(table.cardId, table.month)],
);

export type CreditCard = typeof creditCards.$inferSelect;
