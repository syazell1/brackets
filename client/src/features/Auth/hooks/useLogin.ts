import { LoginUserInput } from "../types/Auth"
import { loginUser } from "../services/authApiService"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import client from "@/lib/axios"

export const useLogin = () => {
    const router = useRouter();
    return useMutation((data: LoginUserInput) => loginUser(data),
    {
        onSuccess: (data) => {
            toast.success("Login successful");
            client.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`
            
            router.push('/')
        },
        onError: () => {
            toast.error('Invalid Login, please try again 🥲')           
        },
        retry: 1,
        retryDelay: 500
    })
}