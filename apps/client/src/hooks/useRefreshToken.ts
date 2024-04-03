import {useContext} from "react";
import {authContextProvider} from "@/providers/AuthContext";
import {client} from "@/lib/axios";
import {AuthInfo} from "@/features/auth/types/auth.types";

export const useRefreshToken = () => {
    const {setDetails} = useContext(authContextProvider)

    return async () => {
        return await client.get<AuthInfo>('/auth/refresh', {
            withCredentials: true
        });
    };
}