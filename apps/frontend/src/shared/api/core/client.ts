import { ofetch } from "ofetch";

export const api = ofetch.create({
  baseURL: "/api/v1",
  credentials: "include",
});
