import { eq, isNull, or, type AnyColumn } from "drizzle-orm";

export function activeOrCurrent(archivedAt: AnyColumn, id: AnyColumn, currentId?: string | null) {
  return currentId ? or(isNull(archivedAt), eq(id, currentId)) : isNull(archivedAt);
}
