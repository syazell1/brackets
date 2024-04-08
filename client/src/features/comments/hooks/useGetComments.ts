import { useInfiniteQuery } from "@tanstack/react-query"
import { useAxios } from "@/hooks/useAxios";
import { PageList } from "@/types/page-lists.types";
import { CommentsData } from "../types/comments.type";

export const useGetPostsComments = (postId: string) => {
  const client = useAxios();


  return useInfiniteQuery({
    queryKey: ["comments", { postId }],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await client.get<PageList<CommentsData[]>>(`/posts/${postId}/comments?page=${pageParam}`);

      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.data.length == 10 ? allPages.length + 1 : undefined;
    }
  }
  )
}
