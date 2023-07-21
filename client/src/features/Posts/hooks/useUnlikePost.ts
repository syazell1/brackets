import { useMutation } from "@tanstack/react-query"
import { likePost, unlikePost } from "../services/postsApiService";
import { toast } from "react-hot-toast";

export const useUnlikePost = () => {
    return useMutation((id: string) => unlikePost(id),
    {
        onError: () => {
            toast.error("Something went wrong, please try again. 🥲");
        },
        retry: 1,
        retryDelay: 500
    });
}