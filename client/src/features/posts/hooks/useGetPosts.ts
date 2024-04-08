import {useInfiniteQuery} from "@tanstack/react-query"
import {PageList} from "@/types/page-lists.types";
import {PostsDetails} from "@/features/posts/types/posts.types";
import {useAxios} from "@/hooks/useAxios";

export const useGetPosts = () => {
  const client = useAxios();

  return useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam = 1 }) => {
      const res =  await client.get<PageList<PostsDetails[]>>(`/posts?page=${pageParam}`)

      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.data.length == 10 ? allPages.length + 1 : undefined
    }
  }
  )
}
