import { useMutation } from "@tanstack/react-query"
import { deleteComments } from "../services/comments.api.service"
import toast from "react-hot-toast"

export const useDeleteComment = () => {
  return useMutation({
    mutationFn: (id: string) => {
      return deleteComments(id)
    },
    onSuccess: () => {
      toast.success("Comment successfully added!")
    }
  })
}
