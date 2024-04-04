import { useAxios } from "@/hooks/useAxios"
import { useQuery } from "@tanstack/react-query"
import { AuthInfo } from "../types/auth.types";

export const useGetCurrentUser = () => {
    const client = useAxios();


    return useQuery({
        queryFn: async () => {
            const res = await client.get<AuthInfo>('/auth/current_user');

            return res.data
        },
        queryKey: ["current_user"],
        retry: 1,
        refetchOnWindowFocus: false
    })
}