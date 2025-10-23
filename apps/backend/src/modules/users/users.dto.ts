import { t } from "elysia";

export const tUserDto = t.Object({
  id: t.String(),
  email: t.String({ format: "email" }),
  password: t.String(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export const tCreateUserDto = t.Object({
  id: t.Optional(t.String()),
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 6 }),
});

export const tUserResponseDto = t.Composite([
  t.Omit(tUserDto, ["password", "createdAt", "updatedAt"]),
  t.Object({
    createdAt: t.String({ format: "date-time" }),
    updatedAt: t.String({ format: "date-time" }),
  }),
]);

export type TUserDto = typeof tUserDto.static;
export type TCreateUserDto = typeof tCreateUserDto.static;
export type TUserResponseDto = typeof tUserResponseDto.static;
