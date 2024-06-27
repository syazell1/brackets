import { useMutation } from "@tanstack/react-query"
import {useAxios} from "@/hooks/useAxios";
import { authStore, defaultAuthInfo } from "@/providers/AuthStore";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export const useLogout = () => {
  const client = useAxios();
  const {setIsLoggedIn, setAuthInfo} = authStore();
  const router = useRouter();
  const {toast} = useToast();

  return useMutation({
    mutationFn: async () => {
      const res = await client.post('/auth/logout');

      return res.data;
    },
    onSuccess: () => {
      toast({
        title: "Successfully Logout"
      })

      setIsLoggedIn(false)
      setAuthInfo(defaultAuthInfo)
      client.defaults.headers.common["Authorization"] = "";
      router.refresh()
    }
  })
}
