import { useMutation } from "@tanstack/react-query"
import { RegisterInput } from "../types/auth.types"
import { registerUser } from "../services/auth.api.service"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useContext } from "react"
import { authContextProvider } from "@/providers/AuthContext"
import client from "@/libs/axios"

export const useRegister = () => {
  const router = useRouter();
  const { setDetails } = useContext(authContextProvider);

  return useMutation({
    mutationFn: (data: RegisterInput) => {
      return registerUser(data)
    },
    onSuccess: (data) => {
      toast.success("Registration success!, Welcome!");

      client.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`;
      setDetails(data.user);

      router.push('/')
    }
  })
}
