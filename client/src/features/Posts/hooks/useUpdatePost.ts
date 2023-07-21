import { useMutation } from "@tanstack/react-query"
import { updatePost } from "../services/postsApiService"
import { UpdatePostInput } from "../types/Posts"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

type useUpdatePostType = {
    id: string,
    data: UpdatePostInput
}

export const useUpdatePost = () => {
    const router = useRouter();
    
    return useMutation(({id, data}: useUpdatePostType) => updatePost(id, data),
    {
        onSuccess: (data) => {
            toast.success("Post Successfully updated. 🎉");
            
            router.push('/')
            router.refresh();
        },
        onError: () => {
            toast.error('Something went wrong, please try again. 🥲')           
        },
        retry: 1,
        retryDelay: 500
    })
}