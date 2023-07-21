import { useQuery } from "@tanstack/react-query"
import { getCurrentUser } from "../services/authApiService"

export const useGetCurrentUser  = () => {
    return useQuery(["current-user"], async () => await getCurrentUser(),
    {
        refetchOnWindowFocus: false
    })
}