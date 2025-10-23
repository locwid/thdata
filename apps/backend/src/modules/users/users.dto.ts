import * as z from "zod/v4";

export const zUserDto = z.object({
  id: z.string(),
  email: z.email(),
  password: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const zCreateUserDto = z.object({
  id: z.string().optional(),
  email: z.email(),
  password: z.string().min(6),
});

export const zUserResponseDto = zUserDto.omit({ password: true });

export type ZUserDto = z.infer<typeof zUserDto>;
export type ZCreateUserDto = z.infer<typeof zCreateUserDto>;
export type ZUserResponseDto = z.infer<typeof zUserResponseDto>;
