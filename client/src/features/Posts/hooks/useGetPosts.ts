import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { getPosts } from "../services/postsApiService"

export const useGetPosts = () => {
    return useInfiniteQuery(["posts"], ({ pageParam = 1 }) => {
        return getPosts(pageParam)
    }, {
        getNextPageParam: (lastPage, allPages) => {
            const nextPage =
                lastPage.results.length === 10 ? allPages.length + 1 : undefined;
            return nextPage;
        },
        retry: 1,
        retryDelay: 500,
        refetchOnWindowFocus: false
    })
}