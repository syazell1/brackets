import { useInfiniteQuery } from "@tanstack/react-query"
import { useAxios } from "@/hooks/useAxios";
import { PageList } from "@/types/page-lists.types";
import { CommentsData } from "../types/comments.type";
import { authStore } from "@/providers/AuthStore";


interface CommentStatusResponse {
  is_liked: boolean,
  comment_id: string
}


export const useGetPostsComments = (postId: string) => {
  const client = useAxios();
  const {isLoggedIn} = authStore();

  return useInfiniteQuery({
    queryKey: ["comments", { postId }],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await client.get<PageList<CommentsData[]>>(`/posts/${postId}/comments?page=${pageParam}`);

      if (isLoggedIn) {
        let commentIds = res.data.data.map(v => v.id);

        let commentStatus = await client.post<CommentStatusResponse[]>('/comments/check-likes', { comment_ids: commentIds});

        let newData = res.data.data.map(v => {
          let idx = commentStatus.data.findIndex(d => d.comment_id === v.id);
          return { ...v, is_liked: commentStatus.data[idx].is_liked }
        })
        res.data.data = newData;
        return res.data;
      }

      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.data.length == 10 ? allPages.length + 1 : undefined;
    }
  }
  )
}
