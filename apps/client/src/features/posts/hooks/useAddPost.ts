import { useMutation } from "@tanstack/react-query"
import { AddPostInput } from "../types/posts.types"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import {useAxios} from "@/hooks/useAxios";

export const useAddPost = () => {
  const router = useRouter();
  const client = useAxios();

  return useMutation({
    mutationFn: async (data: AddPostInput) => {
      const res = await client.post(`/posts`, data);

      return res.data;
    },
    onSuccess: () => {
      toast.success("Post added successfully!")

      router.push('/');
    },
    onError: () => {
      toast.error("Error on adding post.")
    }
  })
}
