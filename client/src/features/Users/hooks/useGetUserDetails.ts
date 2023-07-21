import { useQuery } from "@tanstack/react-query"
import { getUserDetails } from "../services/userApiService"

export const useGetUserDetails = (username : string) => {
    return useQuery(["user-details", {username}], () => getUserDetails(username),
    {
        retry: 1, 
        refetchOnWindowFocus: false
    })
}