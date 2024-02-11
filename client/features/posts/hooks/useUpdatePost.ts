import { useMutation, useQueryClient } from "@tanstack/react-query"
import { UpdatePostInput } from "../types/posts.types"
import { updatePost } from "../services/posts.api.services"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

type useUpdatePostType = {
  id: string,
  data: UpdatePostInput
}

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (updateInput: useUpdatePostType) => {
      return updatePost(updateInput.id, updateInput.data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"]
      })
      toast.success("Post updated successfully")
      router.refresh();
    },
    onError: (e) => {
      toast.error(e.message)
    }
  })
}
