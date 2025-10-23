import Elysia from "elysia";
import { authSessionRequired } from "../auth/auth.guard";
import { usersService } from "./users.service";
import { dbProvider } from "@/db";
import { tUserResponseDto } from "./users.dto";
import { toUserResponseDto } from "./users.helpers";
import { tErrorDto } from "@/lib/error";

export const usersController = new Elysia({
  name: "users.controller",
  prefix: "users",
  tags: ["Users"],
  detail: {
    security: [{ sessionCookie: [] }],
  },
})
  .use(dbProvider)
  .use(authSessionRequired)
  .use(usersService)
  .get(
    "/me",
    async ({ currentSession, users, db, status }) => {
      const user = await users.findById(db, currentSession.userId);
      if (!user) {
        return status(401, { message: "Unauthorized" });
      }
      return toUserResponseDto(user);
    },
    {
      response: {
        200: tUserResponseDto,
        401: tErrorDto,
      },
      isAuthorized: true,
    },
  );
