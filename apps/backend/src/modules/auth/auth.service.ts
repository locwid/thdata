import Elysia from "elysia";
import { UsersService, usersService, ZUserDto } from "@/modules/users";
import { Database } from "@/db";
import { ZSignInDto, ZSignUpDto } from "./auth.dto";
import { createId } from "@/lib/createId";
import { sessionsService, SessionsService, ZSessionDto } from "../sessions";
import { verifyPassword } from "@/lib/password";

class AuthService {
  constructor(
    private users: UsersService,
    private sessions: SessionsService,
  ) {}

  async signUp(
    db: Database,
    dto: ZSignUpDto,
  ): Promise<{ user: ZUserDto; session: ZSessionDto } | null> {
    const existingUser = await this.users.findByEmail(db, dto.email);
    if (!existingUser) {
      return null;
    }

    const [user, session] = await db.transaction((tx) => {
      const userId = createId();
      return Promise.all([
        this.users.create(tx, { id: userId, ...dto }),
        this.sessions.create(tx, { userId }),
      ]);
    });

    return {
      user,
      session,
    };
  }

  async signIn(
    db: Database,
    dto: ZSignInDto,
  ): Promise<{ user: ZUserDto; session: ZSessionDto } | null> {
    const user = await this.users.findByEmail(db, dto.email);
    if (!user || !verifyPassword(dto.password, user.password)) {
      return null;
    }
    const session = await this.sessions.create(db, { userId: user.id });
    return {
      user,
      session,
    };
  }

  async signOut(db: Database, token: string): Promise<boolean> {
    return this.sessions.deleteByToken(db, token);
  }

  getProfile(db: Database, token: string): Promise<ZUserDto | null> {
    return this.sessions.getUserByToken(db, token);
  }

  async validateSession(
    db: Database,
    token: string,
  ): Promise<ZSessionDto | null> {
    const session = await this.sessions.findByToken(db, token);
    if (!session) {
      return null;
    }
    if (session.expiresAt < new Date()) {
      return null;
    }

    return session;
  }
}

export const authService = new Elysia({
  name: "auth.service",
})
  .use(usersService)
  .use(sessionsService)
  .decorate(({ users, sessions }) => ({
    auth: new AuthService(users, sessions),
  }));
