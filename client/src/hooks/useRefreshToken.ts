import {useContext} from "react";
import {authContextProvider} from "@/providers/AuthContext";
import axios, {client} from "@/lib/axios";
import {AuthInfo} from "@/features/auth/types/auth.types";
import { isAxiosError } from "axios";

export const useRefreshToken = () => {
    const {setDetails} = useContext(authContextProvider)

    const refresh = async () => {
        try
        {
            const res = await axios.get<AuthInfo>('/auth/refresh', {
                withCredentials: true
            });

            setDetails(res.data);

            return res.data.access_token
        }
        catch(err) {
            if(isAxiosError(err) && err.response?.status === 401) {
                return "";
            }
        }
    }

    return refresh
}