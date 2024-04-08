import { useMutation } from "@tanstack/react-query"
import {AuthInfo, LoginInput} from "../types/auth.types"
import toast from "react-hot-toast"
import { useRouter } from 'next/navigation'
import { useContext } from "react"
import { authContextProvider } from "@/providers/AuthContext"
import {useAxios} from "@/hooks/useAxios";

export const useLogin = () => {
  const router = useRouter();
  const { setDetails, setIsLoggedInHandler } = useContext(authContextProvider);
  const client = useAxios();

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const res = await client.post<AuthInfo>('/auth/login', data);

      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Login success!, Welcome!");

      client.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`;
      setDetails(data)
      setIsLoggedInHandler(true)

      router.push('/')
    }
  })
}
