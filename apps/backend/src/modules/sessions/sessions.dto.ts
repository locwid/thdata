import { t } from "elysia";

export const tSessionDto = t.Object({
  id: t.String(),
  userId: t.String(),
  token: t.String(),
  expiresAt: t.Date(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export const tCreateSessionDto = t.Object({
  userId: t.String(),
});

export const tSessionCookieDto = t.Object({
  session: t.String(),
});

export type TSessionDto = typeof tSessionDto.static;
export type TCreateSessionDto = typeof tCreateSessionDto.static;
