import { useMutation } from "@tanstack/react-query"
import { UserUpdateDetailsInput } from "../types/Users"
import { updateUserDetails } from "../services/userApiService"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export const useUpdateUserDetails = (username : string) => {
    const router = useRouter();

    return useMutation((data: UserUpdateDetailsInput) => updateUserDetails(data),
    {
        onSuccess: (data) => {
            toast.success("Post Successfully created. 🎉");
            
            router.push(`/profile/${username}`)
        },
        onError: () => {
            toast.error('Something went wrong, please try again. 🥲')           
        },
        retry: 1,
        retryDelay: 500
    })
}