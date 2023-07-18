import { useQuery } from "@tanstack/react-query"
import { getCommentById } from "../services/commentsApiService"

export const useGetCommentById = (commentId : string) => {
    return useQuery(["comment", {commentId}], () => getCommentById(commentId),
    {
        retry: 1,
        retryDelay: 500,
        refetchOnWindowFocus: false
    });
}