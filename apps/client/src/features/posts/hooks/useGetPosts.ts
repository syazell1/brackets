import { useInfiniteQuery } from "@tanstack/react-query"
import { getPosts } from "../services/posts.api.services"

export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam = 1 }) => {
      return getPosts(pageParam)
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
