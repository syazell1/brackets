import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { AddCommentInput } from "../types/comments.type"
import { useAxios } from "@/hooks/useAxios"

export const useAddComment = (postId : string) => {
  const client = useAxios();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: AddCommentInput) => {
      const res = await client.post('/comments', data);

      return res.data;
    },
    onSuccess: () => {
      toast.success("Comment successfully added!")

      queryClient.invalidateQueries({
        queryKey: ["comments", {postId}]
      })
    }
  })
}
