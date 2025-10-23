import * as z from "zod/v4";

const zConfig = z.object({
  databaseUrl: z.string(),
  admin: z.object({
    email: z.email(),
    password: z.string(),
  }),
});

export const config = zConfig.parse({
  databaseUrl: process.env.DATABASE_URL,
  admin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },
});
