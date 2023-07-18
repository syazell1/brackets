import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { getCommentsByPostId } from "../services/commentsApiService"

export const useGetCommentsByPostId = (postId : string ) => {
    return useInfiniteQuery(["comments"], ({ pageParam = 1 }) => {
        return getCommentsByPostId(pageParam, postId)
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