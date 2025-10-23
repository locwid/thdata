import Elysia from "elysia";
import * as z from "zod/v4";

export const zSignInDto = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const zSignUpDto = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export type ZSignInDto = z.infer<typeof zSignInDto>;
export type ZSignUpDto = z.infer<typeof zSignUpDto>;
