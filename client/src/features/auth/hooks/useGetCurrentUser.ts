import { useAxios } from "@/hooks/useAxios"
import { useQuery } from "@tanstack/react-query"
import { AuthInfo } from "../types/auth.types";
import { useContext } from "react";
import { authStore } from "@/providers/AuthStore";

export const useGetCurrentUser = () => {
    const client = useAxios();
    const {isLoggedIn, authInfo} = authStore();

    const queryResult = useQuery({
        queryFn: async () => {
            const res = await client.get<AuthInfo>('/auth/current-user');

            return res.data
        },
        queryKey: ["current_user"],
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnMount: false
    })

    return {
        isLoggedIn,
        authInfo,
        ...queryResult
    }
}