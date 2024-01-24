import { AuthInfo, LoginInput, RegisterInput } from "../types/auth.types";
import { AUTH_URL } from "client/constants/server-config";
import client, { auth_client } from "client/libs/axios";

export const loginUser = async (data: LoginInput) => {
  const res = await auth_client.post<AuthInfo>(`${AUTH_URL}/login`, data);

  return res.data;
}

export const registerUser = async (data: RegisterInput) => {
  const res = await auth_client.post<AuthInfo>(`${AUTH_URL}/register`, data);

  return res.data;
}

export const logoutUser = async () => {
  const res = await client.post(`${AUTH_URL}/logout`);

  return res.data;
}
