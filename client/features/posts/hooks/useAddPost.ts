import { useMutation } from "@tanstack/react-query"
import { AddPostInput } from "../types/posts.types"
import { addPost } from "../services/posts.api.services"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

export const useAddPost = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: AddPostInput) => {
      return addPost(data)
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
