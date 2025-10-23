import { t } from "elysia";

export const tSignInDto = t.Object({
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 6 }),
});

export const tSignUpDto = t.Object({
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 6 }),
});

export type TSignInDto = typeof tSignInDto.static;
export type TSignUpDto = typeof tSignUpDto.static;
