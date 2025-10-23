import { pgTable, text } from "drizzle-orm/pg-core";
import { baseTable } from "../helpers";
import { relations } from "drizzle-orm";
import { sessions } from "./sessions";

export const users = pgTable("users", {
  ...baseTable,
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
}));
