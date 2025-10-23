import * as z from "zod/v4";

export const zSessionDto = z.object({
  id: z.string(),
  userId: z.string(),
  token: z.string(),
  expiresAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const zCreateSessionDto = z.object({
  userId: z.string(),
});

export const zSessionCookieDto = z.object({
  session: z.string(),
});

export type ZSessionDto = z.infer<typeof zSessionDto>;
export type ZCreateSessionDto = z.infer<typeof zCreateSessionDto>;
