import { USERS_URL } from "@/constants/server-config";
import { UserDetails } from "../types/Users";
import client from "@/lib/axios";

export const getUserDetails = async (username : string) => {
    const res = await client.get<UserDetails>(`${USERS_URL}/${username}`);

    return res.data;
}