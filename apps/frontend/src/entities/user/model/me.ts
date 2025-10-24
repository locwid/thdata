import * as v from "valibot";

export const vMe = v.object({
  id: v.string(),
  email: v.pipe(v.string(), v.email()),
  createdAt: v.pipe(v.string(), v.isoTimestamp()),
  updatedAt: v.pipe(v.string(), v.isoTimestamp()),
});

export type VMe = v.InferInput<typeof vMe>;
