import { useAxios } from "@/hooks/useAxios"
import { useQuery } from "@tanstack/react-query"
import { AuthInfo } from "../types/auth.types";
import { useContext } from "react";
import { authContextProvider } from "@/providers/AuthContext";

export const useGetCurrentUser = () => {
    const client = useAxios();
    const {isLoggedIn} = useContext(authContextProvider)

    const queryResult = useQuery({
        queryFn: async () => {
            const res = await client.get<AuthInfo>('/auth/current_user');

            return res.data
        },
        queryKey: ["current_user"],
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnMount: false
    })

    return {
        isLoggedIn,
        ...queryResult
    }
}