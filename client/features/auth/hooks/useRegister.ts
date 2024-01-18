import { useMutation } from "@tanstack/react-query"
import { RegisterInput } from "../types/auth.types"
import { registerUser } from "../services/auth.api.service"
import toast from "react-hot-toast"
import client from "client/libs/axios"
import { useRouter } from "next/navigation"
import { useContext } from "react"
import { authContextProvider } from "client/providers/AuthContext"

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
      setDetails(data);

      router.push('/')
    }
  })
}
