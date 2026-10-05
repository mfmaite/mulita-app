import { PgDialect } from "drizzle-orm/pg-core";
import { describe, expect, it } from "vitest";
import { activeOrCurrent } from "./conditions";
import { accounts } from "./schema";

const dialect = new PgDialect({ casing: "snake_case" });

function render(currentId?: string | null) {
  const condition = activeOrCurrent(accounts.archivedAt, accounts.id, currentId);
  return dialect.sqlToQuery(condition!);
}

describe("activeOrCurrent", () => {
  it("only allows active rows when there is no current reference, without an empty id param", () => {
    const query = render(undefined);
    expect(query.sql).toContain("is null");
    expect(query.params).toEqual([]);
  });

  it("treats a missing category on the current movement the same way", () => {
    expect(render(null).params).toEqual([]);
  });

  it("also allows the current reference when editing, even if it is archived", () => {
    const query = render("486354f3-7017-4e90-a7a8-f319567f87cb");
    expect(query.sql).toContain(" or ");
    expect(query.params).toEqual(["486354f3-7017-4e90-a7a8-f319567f87cb"]);
  });
});
