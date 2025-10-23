import * as z from "zod/v4";

export const zErrorDto = z.object({
  message: z.string(),
});
