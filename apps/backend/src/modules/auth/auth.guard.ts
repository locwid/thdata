import Elysia from "elysia";
import { zSessionCookieDto } from "../sessions";
import { dbProvider } from "@/db";
import { authService } from "./auth.service";

export const authSessionRequired = new Elysia({
  name: "auth.guard",
  detail: {
    security: [{ sessionCookie: [] }],
  },
})
  .use(dbProvider)
  .use(authService)
  .guard({
    cookie: zSessionCookieDto,
    detail: {
      description: "Requires a valid session cookie",
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
