import { useMutation } from "@tanstack/react-query"
import {AuthResponse, LoginInput} from "../types/auth.types"
import { useRouter } from 'next/navigation'
import { authStore } from "@/providers/AuthStore";
import axios from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils";

export const useLogin = () => {
  const router = useRouter();
  const {setAuthInfo, setIsLoggedIn} = authStore();
  const {toast} = useToast();

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const res = await axios.post<AuthResponse>('/auth/login', data, {withCredentials : true});

      return res.data;
    },
    onSuccess: (data) => {
      toast({
        title : "Login Successfully",
        description: `Welcome ${data.username}!`,
        className: cn(
          'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4'
        )
      })

      setAuthInfo(data)
      setIsLoggedIn(true)

      router.push('/')
    }
  })
}
