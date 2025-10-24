import { vMe } from "@/entities/user";
import { api } from "@/shared/api";
import * as v from "valibot";

interface SignInParams {
  email: string;
  password: string;
}

export const requestSignIn = async (params: SignInParams) => {
  const data = await api("/auth/sign-in", {
    method: "POST",
    body: params,
  });
  return v.parse(vMe, data);
};
