import Elysia from "elysia";
import { zSignInDto, zSignUpDto } from "./auth.dto";
import { toUserResponseDto, zUserResponseDto } from "../users";
import { authService } from "./auth.service";
import { dbProvider } from "@/db";
import { zErrorDto } from "@/lib/error";
import * as z from "zod/v4";
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
      body: zSignUpDto,
      response: {
        200: zUserResponseDto,
        401: zErrorDto,
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
      body: zSignInDto,
      response: {
        201: zUserResponseDto,
        401: zErrorDto,
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
        200: z.object({
          result: z.boolean(),
        }),
      },
      isAuthorized: true,
      detail: {
        security: [{ sessionCookie: [] }],
      },
    },
  );
