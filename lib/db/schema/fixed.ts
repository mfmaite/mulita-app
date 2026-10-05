import { bigint, boolean, date, index, integer, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { accounts, currency } from "./accounts";
import { users } from "./auth";
import { creditCards } from "./cards";
import { categories } from "./categories";
import { id, timestamps } from "./columns";

export const fixedKinds = ["expense", "card_payment", "savings"] as const;
export const frequencies = ["monthly", "bimonthly", "quarterly", "yearly"] as const;

export const fixedKind = pgEnum("fixed_kind", fixedKinds);
export const frequency = pgEnum("frequency", frequencies);

export const fixedCommitments = pgTable(
  "fixed_commitments",
  {
    id: id(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    kind: fixedKind().notNull(),
    name: text().notNull(),
    amount: bigint({ mode: "number" }).notNull(),
    variableAmount: boolean().default(false).notNull(),
    dueDay: integer().notNull(),
    frequency: frequency().notNull(),
    startMonth: date().notNull(),
    active: boolean().default(true).notNull(),
    categoryId: uuid().references(() => categories.id, { onDelete: "restrict" }),
    accountId: uuid().references(() => accounts.id, { onDelete: "restrict" }),
    cardId: uuid().references(() => creditCards.id, { onDelete: "restrict" }),
    currency: currency(),
    destinationAccountId: uuid().references(() => accounts.id, { onDelete: "restrict" }),
    note: text(),
    ...timestamps,
  },
  (table) => [index("fixed_commitments_user_id_idx").on(table.userId)],
);

export type FixedCommitment = typeof fixedCommitments.$inferSelect;
export type FixedKind = (typeof fixedKinds)[number];
export type Frequency = (typeof frequencies)[number];
