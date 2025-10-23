import Elysia from "elysia";
import { UsersService, usersService, TUserDto } from "@/modules/users";
import { Database } from "@/db";
import { TSignInDto, TSignUpDto } from "./auth.dto";
import { createId } from "@/lib/createId";
import { sessionsService, SessionsService, TSessionDto } from "../sessions";
import { verifyPassword } from "@/lib/password";

class AuthService {
  constructor(
    private users: UsersService,
    private sessions: SessionsService,
  ) {}

  async signUp(
    db: Database,
    dto: TSignUpDto,
  ): Promise<{ user: TUserDto; session: TSessionDto } | null> {
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
    dto: TSignInDto,
  ): Promise<{ user: TUserDto; session: TSessionDto } | null> {
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

  getProfile(db: Database, token: string): Promise<TUserDto | null> {
    return this.sessions.getUserByToken(db, token);
  }

  async validateSession(
    db: Database,
    token: string,
  ): Promise<TSessionDto | null> {
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
