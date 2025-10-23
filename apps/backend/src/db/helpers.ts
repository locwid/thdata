import { createId } from "@/lib/createId";
import { text, timestamp } from "drizzle-orm/pg-core";

export const baseTable = {
  id: text("id")
    .primaryKey()
    .$default(() => createId()),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date())
    .notNull(),
};
