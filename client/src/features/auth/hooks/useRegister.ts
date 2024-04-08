import { useMutation } from "@tanstack/react-query"
import {AuthInfo, RegisterInput} from "../types/auth.types"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useContext } from "react"
import { authContextProvider } from "@/providers/AuthContext"
import client from "@/lib/axios"
import {useAxios} from "@/hooks/useAxios";

export const useRegister = () => {
  const router = useRouter();
  const { setDetails } = useContext(authContextProvider);
  const client = useAxios();

  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      const res = await client.post<AuthInfo>(`/auth/register`, data);

      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Registration success!, Welcome!");

      client.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`;
      setDetails(data);

      router.push('/')
    }
  })
}
