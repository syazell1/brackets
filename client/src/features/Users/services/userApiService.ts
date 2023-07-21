import { USERS_URL } from "@/constants/server-config";
import { UserDetails, UserUpdateDetailsInput } from "../types/Users";
import client from "@/lib/axios";

export const getUserDetails = async (username : string) => {
    const res = await client.get<UserDetails>(`${USERS_URL}/${username}`);

    return res.data;
}

export const updateUserDetails = async (data: UserUpdateDetailsInput) => {
    const res = await client.put(`${USERS_URL}`, data);

    return res.data;
}