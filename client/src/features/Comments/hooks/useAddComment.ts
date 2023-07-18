import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addComment } from "../services/commentsApiService"
import { AddCommentInput } from "../types/Comments"
import toast from "react-hot-toast";

export const useAddComment = () => {
    const queryClient = useQueryClient();

    return useMutation((data: AddCommentInput) => addComment(data),
    {
        onSuccess: () => {
            toast.success("Comment Successfully Added 🎉")

            queryClient.invalidateQueries(["comments"])
        },
        onError: () => {
            toast.error("Something went wrong, Please try again. 🥲")
        },
        retry: 1,
        retryDelay: 500
    })
}