import { useMutation } from "@tanstack/react-query"
import { UpdateCommentInput } from "../types/comments.type"
import { updateComments } from "../services/comments.api.service"
import toast from "react-hot-toast"

type useUpdateCommentType = {
  id: string,
  data: UpdateCommentInput
}

export const useUpdateComment = () => {
  return useMutation({
    mutationFn: ({ id, data }: useUpdateCommentType) => {
      return updateComments(id, data)
    },
    onSuccess: () => {
      toast.success("Comment updated successfully")
    },
    onError: () => {
      toast.error("Comment was not updated.")
    }
  })
} 
