import axios from "@/lib/axios";
import {AuthInfo, AuthResponse} from "@/features/auth/types/auth.types";
import { authStore } from "@/providers/AuthStore";

export const useRefreshToken = () => {
    const {setAuthInfo} = authStore();
    const refresh = async () => {
        try
        {
            const res = await axios.get<AuthResponse>('/auth/refresh', {
                withCredentials: true
            });

            setAuthInfo(res.data);

            return res.data.access_token
        }
        catch(err) {
            return "";
        }
    }

    return refresh
}