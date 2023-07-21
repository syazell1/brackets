import { useMutation } from "@tanstack/react-query"
import { logoutUser } from "../services/authApiService"
import toast from "react-hot-toast";
import client from "@/lib/axios";
import { useRouter } from "next/navigation";

export const useLogout = () => {
    return useMutation(() => logoutUser(),
    {
        onSuccess: () => {
            toast.success("Logout Successful 🎉");
            client.defaults.headers.common['Authorization'] = "";
            
            window.location.reload(); 
        },
        onError: () => {

            toast.error('Something went wrong, Please try again. 🥲')           
        },
        retry: 1,
        retryDelay: 500
    })
}