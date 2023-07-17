import { useQuery } from "@tanstack/react-query"
import { getPostsByOwnerName } from "../services/postsApiService"

export const useGetPostsByOwnerName = (ownerName: string) => {
    return useQuery(["posts", {ownerName}], () => getPostsByOwnerName(ownerName), {
        retry: 1,
        retryDelay: 500,
        refetchOnWindowFocus: false
    })
}