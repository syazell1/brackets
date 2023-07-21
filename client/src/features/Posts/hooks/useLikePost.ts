import { useMutation } from "@tanstack/react-query"
import { likePost } from "../services/postsApiService";
import { toast } from "react-hot-toast";

export const useLikePost = () => {
    return useMutation((id: string) => likePost(id),
    {
        onSuccess: () => {
            toast.success("Successfully liked a Post")
        },
        onError: () => {
            toast.error("Something went wrong, please try again. 🥲");
        },
        retry: 1,
        retryDelay: 500
    });
}