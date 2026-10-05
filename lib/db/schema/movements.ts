import { bigint, date, index, integer, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { accounts, currency } from "./accounts";
import { users } from "./auth";
import { creditCards } from "./cards";
import { categories } from "./categories";
import { id, timestamps } from "./columns";

export const movementTypes = ["income", "expense", "transfer", "adjustment"] as const;

export const movementType = pgEnum("movement_type", movementTypes);

export const movements = pgTable(
  "movements",
  {
    id: id(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: movementType().notNull(),
    date: date().notNull(),
    accountId: uuid().references(() => accounts.id, { onDelete: "restrict" }),
    cardId: uuid().references(() => creditCards.id, { onDelete: "restrict" }),
    currency: currency(),
    installments: integer(),
    firstBillingMonth: date(),
    categoryId: uuid().references(() => categories.id, { onDelete: "restrict" }),
    amount: bigint({ mode: "number" }).notNull(),
    destinationAccountId: uuid().references(() => accounts.id, { onDelete: "restrict" }),
    destinationAmount: bigint({ mode: "number" }),
    detail: text(),
    ...timestamps,
  },
  (table) => [
    index("movements_user_id_date_idx").on(table.userId, table.date),
    index("movements_account_id_idx").on(table.accountId),
    index("movements_category_id_idx").on(table.categoryId),
    index("movements_destination_account_id_idx").on(table.destinationAccountId),
    index("movements_card_id_idx").on(table.cardId),
  ],
);

export type Movement = typeof movements.$inferSelect;
export type MovementType = (typeof movementTypes)[number];
