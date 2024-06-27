import { useInfiniteQuery } from "@tanstack/react-query"
import { PageList } from "@/types/page-lists.types";
import { PostsDetails } from "@/features/posts/types/posts.types";
import { useAxios } from "@/hooks/useAxios";
import { authStore } from "@/providers/AuthStore";

interface PostStatusResponse {
  is_liked: boolean,
  post_id: string
}

type QueryKeyType = string | {[key : string] : string}

export const useGetAllPosts= (search?: string) => {
  const client = useAxios();
  const { isLoggedIn, authInfo} = authStore();
  let queryKey : QueryKeyType[]=  ["posts"]

  if(isLoggedIn) {
    queryKey.push({userId : authInfo.id})
  }

  if(search !== undefined && search.length > 0) {
    queryKey.push({search})
  }

  return useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      let postUrl = `/posts?page=${pageParam}`;
      if(search !== undefined && search.length > 0) {
        postUrl += `&search=${search}`
      }
      const res = await client.get<PageList<PostsDetails[]>>(postUrl)

      if (isLoggedIn) {
        let postIds = res.data.data.map(v => v.id);

        let postStatus = await client.post<PostStatusResponse[]>('/posts/check-likes', { post_ids: postIds });

        let newData = res.data.data.map(v => {
          let postStatusIdx = postStatus.data.findIndex(d => d.post_id === v.id);
          return { ...v, is_liked: postStatus.data[postStatusIdx].is_liked }
        })
        res.data.data = newData;

        return res.data;
      }
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.data.length == 10 ? allPages.length + 1 : undefined
    }
  }
  )
}
