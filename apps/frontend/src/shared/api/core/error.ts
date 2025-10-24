import * as v from "valibot";

export const vApiError = v.object({
  message: v.string(),
});

export type VApiError = v.InferInput<typeof vApiError>;
