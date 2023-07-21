import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deletePost } from "../services/postsApiService"
import { toast } from "react-hot-toast"

export const useDeletePost = () => {
    const queryClient = useQueryClient();

    return useMutation((id: string) => deletePost(id),
    {
        onSuccess: () => {
            toast.success("Successfully deleted your Post")

           queryClient.invalidateQueries(["posts"]) 
        },
        onError: () => {
            toast.success("Something went wrong. 🥲")
        },
        retry: 1,
        retryDelay: 500
    })
}