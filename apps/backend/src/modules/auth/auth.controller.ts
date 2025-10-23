import Elysia, { t } from "elysia";
import { tSignInDto, tSignUpDto } from "./auth.dto";
import { toUserResponseDto, tUserResponseDto } from "../users";
import { authService } from "./auth.service";
import { dbProvider } from "@/db";
import { tErrorDto } from "@/lib/error";
import { authSessionRequired } from "./auth.guard";

export const authController = new Elysia({
  name: "auth.controller",
  prefix: "auth",
  tags: ["Auth"],
})
  .use(dbProvider)
  .use(authService)
  .use(authSessionRequired)
  .post(
    "/sign-up",
    async ({ auth, db, body, status, cookie }) => {
      const data = await auth.signUp(db, body);
      if (!data) {
        return status(401, {
          message: "Invalid credentials",
        });
      }
      cookie.session.set({
        value: data.session.token,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        expires: data.session.expiresAt,
      });
      return toUserResponseDto(data.user);
    },
    {
      body: tSignUpDto,
      response: {
        200: tUserResponseDto,
        401: tErrorDto,
      },
    },
  )
  .post(
    "/sign-in",
    async ({ auth, body, db, status, cookie }) => {
      const data = await auth.signIn(db, body);
      if (!data) {
        return status(401, {
          message: "Invalid credentials",
        });
      }
      cookie.session.set({
        value: data.session.token,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        expires: data.session.expiresAt,
      });
      return toUserResponseDto(data.user);
    },
    {
      body: tSignInDto,
      response: {
        201: tUserResponseDto,
        401: tErrorDto,
      },
    },
  )
  .post(
    "/sign-out",
    async ({ auth, db, currentSession, cookie }) => {
      const result = await auth.signOut(db, currentSession.token);
      cookie.session.remove();
      return { result };
    },
    {
      response: {
        200: t.Object({
          result: t.Boolean(),
        }),
      },
      isAuthorized: true,
      detail: {
        security: [{ sessionCookie: [] }],
      },
    },
  );
