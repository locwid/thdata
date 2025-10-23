import { Elysia } from "elysia";
import { automigrate } from "./db/automigrate";
import openapi from "@elysiajs/openapi";
import { authController } from "@/modules/auth";
import { usersController } from "./modules/users";
import * as z from "zod/v4";

await automigrate();

const apiV1 = new Elysia({ prefix: "/api/v1" })
  .use(authController)
  .use(usersController);

export const app = new Elysia()
  .use(
    openapi({
      mapJsonSchema: {
        zod: z.toJSONSchema,
      },
      provider: "scalar",
      documentation: {
        info: {
          title: "thdata API",
          version: "0.0.1",
        },
        components: {
          securitySchemes: {
            sessionCookie: {
              type: "apiKey",
              in: "cookie",
              name: "session",
            },
          },
        },
      },
    }),
  )
  .use(apiV1)
  .listen(3000, (server) => {
    console.log(`🦊 Elysia is running at ${server.hostname}:${server.port}`);
  });
