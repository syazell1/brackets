import { useMutation } from "@tanstack/react-query"
import { AddPostInput } from "client/features/posts/types/posts.types"
import { addComments } from "../services/comments.api.service"
import toast from "react-hot-toast"

export const useAddComment = () => {
  return useMutation({
    mutationFn: (data: AddPostInput) => {
      return addComments(data)
    },
    onSuccess: () => {
      toast.success("Comment successfully added!")
    }
  })
}
