import { useMutation } from "@tanstack/react-query"
import { logoutUser } from "../services/auth.api.service"
import toast from "react-hot-toast";
import { useContext } from "react";
import { authContextProvider } from "@/providers/AuthContext";
import { UsersInfo } from "@/features/users/types/users.types";
import client from "@/libs/axios";

export const useLogout = () => {
  const { setIsLoggedInHandler, setDetails } = useContext(authContextProvider);

  return useMutation({
    mutationFn: () => {
      return logoutUser();
    },
    onSuccess: () => {
      toast.success("Logout successfully")

      setIsLoggedInHandler(false)
      setDetails({} as UsersInfo)
      client.defaults.headers.common["Authorization"] = "";
    }
  })
}
