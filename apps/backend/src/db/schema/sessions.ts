import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { baseTable } from "../helpers";
import { relations } from "drizzle-orm";
import { users } from "./users";

export const sessions = pgTable("sessions", {
  ...baseTable,
  userId: text("user_id").notNull(),
  token: text("token").unique().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));
