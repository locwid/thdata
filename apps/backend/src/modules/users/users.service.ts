import { Database, tables } from "@/db";
import Elysia from "elysia";
import { TCreateUserDto, TUserDto } from "./users.dto";
import { eq } from "drizzle-orm";

export class UsersService {
  async create(db: Database, data: TCreateUserDto): Promise<TUserDto> {
    const [user] = await db.insert(tables.users).values(data).returning();
    return user;
  }

  async findByEmail(db: Database, email: string): Promise<TUserDto | null> {
    const [user] = await db
      .select()
      .from(tables.users)
      .where(eq(tables.users.email, email));
    return user ?? null;
  }

  async findById(db: Database, id: string): Promise<TUserDto | null> {
    const [user] = await db
      .select()
      .from(tables.users)
      .where(eq(tables.users.id, id));
    return user ?? null;
  }
}

export const usersService = new Elysia({
  name: "users.service",
}).decorate("users", new UsersService());
