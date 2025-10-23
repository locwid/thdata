import { config } from "@/lib/config";
import { BunSQLQueryResultHKT, drizzle } from "drizzle-orm/bun-sql";
import * as schema from "./schema";
import { PgTransaction } from "drizzle-orm/pg-core";
import { ExtractTablesWithRelations } from "drizzle-orm";
import Elysia from "elysia";

export const db = drizzle(config.databaseUrl, { schema });

export type Database =
  | typeof db
  | PgTransaction<
      BunSQLQueryResultHKT,
      typeof schema,
      ExtractTablesWithRelations<typeof schema>
    >;

export const dbProvider = new Elysia({ name: "db.provider" }).decorate(
  "db",
  db,
);
