import { useMutation } from "@tanstack/react-query"
import { CreatePostInput } from "../types/Posts"
import { createPost } from "../services/postsApiService"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

export const useCreatePost = () => {
    const router = useRouter();

    return useMutation((data: CreatePostInput) => createPost(data),
    {
        onSuccess: (data) => {
            toast.success("Post Successfully created. 🎉");
            
            router.push('/')
        },
        onError: () => {
            toast.error('Something went wrong, please try again. 🥲')           
        },
        retry: 1,
        retryDelay: 500
    })
}