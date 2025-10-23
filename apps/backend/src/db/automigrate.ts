import { migrate } from "drizzle-orm/bun-sql/migrator";
import { db } from "./db";
import { config } from "@/lib/config";
import { hashPassword } from "@/lib/password";
import { users } from "./schema";

const seedAdminUser = async () => {
  const existingAdmin = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, config.admin.email),
  });

  if (existingAdmin) {
    return;
  }

  await db.insert(users).values({
    email: config.admin.email,
    password: await hashPassword(config.admin.password),
  });
};

export const automigrate = async () => {
  await migrate(db, { migrationsFolder: "./migrations" });
  await seedAdminUser();
};
