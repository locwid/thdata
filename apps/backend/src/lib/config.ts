import { t } from "elysia";
import { Value } from "@sinclair/typebox/value";

const tConfig = t.Object({
  databaseUrl: t.String(),
  admin: t.Object({
    email: t.String({ format: "email" }),
    password: t.String({ minLength: 8 }),
  }),
});

export const config = Value.Parse(tConfig, {
  databaseUrl: process.env.DATABASE_URL,
  admin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },
});
