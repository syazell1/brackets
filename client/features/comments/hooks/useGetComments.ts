import { useInfiniteQuery } from "@tanstack/react-query"
import { getPostsComments } from "../services/comments.api.service";

export const useGetPostsComments = (id: string) => {
  return useInfiniteQuery({
    queryKey: ["comments", { id }],
    queryFn: ({ pageParam = 1 }) => {
      return getPostsComments(id, pageParam)
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage =
        lastPage.data.length == 10 ? allPages.length + 1 : undefined;

      return nextPage
    }
  }
  )
}
