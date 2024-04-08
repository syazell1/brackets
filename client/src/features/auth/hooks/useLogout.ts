import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast";
import { useContext } from "react";
import { authContextProvider } from "@/providers/AuthContext";
import {AuthInfo} from "@/features/auth/types/auth.types";
import {useAxios} from "@/hooks/useAxios";

export const useLogout = () => {
  const { setIsLoggedInHandler, setDetails } = useContext(authContextProvider);
  const client = useAxios();

  return useMutation({
    mutationFn: async () => {
      const res = await client.post('/auth/logout');

      return res.data;
    },
    onSuccess: () => {
      toast.success("Logout successfully")

      setIsLoggedInHandler(false)
      setDetails({} as AuthInfo)
      client.defaults.headers.common["Authorization"] = "";
    }
  })
}
