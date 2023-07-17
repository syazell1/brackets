import { useQuery } from "@tanstack/react-query"
import { getCurrentUser } from "../services/authApiService"

export const useGetCurrentUser = () => {
    return useQuery(["current-user"], () => getCurrentUser(),
    {
        retry: 1,
        retryDelay: 500,
        refetchOnWindowFocus: false
    })
}