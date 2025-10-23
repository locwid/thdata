import { Database, tables } from "@/db";
import { ZCreateSessionDto, ZSessionDto } from "./sessions.dto";
import { randomBase64 } from "@/lib/randomBase64";
import Elysia from "elysia";
import { eq } from "drizzle-orm";
import { ZUserDto } from "../users";

const defaultSessionDurationMs = 30 * 60 * 1000; // 30 minutes

export class SessionsService {
  constructor(private durationMs: number = defaultSessionDurationMs) {}

  async create(db: Database, dto: ZCreateSessionDto): Promise<ZSessionDto> {
    const token = randomBase64(256);
    const expiresAt = new Date(Date.now() + this.durationMs);
    const [session] = await db
      .insert(tables.sessions)
      .values({
        ...dto,
        token,
        expiresAt,
      })
      .returning();
    return session;
  }

  async findByToken(db: Database, token: string): Promise<ZSessionDto | null> {
    const [session] = await db
      .select()
      .from(tables.sessions)
      .where(eq(tables.sessions.token, token));
    return session ?? null;
  }

  async deleteByToken(db: Database, token: string): Promise<boolean> {
    const [session] = await db
      .delete(tables.sessions)
      .where(eq(tables.sessions.token, token))
      .returning();
    return !!session;
  }

  async getUserByToken(db: Database, token: string): Promise<ZUserDto | null> {
    const session = await db.query.sessions.findFirst({
      where: eq(tables.sessions.token, token),
      with: {
        user: true,
      },
    });
    return session?.user ?? null;
  }
}

export const sessionsService = new Elysia({
  name: "sessions.service",
}).decorate(() => ({
  sessions: new SessionsService(),
}));
