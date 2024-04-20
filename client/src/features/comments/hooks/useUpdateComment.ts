import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query"
import { CommentsData, UpdateCommentInput } from "../types/comments.type"
import toast from "react-hot-toast"
import { useAxios } from "@/hooks/useAxios"
import { PageList } from "@/types/page-lists.types"

type useUpdateCommentType = {
  id: string,
  data: UpdateCommentInput
}

export const useUpdateComment = () => {
  const client = useAxios();
  const queryClient = useQueryClient(); 

  return useMutation({
    mutationFn: async ({ id, data }: useUpdateCommentType) => {
      const res = await client.patch(`comments/${id}`, data);

      return res.data;
    },
    onMutate: async ({id, data}) => {
      await queryClient.cancelQueries({queryKey: ["comments", {postId : data.post_id}]})


      const prevComments = queryClient.getQueryData<InfiniteData<PageList<CommentsData[]>>>(["comments", {postId : data.post_id}])

      queryClient.setQueryData(['comments', {postId : data.post_id}], (old : InfiniteData<PageList<CommentsData[]>>) => {
        const newData = old.pages.map(v => {

          let commentsData = v.data.map(v => {
            if(v.id === id) {
              v.content = data.content
            }
            return v;
          })

          return {
            data : commentsData,
            page_metadata : v.page_metadata
          }
        });

        return {
          pages: newData,
          pageParams: old.pageParams
        }
      })

      return { prevComments }
    },
    onSuccess: () => {
      toast.success("Comment updated successfully")
    },
    onError: (err, {data}, context) => {
      queryClient.setQueryData(["comments", {postId : data.post_id}], context?.prevComments)

      toast.error(err.message)
    },
    onSettled: (d, e, {data}) => {
      queryClient.invalidateQueries({
        queryKey: ["comments",  {postId : data.post_id}]
      })
    }
  })
} 
