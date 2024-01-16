import axios from "axios";
import { AuthDetails, LoginInput } from "../types/auth.types";
import { AUTH_URL } from "client/constants/server-config";
import { auth_client } from "client/libs/axios";

export const loginUser = async (data: LoginInput) => {
  const res = await auth_client.post<AuthDetails>(`${AUTH_URL}/login`, data);

  return res.data;
}
