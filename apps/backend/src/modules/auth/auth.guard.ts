import Elysia from "elysia";
import { tSessionCookieDto } from "../sessions";
import { dbProvider } from "@/db";
import { authService } from "./auth.service";

export const authSessionRequired = new Elysia({
  name: "auth.guard",
})
  .use(dbProvider)
  .use(authService)
  .guard({
    cookie: tSessionCookieDto,
    detail: {
      description: "Require user to be logged in",
      security: [{ sessionCookie: [] }],
    },
  })
  .macro({
    isAuthorized: {
      resolve: async ({ cookie, auth, db, status }) => {
        const token = cookie.session.value;
        const currentSession = await auth.validateSession(db, token);
        if (!currentSession) {
          return status(401, { message: "Unauthorized" });
        }
        return {
          currentSession,
        };
      },
    },
  });
