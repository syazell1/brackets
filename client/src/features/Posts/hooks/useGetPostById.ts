import { useQuery } from "@tanstack/react-query"
import { getPostById } from "../services/postsApiService";

export const useGetPostById = (id: string) => {
    return useQuery(["todo", {id}], () => getPostById(id),
    {
        retry: 1,
        retryDelay: 500,
        refetchOnWindowFocus: false
    });
}