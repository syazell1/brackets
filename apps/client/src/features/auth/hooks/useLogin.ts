import { useMutation } from "@tanstack/react-query"
import { loginUser } from "../services/auth.api.service"
import { LoginInput } from "../types/auth.types"
import toast from "react-hot-toast"
import client from "client/libs/axios"
import { useRouter } from 'next/navigation'
import { useContext } from "react"
import { authContextProvider } from "client/providers/AuthContext"

export const useLogin = () => {
  const router = useRouter();
  const { setDetails, setIsLoggedInHandler } = useContext(authContextProvider);

  return useMutation({
    mutationFn: (data: LoginInput) => {
      return loginUser(data)
    },
    onSuccess: (data) => {
      toast.success("Login success!, Welcome!");

      client.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`;
      setDetails(data.user)
      setIsLoggedInHandler(true)

      router.push('/')
    }
  })
}
