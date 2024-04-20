import { useAxios } from "@/hooks/useAxios"
import { PageList } from "@/types/page-lists.types";
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { CommentsData } from "../types/comments.type";

type useDeleteCommentType = {
  commentId : string,
  postId : string
}

export const useDeleteComment = () => {
  const client = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: useDeleteCommentType) => {
      const res = await client.delete(`comments/${data.commentId}`);

      return res.data;
    },
    onMutate: async ({postId, commentId}: useDeleteCommentType) => {
      await queryClient.cancelQueries({queryKey : ["comments", {postId}]})

      const prevComments = queryClient.getQueryData<InfiniteData<PageList<CommentsData[]>>>(["comments", {postId}])

      queryClient.setQueryData(['comments', {postId}], (old : InfiniteData<PageList<CommentsData[]>>) => {


        const newData = old.pages.map(v => {
          let commentsData = v.data.filter(v => {
            if(v.id !== commentId) {
              return v;
            }
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

      return {prevComments}
    },
    onError: (err, {postId}, context) => {
      queryClient.setQueryData(["comments", {postId}], context?.prevComments)

      toast.error(err.message)
    },
    onSuccess: () => {
      toast.success("Comment successfully added!")
    },
    onSettled:  (d, e, {postId}) =>{
      queryClient.invalidateQueries({
        queryKey: ["comments", {postId}]
      })
    }
  })
}
