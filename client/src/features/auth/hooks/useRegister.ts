import { useMutation } from "@tanstack/react-query"
import {AuthInfo, RegisterInput} from "../types/auth.types"
import { useRouter } from "next/navigation"
import { authStore } from "@/providers/AuthStore"
import axios from "@/lib/axios"
import { useToast } from "@/components/ui/use-toast"

export const useRegister = () => {
  const router = useRouter();
  const {setAuthInfo, setIsLoggedIn} = authStore();
  const {toast} = useToast();

  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      const res = await axios.post<AuthInfo>(`/auth/register`, {
        credentials : {
          username : data.username,
          password : data.password
        },
        info: {
          first_name : data.first_name,
          last_name : data.last_name,
          email : data.email 
        },
      },
      {withCredentials: true}
    );

      return res.data;
    },
    onSuccess: (data) => {
      toast({
        title : "Registration success!",
        description: `Welcome to brackets, @${data.username}!`
      })

      setAuthInfo(data);
      setIsLoggedIn(true)

      router.push('/')
    }
  })
}
